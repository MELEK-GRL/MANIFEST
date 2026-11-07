using ManifestApp.VisionBoard.Features.Cqrs;
using ManifestApp.VisionBoard.Repositories;

namespace ManifestApp.VisionBoard.Features.Vision;

public sealed class GetVisionBoardHandler : IQueryHandler<GetVisionBoardQuery, VisionBoardView>
{
    private readonly IVisionBoardRepository _boards;

    public GetVisionBoardHandler(IVisionBoardRepository boards)
    {
        _boards = boards;
    }

    public async Task<VisionBoardView> HandleAsync(
        GetVisionBoardQuery query,
        CancellationToken cancellationToken)
    {
        var board = await _boards.GetByUserIdAsync(query.UserId, cancellationToken);
        if (board is null)
        {
            return new VisionBoardView([]);
        }

        var items = board.Items
            .OrderBy(item => item.CreatedAtUtc)
            .Select(item => new VisionBoardItemView(item.Id, item.X, item.Y, item.Scale))
            .ToList();
        return new VisionBoardView(items);
    }
}

public sealed class GetVisionBoardItemImageHandler
    : IQueryHandler<GetVisionBoardItemImageQuery, VisionBoardItemImage?>
{
    private readonly IVisionBoardRepository _boards;

    public GetVisionBoardItemImageHandler(IVisionBoardRepository boards)
    {
        _boards = boards;
    }

    public async Task<VisionBoardItemImage?> HandleAsync(
        GetVisionBoardItemImageQuery query,
        CancellationToken cancellationToken)
    {
        var item = await _boards.GetItemAsync(query.UserId, query.ItemId, cancellationToken);
        if (item is null || item.Photo.Length == 0)
        {
            return null;
        }

        return new VisionBoardItemImage(item.Photo, item.ContentType);
    }
}

public sealed class AddVisionBoardItemHandler
    : ICommandHandler<AddVisionBoardItemCommand, AddVisionBoardItemResult>
{
    public const int MaxBytes = 8_000_000;
    public const int MaxItems = 40;

    private readonly IVisionBoardRepository _boards;

    public AddVisionBoardItemHandler(IVisionBoardRepository boards)
    {
        _boards = boards;
    }

    public async Task<AddVisionBoardItemResult> HandleAsync(
        AddVisionBoardItemCommand command,
        CancellationToken cancellationToken)
    {
        if (command.Photo.Length is 0 or > MaxBytes)
        {
            return AddVisionBoardItemResult.Fail(
                command.Photo.Length == 0 ? "photo_invalid" : "photo_too_large");
        }

        var contentType = PhotoKind(command.Photo) ?? NormalizeContentType(command.ContentType);
        if (contentType is null)
        {
            return AddVisionBoardItemResult.Fail("photo_invalid");
        }

        var board = await _boards.GetByUserIdAsync(command.UserId, cancellationToken);
        if (board is null)
        {
            board = new Entities.VisionBoard(command.UserId);
            await _boards.AddAsync(board, cancellationToken);
        }

        if (board.Items.Count >= MaxItems)
        {
            return AddVisionBoardItemResult.Fail("board_full");
        }

        var item = board.AddItem(
            command.Photo,
            contentType,
            Clamp(command.X),
            Clamp(command.Y),
            ClampScale(command.Scale));
        await _boards.SaveAsync(cancellationToken);
        return AddVisionBoardItemResult.Ok(item.Id);
    }

    private static string? NormalizeContentType(string contentType)
    {
        if (string.Equals(contentType, "image/jpeg", StringComparison.OrdinalIgnoreCase)
            || string.Equals(contentType, "image/jpg", StringComparison.OrdinalIgnoreCase))
        {
            return "image/jpeg";
        }

        if (string.Equals(contentType, "image/png", StringComparison.OrdinalIgnoreCase))
        {
            return "image/png";
        }

        return null;
    }

    private static string? PhotoKind(byte[] photo)
    {
        if (photo.Length >= 3 && photo[0] == 0xFF && photo[1] == 0xD8 && photo[2] == 0xFF)
        {
            return "image/jpeg";
        }

        if (photo.Length >= 8
            && photo[0] == 0x89
            && photo[1] == 0x50
            && photo[2] == 0x4E
            && photo[3] == 0x47
            && photo[4] == 0x0D
            && photo[5] == 0x0A
            && photo[6] == 0x1A
            && photo[7] == 0x0A)
        {
            return "image/png";
        }

        return null;
    }

    private static double Clamp(double value) => Math.Clamp(value, 0, 10_000);

    private static double ClampScale(double value) => Math.Clamp(value, 0.4, 3);
}

public sealed class SaveVisionBoardLayoutHandler
    : ICommandHandler<SaveVisionBoardLayoutCommand, SaveVisionBoardLayoutResult>
{
    private readonly IVisionBoardRepository _boards;

    public SaveVisionBoardLayoutHandler(IVisionBoardRepository boards)
    {
        _boards = boards;
    }

    public async Task<SaveVisionBoardLayoutResult> HandleAsync(
        SaveVisionBoardLayoutCommand command,
        CancellationToken cancellationToken)
    {
        var board = await _boards.GetByUserIdAsync(command.UserId, cancellationToken);
        if (board is null)
        {
            return command.Items.Count == 0
                ? SaveVisionBoardLayoutResult.Ok()
                : SaveVisionBoardLayoutResult.Fail("board_missing");
        }

        var keep = command.Items.Select(item => item.Id).ToHashSet();
        foreach (var existing in board.Items.ToList())
        {
            if (!keep.Contains(existing.Id))
            {
                board.RemoveItem(existing.Id);
            }
        }

        foreach (var item in command.Items)
        {
            if (!board.TryUpdateItem(
                    item.Id,
                    Math.Clamp(item.X, 0, 10_000),
                    Math.Clamp(item.Y, 0, 10_000),
                    Math.Clamp(item.Scale, 0.4, 3)))
            {
                return SaveVisionBoardLayoutResult.Fail("item_missing");
            }
        }

        await _boards.SaveAsync(cancellationToken);
        return SaveVisionBoardLayoutResult.Ok();
    }
}

public sealed class DeleteVisionBoardItemHandler
    : ICommandHandler<DeleteVisionBoardItemCommand, DeleteVisionBoardItemResult>
{
    private readonly IVisionBoardRepository _boards;

    public DeleteVisionBoardItemHandler(IVisionBoardRepository boards)
    {
        _boards = boards;
    }

    public async Task<DeleteVisionBoardItemResult> HandleAsync(
        DeleteVisionBoardItemCommand command,
        CancellationToken cancellationToken)
    {
        var board = await _boards.GetByUserIdAsync(command.UserId, cancellationToken);
        if (board is null || !board.RemoveItem(command.ItemId))
        {
            return DeleteVisionBoardItemResult.Fail("item_missing");
        }

        await _boards.SaveAsync(cancellationToken);
        return DeleteVisionBoardItemResult.Ok();
    }
}
