namespace API.DTOs;

public class ProductImageDto
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public string? PublicId { get; set; }
    public int Order { get; set; }
}
