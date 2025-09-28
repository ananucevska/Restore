using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CreateProductDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Description { get; set; } = string.Empty;


    [Required]
    public IFormFile File { get; set; } = null!;

    [Required]
    public required string Type { get; set; }
}