using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Models;
using PortfolioApi.Services;

namespace PortfolioApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IEmailService _emailService;
    private readonly ILogger<ContactController> _logger;

    public ContactController(AppDbContext db, IEmailService emailService, ILogger<ContactController> logger)
    {
        _db = db;
        _emailService = emailService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] ContactMessage contact)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        contact.CreatedAt = DateTime.UtcNow;
        _db.ContactMessages.Add(contact);
        await _db.SaveChangesAsync();

        _logger.LogInformation("New contact message from {Email}", contact.Email);

        try
        {
            await _emailService.SendContactNotificationAsync(
                contact.Name, contact.Email,
                contact.Subject ?? "No Subject",
                contact.Message
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Email notification failed but message was saved");
        }

        return Ok(new { message = "Message received! I'll get back to you within 24 hours." });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var messages = await _db.ContactMessages
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();
        return Ok(messages);
    }
}
