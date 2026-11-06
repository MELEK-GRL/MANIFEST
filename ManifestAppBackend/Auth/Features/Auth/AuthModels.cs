using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using ManifestApp.Auth.Entities;
using ManifestApp.Auth.Features.Cqrs;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace ManifestApp.Auth.Features.Auth;

public sealed record AuthResult(bool Succeeded, string? Code, string? Token, string? Username)
{
    public static AuthResult Ok(string token, string username) => new(true, null, token, username);

    public static AuthResult Fail(string code) => new(false, code, null, null);
}

public sealed record RegisterUserCommand(string? Username, string? Email, string? Password)
    : ICommand<AuthResult>;

public sealed record LoginUserCommand(string? Username, string? Password)
    : ICommand<AuthResult>;

public sealed record PhotoUpdateResult(bool Succeeded, string? Code)
{
    public static PhotoUpdateResult Ok() => new(true, null);

    public static PhotoUpdateResult Fail(string code) => new(false, code);
}

public sealed record UserPhoto(byte[] Bytes, string ContentType);

public sealed record ProfileView(string Username, string Email, bool HasPhoto);

public sealed record UpdateUserPhotoCommand(Guid UserId, byte[] Photo, string ContentType)
    : ICommand<PhotoUpdateResult>;

public sealed record GetUserPhotoQuery(Guid UserId) : IQuery<UserPhoto?>;

public sealed record GetProfileQuery(Guid UserId) : IQuery<ProfileView?>;

public interface IPasswordHasher
{
    (string Hash, string Salt) Hash(string password);

    bool Verify(string password, string hash, string salt);
}

public sealed class PasswordHasher : IPasswordHasher
{
    private const int Iterations = 100_000;

    public (string Hash, string Salt) Hash(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            Iterations,
            HashAlgorithmName.SHA256,
            32);
        return (Convert.ToBase64String(hash), Convert.ToBase64String(salt));
    }

    public bool Verify(string password, string hash, string salt)
    {
        var actual = Rfc2898DeriveBytes.Pbkdf2(
            password,
            Convert.FromBase64String(salt),
            Iterations,
            HashAlgorithmName.SHA256,
            32);
        return CryptographicOperations.FixedTimeEquals(actual, Convert.FromBase64String(hash));
    }
}

public interface ITokenIssuer
{
    string Create(User user);
}

public sealed class TokenIssuer : ITokenIssuer
{
    private readonly string _issuer;
    private readonly SymmetricSecurityKey _key;

    public TokenIssuer(IConfiguration configuration)
    {
        var signingKey = configuration["Auth:SigningKey"]
            ?? throw new InvalidOperationException("Auth:SigningKey is missing.");
        _issuer = configuration["Auth:Issuer"] ?? "ManifestApp";
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));
    }

    public string Create(User user)
    {
        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _issuer,
            claims:
            [
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
            ],
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: new SigningCredentials(_key, SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

internal static class AuthRules
{
    public static string NormalizeUsername(string? value) => value?.Trim().ToLowerInvariant() ?? string.Empty;

    public static string NormalizeEmail(string? value) => value?.Trim().ToLowerInvariant() ?? string.Empty;

    public static string? CheckUsername(string username)
    {
        if (username.Length is < 3 or > 32)
        {
            return "invalid_username";
        }

        foreach (var character in username)
        {
            if (!char.IsLetterOrDigit(character) && character != '_')
            {
                return "invalid_username";
            }
        }

        return null;
    }

    public static string? CheckEmail(string email)
    {
        if (email.Length is 0 or > 128 || !MailAddress.TryCreate(email, out var address) || address.Address != email)
        {
            return "invalid_email";
        }

        return null;
    }

    public static string? CheckPassword(string? password)
    {
        if (string.IsNullOrEmpty(password) || password.Length is < 6 or > 8)
        {
            return "invalid_password";
        }

        return null;
    }
}
