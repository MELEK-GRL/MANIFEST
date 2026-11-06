using Microsoft.AspNetCore.Http;

namespace ManifestApp.Auth.DTOs;

public sealed record RegisterRequest(string? Username, string? Email, string? Password);

public sealed record LoginRequest(string? Username, string? Password);

public sealed record AuthResponse(string Token, string Username);

public sealed record AuthErrorResponse(string Code);

public sealed record ProfileResponse(string Username, string Email, bool HasPhoto);

public sealed class UpdatePhotoRequest
{
    public IFormFile? Photo { get; set; }
}
