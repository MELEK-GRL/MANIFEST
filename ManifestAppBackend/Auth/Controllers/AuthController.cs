using ManifestApp.Auth.DTOs;
using ManifestApp.Auth.Features.Auth;
using ManifestApp.Auth.Features.Cqrs;
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
