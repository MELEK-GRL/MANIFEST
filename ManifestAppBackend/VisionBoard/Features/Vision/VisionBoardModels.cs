using ManifestApp.VisionBoard.Features.Cqrs;

namespace ManifestApp.VisionBoard.Features.Vision;

public sealed record VisionBoardItemView(Guid Id, double X, double Y, double Scale);

public sealed record VisionBoardView(IReadOnlyList<VisionBoardItemView> Items);

public sealed record GetVisionBoardQuery(Guid UserId) : IQuery<VisionBoardView>;

public sealed record GetVisionBoardItemImageQuery(Guid UserId, Guid ItemId)
    : IQuery<VisionBoardItemImage?>;

public sealed record VisionBoardItemImage(byte[] Bytes, string ContentType);

public sealed record AddVisionBoardItemCommand(
    Guid UserId,
    byte[] Photo,
    string ContentType,
    double X,
    double Y,
    double Scale) : ICommand<AddVisionBoardItemResult>;

public sealed record AddVisionBoardItemResult(bool Succeeded, Guid? ItemId, string? Code)
{
    public static AddVisionBoardItemResult Ok(Guid itemId) => new(true, itemId, null);

    public static AddVisionBoardItemResult Fail(string code) => new(false, null, code);
}

public sealed record LayoutItemInput(Guid Id, double X, double Y, double Scale);

public sealed record SaveVisionBoardLayoutCommand(
    Guid UserId,
    IReadOnlyList<LayoutItemInput> Items) : ICommand<SaveVisionBoardLayoutResult>;

public sealed record SaveVisionBoardLayoutResult(bool Succeeded, string? Code)
{
    public static SaveVisionBoardLayoutResult Ok() => new(true, null);

    public static SaveVisionBoardLayoutResult Fail(string code) => new(false, code);
}

public sealed record DeleteVisionBoardItemCommand(Guid UserId, Guid ItemId)
    : ICommand<DeleteVisionBoardItemResult>;

public sealed record DeleteVisionBoardItemResult(bool Succeeded, string? Code)
{
    public static DeleteVisionBoardItemResult Ok() => new(true, null);

    public static DeleteVisionBoardItemResult Fail(string code) => new(false, code);
}
