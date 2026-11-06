using ManifestApp.Auth.Data;
using ManifestApp.Auth.Entities;
using Microsoft.EntityFrameworkCore;

namespace ManifestApp.Auth.Repositories;

public sealed class UserRepository : IUserRepository
{
    private readonly AuthDbContext _db;

    public UserRepository(AuthDbContext db)
    {
        _db = db;
    }

    public Task<User?> FindByUsernameAsync(string username, CancellationToken cancellationToken)
    {
        return _db.Users.FirstOrDefaultAsync(
            user => user.Username == username,
            cancellationToken);
    }

    public Task<User?> FindByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return _db.Users.FirstOrDefaultAsync(user => user.Id == id, cancellationToken);
    }

    public Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken)
    {
        return _db.Users.AnyAsync(user => user.Email == email, cancellationToken);
    }

    public async Task AddAsync(User user, CancellationToken cancellationToken)
    {
        _db.Users.Add(user);
        await _db.SaveChangesAsync(cancellationToken);
    }

    public Task SaveAsync(CancellationToken cancellationToken)
    {
        return _db.SaveChangesAsync(cancellationToken);
    }
}
