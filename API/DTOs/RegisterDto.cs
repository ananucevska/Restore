using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    public required string Username { get; set; } = string.Empty;
    [Required]
    public required string Email { get; set; } = string.Empty;
    [Required]
    public required string Password { get; set; }
    [Required]
    public required string ConfirmPassword { get; set; }
    [Required]
    public required string City { get; set; } = string.Empty;
    public string? Municipality { get; set; }
    public string? Neighborhood { get; set; }
}