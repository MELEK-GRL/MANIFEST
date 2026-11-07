using ManifestApp.VisionBoard.Data;
using ManifestApp.VisionBoard.Entities;
using Microsoft.EntityFrameworkCore;

namespace ManifestApp.VisionBoard.Repositories;

public sealed class VisionBoardRepository : IVisionBoardRepository
{
    private readonly VisionBoardDbContext _db;

    public VisionBoardRepository(VisionBoardDbContext db)
    {
        _db = db;
    }

    public Task<Entities.VisionBoard?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken)
    {
        return _db.Boards
            .Include(board => board.Items)
            .FirstOrDefaultAsync(board => board.UserId == userId, cancellationToken);
    }

    public Task<VisionBoardItem?> GetItemAsync(Guid userId, Guid itemId, CancellationToken cancellationToken)
    {
        return _db.Items
            .Where(item => item.Id == itemId)
            .Join(
                _db.Boards.Where(board => board.UserId == userId),
                item => item.BoardId,
                board => board.Id,
                (item, _) => item)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task AddAsync(Entities.VisionBoard board, CancellationToken cancellationToken)
    {
        await _db.Boards.AddAsync(board, cancellationToken);
    }

    public Task SaveAsync(CancellationToken cancellationToken)
    {
        return _db.SaveChangesAsync(cancellationToken);
    }
}
