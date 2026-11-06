namespace ManifestApp.LuckyNumbers.Entities;

public abstract class Entity
{
    public Guid Id { get; protected set; } = Guid.NewGuid();
}
