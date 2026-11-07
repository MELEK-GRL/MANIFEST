namespace ManifestApp.VisionBoard.Entities;

public sealed class VisionBoard : Entity
{
    private readonly List<VisionBoardItem> _items = [];

    private VisionBoard()
    {
    }

    public VisionBoard(Guid userId)
    {
        UserId = userId;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public Guid UserId { get; private set; }

    public DateTime UpdatedAtUtc { get; private set; }

    public IReadOnlyCollection<VisionBoardItem> Items => _items;

    public VisionBoardItem AddItem(byte[] photo, string contentType, double x, double y, double scale)
    {
        var item = new VisionBoardItem(Id, photo, contentType, x, y, scale);
        _items.Add(item);
        Touch();
        return item;
    }

    public bool TryUpdateItem(Guid itemId, double x, double y, double scale)
    {
        var item = _items.FirstOrDefault(entry => entry.Id == itemId);
        if (item is null)
        {
            return false;
        }

        item.Move(x, y, scale);
        Touch();
        return true;
    }

    public bool RemoveItem(Guid itemId)
    {
        var item = _items.FirstOrDefault(entry => entry.Id == itemId);
        if (item is null)
        {
            return false;
        }

        _items.Remove(item);
        Touch();
        return true;
    }

    public void ReplaceItems(IEnumerable<VisionBoardItem> items)
    {
        _items.Clear();
        _items.AddRange(items);
        Touch();
    }

    public void Touch()
    {
        UpdatedAtUtc = DateTime.UtcNow;
    }
}
