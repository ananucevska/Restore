using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateProductDto
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;


    public IFormFile? File { get; set; }

    [Required]
    public required string Type { get; set; }
}