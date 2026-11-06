using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ManifestApp.Auth.DTOs;
using ManifestApp.Auth.Features.Auth;
using ManifestApp.Auth.Features.Cqrs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ManifestApp.Auth.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly IDispatcher _dispatcher;

    public AuthController(IDispatcher dispatcher)
    {
        _dispatcher = dispatcher;
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(AuthErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(AuthErrorResponse), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponse>> Register(
        RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _dispatcher.SendAsync<RegisterUserCommand, AuthResult>(
            new RegisterUserCommand(request.Username, request.Email, request.Password),
            cancellationToken);

        return ToResponse(result);
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(AuthErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponse>> Login(
        LoginRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _dispatcher.SendAsync<LoginUserCommand, AuthResult>(
            new LoginUserCommand(request.Username, request.Password),
            cancellationToken);

        return ToResponse(result);
    }

    [Authorize]
    [HttpGet("profile")]
    [ProducesResponseType(typeof(ProfileResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(AuthErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<ProfileResponse>> Profile(CancellationToken cancellationToken)
    {
        var userId = CurrentUserId();
        if (userId is null)
        {
            return Unauthorized(new AuthErrorResponse("unauthorized"));
        }

        var profile = await _dispatcher.QueryAsync<GetProfileQuery, ProfileView?>(
            new GetProfileQuery(userId.Value),
            cancellationToken);
        if (profile is null)
        {
            return Unauthorized(new AuthErrorResponse("unauthorized"));
        }

        return Ok(new ProfileResponse(profile.Username, profile.Email, profile.HasPhoto));
    }

    [Authorize]
    [HttpGet("photo")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Photo(CancellationToken cancellationToken)
    {
        var userId = CurrentUserId();
        if (userId is null)
        {
            return Unauthorized(new AuthErrorResponse("unauthorized"));
        }

        var photo = await _dispatcher.QueryAsync<GetUserPhotoQuery, UserPhoto?>(
            new GetUserPhotoQuery(userId.Value),
            cancellationToken);
        if (photo is null)
        {
            return NotFound();
        }

        return File(photo.Bytes, photo.ContentType);
    }

    [Authorize]
    [HttpPut("photo")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(UpdateUserPhotoHandler.MaxBytes)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(AuthErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(AuthErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdatePhoto(
        [FromForm] UpdatePhotoRequest request,
        CancellationToken cancellationToken)
    {
        var userId = CurrentUserId();
        if (userId is null)
        {
            return Unauthorized(new AuthErrorResponse("unauthorized"));
        }

        if (request.Photo is null || request.Photo.Length == 0)
        {
            return BadRequest(new AuthErrorResponse("photo_invalid"));
        }

        if (request.Photo.Length > UpdateUserPhotoHandler.MaxBytes)
        {
            return BadRequest(new AuthErrorResponse("photo_too_large"));
        }

        await using var stream = request.Photo.OpenReadStream();
        using var memory = new MemoryStream();
        await stream.CopyToAsync(memory, cancellationToken);

        var result = await _dispatcher.SendAsync<UpdateUserPhotoCommand, PhotoUpdateResult>(
            new UpdateUserPhotoCommand(userId.Value, memory.ToArray(), request.Photo.ContentType),
            cancellationToken);
        if (!result.Succeeded)
        {
            return result.Code == "unauthorized"
                ? Unauthorized(new AuthErrorResponse(result.Code))
                : BadRequest(new AuthErrorResponse(result.Code!));
        }

        return NoContent();
    }

    private Guid? CurrentUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return Guid.TryParse(value, out var userId) ? userId : null;
    }

    private ActionResult<AuthResponse> ToResponse(AuthResult result)
    {
        if (result.Succeeded)
        {
            return Ok(new AuthResponse(result.Token!, result.Username!));
        }

        var error = new AuthErrorResponse(result.Code!);
        return result.Code switch
        {
            "username_taken" or "email_taken" => Conflict(error),
            "bad_credentials" => Unauthorized(error),
            _ => BadRequest(error),
        };
    }
}
