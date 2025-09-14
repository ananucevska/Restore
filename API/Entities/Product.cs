namespace API.Entities;
 
public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string PictureUrl { get; set; }
    public required string Type { get; set; }
    public required string Brand { get; set; }
    public int QuantityInStock { get; set; }
    public string? PublicId { get; set; }
    public string? UserId { get; set; }
    public User? User { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}