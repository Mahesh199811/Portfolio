using System.ComponentModel.DataAnnotations;

namespace PortfolioApi.Models;

public class Project
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(500)]
    public string TechStack { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? GitHubUrl { get; set; }

    [MaxLength(500)]
    public string? LiveUrl { get; set; }

    [MaxLength(50)]
    public string Icon { get; set; } = "fa-code";

    [MaxLength(20)]
    public string Color { get; set; } = "green";

    public int Order { get; set; } = 0;
}
