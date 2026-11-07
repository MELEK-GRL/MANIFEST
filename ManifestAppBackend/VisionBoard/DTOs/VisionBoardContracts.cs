using System.ComponentModel.DataAnnotations;

namespace ManifestApp.VisionBoard.DTOs;

public sealed record VisionBoardItemResponse(Guid Id, double X, double Y, double Scale);

public sealed record VisionBoardResponse(IReadOnlyList<VisionBoardItemResponse> Items);

public sealed record VisionBoardErrorResponse(string Code);

public sealed class AddVisionBoardItemRequest
{
    [Required]
    public IFormFile? Photo { get; set; }

    public double X { get; set; }

    public double Y { get; set; }

    public double Scale { get; set; } = 1;
}

public sealed record AddVisionBoardItemResponse(Guid Id);

public sealed record LayoutItemRequest(Guid Id, double X, double Y, double Scale);

public sealed record SaveVisionBoardLayoutRequest(IReadOnlyList<LayoutItemRequest> Items);
