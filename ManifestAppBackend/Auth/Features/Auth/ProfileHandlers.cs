using ManifestApp.Auth.Features.Cqrs;
using ManifestApp.Auth.Repositories;

namespace ManifestApp.Auth.Features.Auth;

public sealed class UpdateUserPhotoHandler : ICommandHandler<UpdateUserPhotoCommand, PhotoUpdateResult>
{
    public const int MaxBytes = 8_000_000;

    private readonly IUserRepository _users;

    public UpdateUserPhotoHandler(IUserRepository users)
    {
        _users = users;
    }

    public async Task<PhotoUpdateResult> HandleAsync(
        UpdateUserPhotoCommand command,
        CancellationToken cancellationToken)
    {
        if (command.Photo.Length is 0 or > MaxBytes)
        {
            return PhotoUpdateResult.Fail(command.Photo.Length == 0 ? "photo_invalid" : "photo_too_large");
        }

        var contentType = PhotoKind(command.Photo);
        if (contentType is null)
        {
            return PhotoUpdateResult.Fail("photo_invalid");
        }

        var user = await _users.FindByIdAsync(command.UserId, cancellationToken);
        if (user is null)
        {
            return PhotoUpdateResult.Fail("unauthorized");
        }

        user.SetPhoto(command.Photo, contentType);
        await _users.SaveAsync(cancellationToken);
        return PhotoUpdateResult.Ok();
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
}

public sealed class GetUserPhotoHandler : IQueryHandler<GetUserPhotoQuery, UserPhoto?>
{
    private readonly IUserRepository _users;

    public GetUserPhotoHandler(IUserRepository users)
    {
        _users = users;
    }

    public async Task<UserPhoto?> HandleAsync(GetUserPhotoQuery query, CancellationToken cancellationToken)
    {
        var user = await _users.FindByIdAsync(query.UserId, cancellationToken);
        if (user?.Photo is not { Length: > 0 } || string.IsNullOrEmpty(user.PhotoContentType))
        {
            return null;
        }

        return new UserPhoto(user.Photo, user.PhotoContentType);
    }
}

public sealed class GetProfileHandler : IQueryHandler<GetProfileQuery, ProfileView?>
{
    private readonly IUserRepository _users;

    public GetProfileHandler(IUserRepository users)
    {
        _users = users;
    }

    public async Task<ProfileView?> HandleAsync(GetProfileQuery query, CancellationToken cancellationToken)
    {
        var user = await _users.FindByIdAsync(query.UserId, cancellationToken);
        return user is null ? null : new ProfileView(user.Username, user.Email, user.HasPhoto);
    }
}
