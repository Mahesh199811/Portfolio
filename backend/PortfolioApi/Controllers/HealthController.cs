using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;

namespace PortfolioApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _db;

    public HealthController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            await _db.Database.ExecuteSqlRawAsync("SELECT 1");
            return Ok(new
            {
                status = "healthy",
                database = "connected",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            return StatusCode(503, new { status = "unhealthy", error = ex.Message });
        }
    }
}
