using ManifestApp.VisionBoard.Entities;

namespace ManifestApp.VisionBoard.Repositories;

public interface IVisionBoardRepository
{
    Task<Entities.VisionBoard?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken);

    Task<VisionBoardItem?> GetItemAsync(Guid userId, Guid itemId, CancellationToken cancellationToken);

    Task AddAsync(Entities.VisionBoard board, CancellationToken cancellationToken);

    Task SaveAsync(CancellationToken cancellationToken);
}
