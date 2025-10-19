namespace API.Entities;

public class ProductImage
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public string? PublicId { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public int Order { get; set; } // For ordering images
}
