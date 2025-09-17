using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateProfileDto
{
    [Required]
    public required string Name { get; set; } = string.Empty;
    [Required]
    public required string City { get; set; } = string.Empty;
    public string? Municipality { get; set; }
    public string? Naselba { get; set; }
}
