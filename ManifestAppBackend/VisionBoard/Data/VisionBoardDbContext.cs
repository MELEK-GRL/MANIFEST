using ManifestApp.VisionBoard.Entities;
using Microsoft.EntityFrameworkCore;

namespace ManifestApp.VisionBoard.Data;

public sealed class VisionBoardDbContext : DbContext
{
    public VisionBoardDbContext(DbContextOptions<VisionBoardDbContext> options)
        : base(options)
    {
    }

    public DbSet<Entities.VisionBoard> Boards => Set<Entities.VisionBoard>();

    public DbSet<VisionBoardItem> Items => Set<VisionBoardItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Entities.VisionBoard>(entity =>
        {
            entity.ToTable("VisionBoards");
            entity.HasKey(board => board.Id);
            entity.HasIndex(board => board.UserId).IsUnique();
            entity.Property(board => board.UserId).IsRequired();
            entity.HasMany(board => board.Items)
                .WithOne()
                .HasForeignKey(item => item.BoardId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.Navigation(board => board.Items)
                .HasField("_items")
                .UsePropertyAccessMode(PropertyAccessMode.Field);
        });

        modelBuilder.Entity<VisionBoardItem>(entity =>
        {
            entity.ToTable("VisionBoardItems");
            entity.HasKey(item => item.Id);
            entity.Property(item => item.Photo).HasColumnType("bytea").IsRequired();
            entity.Property(item => item.ContentType).HasMaxLength(64).IsRequired();
            entity.Property(item => item.X).IsRequired();
            entity.Property(item => item.Y).IsRequired();
            entity.Property(item => item.Scale).IsRequired();
        });
    }
}
