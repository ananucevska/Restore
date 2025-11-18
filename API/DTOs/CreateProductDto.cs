using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CreateProductDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Description { get; set; } = string.Empty;

    public IFormFile? File { get; set; }
    public IFormFile? File2 { get; set; }
    public IFormFile? File3 { get; set; }
    public IFormFile? File4 { get; set; }
    public IFormFile? File5 { get; set; }
    public IFormFile? File6 { get; set; }
    public IFormFile? File7 { get; set; }
    public IFormFile? File8 { get; set; }
    public IFormFile? File9 { get; set; }
    public IFormFile? File10 { get; set; }

    [Required]
    public required string Type { get; set; }
    
    [Required]
    public bool CargoDelivery { get; set; } = false;
    
    [Required]
    public string Condition { get; set; } = string.Empty;
    
    [Required]
    public string Delivery { get; set; } = string.Empty; // JSON array of delivery options
}