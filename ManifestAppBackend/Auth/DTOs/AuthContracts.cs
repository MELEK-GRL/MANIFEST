namespace ManifestApp.Auth.DTOs;

public sealed record RegisterRequest(string? Username, string? Email, string? Password);

public sealed record LoginRequest(string? Username, string? Password);

public sealed record AuthResponse(string Token, string Username);

public sealed record AuthErrorResponse(string Code);
