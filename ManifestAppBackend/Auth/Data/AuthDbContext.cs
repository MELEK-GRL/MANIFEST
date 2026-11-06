using ManifestApp.Auth.Entities;
using Microsoft.EntityFrameworkCore;

namespace ManifestApp.Auth.Data;

public sealed class AuthDbContext : DbContext
{
    public AuthDbContext(DbContextOptions<AuthDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(user => user.Id);
            entity.Property(user => user.Username).HasMaxLength(32).IsRequired();
            entity.HasIndex(user => user.Username).IsUnique();
            entity.Property(user => user.Email).HasMaxLength(128).IsRequired();
            entity.HasIndex(user => user.Email).IsUnique();
            entity.Property(user => user.PasswordHash).IsRequired();
            entity.Property(user => user.PasswordSalt).IsRequired();
            entity.Property(user => user.Photo).HasColumnType("bytea");
            entity.Property(user => user.PhotoContentType).HasMaxLength(64);
        });
    }
}
