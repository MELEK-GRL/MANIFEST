using ManifestApp.Auth.Entities;
using ManifestApp.Auth.Features.Cqrs;
using ManifestApp.Auth.Repositories;

namespace ManifestApp.Auth.Features.Auth;

public sealed class RegisterUserHandler : ICommandHandler<RegisterUserCommand, AuthResult>
{
    private readonly IUserRepository _users;
    private readonly IPasswordHasher _passwords;
    private readonly ITokenIssuer _tokens;

    public RegisterUserHandler(IUserRepository users, IPasswordHasher passwords, ITokenIssuer tokens)
    {
        _users = users;
        _passwords = passwords;
        _tokens = tokens;
    }

    public async Task<AuthResult> HandleAsync(RegisterUserCommand command, CancellationToken cancellationToken)
    {
        var username = AuthRules.NormalizeUsername(command.Username);
        var email = AuthRules.NormalizeEmail(command.Email);

        var usernameError = AuthRules.CheckUsername(username);
        if (usernameError is not null)
        {
            return AuthResult.Fail(usernameError);
        }

        var emailError = AuthRules.CheckEmail(email);
        if (emailError is not null)
        {
            return AuthResult.Fail(emailError);
        }

        var passwordError = AuthRules.CheckPassword(command.Password);
        if (passwordError is not null)
        {
            return AuthResult.Fail(passwordError);
        }

        if (await _users.FindByUsernameAsync(username, cancellationToken) is not null)
        {
            return AuthResult.Fail("username_taken");
        }

        if (await _users.EmailExistsAsync(email, cancellationToken))
        {
            return AuthResult.Fail("email_taken");
        }

        var (hash, salt) = _passwords.Hash(command.Password!);
        var user = new User(username, email, hash, salt);
        await _users.AddAsync(user, cancellationToken);

        return AuthResult.Ok(_tokens.Create(user), user.Username);
    }
}
