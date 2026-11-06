using ManifestApp.Auth.Features.Cqrs;
using ManifestApp.Auth.Repositories;

namespace ManifestApp.Auth.Features.Auth;

public sealed class LoginUserHandler : ICommandHandler<LoginUserCommand, AuthResult>
{
    private readonly IUserRepository _users;
    private readonly IPasswordHasher _passwords;
    private readonly ITokenIssuer _tokens;

    public LoginUserHandler(IUserRepository users, IPasswordHasher passwords, ITokenIssuer tokens)
    {
        _users = users;
        _passwords = passwords;
        _tokens = tokens;
    }

    public async Task<AuthResult> HandleAsync(LoginUserCommand command, CancellationToken cancellationToken)
    {
        var username = AuthRules.NormalizeUsername(command.Username);
        var passwordError = AuthRules.CheckPassword(command.Password);
        if (AuthRules.CheckUsername(username) is not null || passwordError is not null)
        {
            return AuthResult.Fail("bad_credentials");
        }

        var user = await _users.FindByUsernameAsync(username, cancellationToken);
        if (user is null || !_passwords.Verify(command.Password!, user.PasswordHash, user.PasswordSalt))
        {
            return AuthResult.Fail("bad_credentials");
        }

        return AuthResult.Ok(_tokens.Create(user), user.Username);
    }
}
