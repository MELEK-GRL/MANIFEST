using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using ManifestApp.VisionBoard.DTOs;
using ManifestApp.VisionBoard.Features.Cqrs;
using ManifestApp.VisionBoard.Features.Vision;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ManifestApp.VisionBoard.Controllers;

[ApiController]
[Authorize]
[Route("api/vision-board")]
public sealed class VisionBoardController : ControllerBase
{
    private readonly IDispatcher _dispatcher;

    public VisionBoardController(IDispatcher dispatcher)
    {
        _dispatcher = dispatcher;
    }

    [HttpGet]
    [ProducesResponseType(typeof(VisionBoardResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(VisionBoardErrorResponse), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<VisionBoardResponse>> GetBoard(CancellationToken cancellationToken)
    {
        var userId = CurrentUserId();
        if (userId is null)
        {
            return Unauthorized(new VisionBoardErrorResponse("unauthorized"));
        }

        var board = await _dispatcher.QueryAsync<GetVisionBoardQuery, VisionBoardView>(
            new GetVisionBoardQuery(userId.Value),
            cancellationToken);
        var items = board.Items
            .Select(item => new VisionBoardItemResponse(item.Id, item.X, item.Y, item.Scale))
            .ToList();
        return Ok(new VisionBoardResponse(items));
    }

    [HttpGet("items/{itemId:guid}/image")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetItemImage(Guid itemId, CancellationToken cancellationToken)
    {
        var userId = CurrentUserId();
        if (userId is null)
        {
            return Unauthorized(new VisionBoardErrorResponse("unauthorized"));
        }

        var image = await _dispatcher.QueryAsync<GetVisionBoardItemImageQuery, VisionBoardItemImage?>(
            new GetVisionBoardItemImageQuery(userId.Value, itemId),
            cancellationToken);
        if (image is null)
        {
            return NotFound();
        }

        return File(image.Bytes, image.ContentType);
    }

    [HttpPost("items")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(AddVisionBoardItemHandler.MaxBytes)]
    [ProducesResponseType(typeof(AddVisionBoardItemResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(VisionBoardErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AddVisionBoardItemResponse>> AddItem(
        [FromForm] AddVisionBoardItemRequest request,
        CancellationToken cancellationToken)
    {
        var userId = CurrentUserId();
        if (userId is null)
        {
            return Unauthorized(new VisionBoardErrorResponse("unauthorized"));
        }

        if (request.Photo is null || request.Photo.Length == 0)
        {
            return BadRequest(new VisionBoardErrorResponse("photo_invalid"));
        }

        if (request.Photo.Length > AddVisionBoardItemHandler.MaxBytes)
        {
            return BadRequest(new VisionBoardErrorResponse("photo_too_large"));
        }

        await using var stream = request.Photo.OpenReadStream();
        using var memory = new MemoryStream();
        await stream.CopyToAsync(memory, cancellationToken);

        var result = await _dispatcher.SendAsync<AddVisionBoardItemCommand, AddVisionBoardItemResult>(
            new AddVisionBoardItemCommand(
                userId.Value,
                memory.ToArray(),
                request.Photo.ContentType,
                request.X,
                request.Y,
                request.Scale <= 0 ? 1 : request.Scale),
            cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(new VisionBoardErrorResponse(result.Code!));
        }

        return Ok(new AddVisionBoardItemResponse(result.ItemId!.Value));
    }

    [HttpPut("layout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(VisionBoardErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SaveLayout(
        [FromBody] SaveVisionBoardLayoutRequest request,
        CancellationToken cancellationToken)
    {
        var userId = CurrentUserId();
        if (userId is null)
        {
            return Unauthorized(new VisionBoardErrorResponse("unauthorized"));
        }

        var items = (request.Items ?? [])
            .Select(item => new LayoutItemInput(item.Id, item.X, item.Y, item.Scale))
            .ToList();
        var result = await _dispatcher.SendAsync<SaveVisionBoardLayoutCommand, SaveVisionBoardLayoutResult>(
            new SaveVisionBoardLayoutCommand(userId.Value, items),
            cancellationToken);
        if (!result.Succeeded)
        {
            return BadRequest(new VisionBoardErrorResponse(result.Code!));
        }

        return NoContent();
    }

    [HttpDelete("items/{itemId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(VisionBoardErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteItem(Guid itemId, CancellationToken cancellationToken)
    {
        var userId = CurrentUserId();
        if (userId is null)
        {
            return Unauthorized(new VisionBoardErrorResponse("unauthorized"));
        }

        var result = await _dispatcher.SendAsync<DeleteVisionBoardItemCommand, DeleteVisionBoardItemResult>(
            new DeleteVisionBoardItemCommand(userId.Value, itemId),
            cancellationToken);
        if (!result.Succeeded)
        {
            return NotFound(new VisionBoardErrorResponse(result.Code!));
        }

        return NoContent();
    }

    private Guid? CurrentUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return Guid.TryParse(value, out var userId) ? userId : null;
    }
}
