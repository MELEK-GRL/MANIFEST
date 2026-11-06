namespace ManifestApp.Auth.Entities;

public abstract class Entity
{
    public Guid Id { get; protected set; } = Guid.NewGuid();
}
