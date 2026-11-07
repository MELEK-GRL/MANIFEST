namespace ManifestApp.VisionBoard.Entities;

public sealed class VisionBoardItem : Entity
{
    private VisionBoardItem()
    {
        Photo = [];
        ContentType = string.Empty;
    }

    public VisionBoardItem(
        Guid boardId,
        byte[] photo,
        string contentType,
        double x,
        double y,
        double scale)
    {
        BoardId = boardId;
        Photo = photo;
        ContentType = contentType;
        X = x;
        Y = y;
        Scale = scale;
        CreatedAtUtc = DateTime.UtcNow;
    }

    public Guid BoardId { get; private set; }

    public byte[] Photo { get; private set; }

    public string ContentType { get; private set; }

    public double X { get; private set; }

    public double Y { get; private set; }

    public double Scale { get; private set; }

    public DateTime CreatedAtUtc { get; private set; }

    public void Move(double x, double y, double scale)
    {
        X = x;
        Y = y;
        Scale = scale;
    }
}
