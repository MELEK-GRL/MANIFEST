namespace ManifestApp.Auth.Entities;

public sealed class User : Entity
{
    private User()
    {
        Username = string.Empty;
        Email = string.Empty;
        PasswordHash = string.Empty;
        PasswordSalt = string.Empty;
    }

    public User(string username, string email, string passwordHash, string passwordSalt)
    {
        Username = username;
        Email = email;
        PasswordHash = passwordHash;
        PasswordSalt = passwordSalt;
    }

    public string Username { get; private set; }

    public string Email { get; private set; }

    public string PasswordHash { get; private set; }

    public string PasswordSalt { get; private set; }
}
