namespace API.Entities;
 
public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string PictureUrl { get; set; } // Keep for backward compatibility
    public required string Type { get; set; }
    public string? PublicId { get; set; }
    public string? UserId { get; set; }
    public User? User { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public bool CargoDelivery { get; set; } = false;
    public string? Condition { get; set; }
    public string? Delivery { get; set; } // JSON array of delivery options
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
}