namespace API.DTOs;

public class SaveDto
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int ProductId { get; set; }
    public DateTime SavedDate { get; set; }
}

public class ProductWithCreatorDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string PictureUrl { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int QuantityInStock { get; set; }
    public string? PublicId { get; set; }
    public string? UserId { get; set; }
    public string? CreatorName { get; set; }
    public string? CreatorCity { get; set; }
    public string? CreatorMunicipality { get; set; }
    public string? CreatorNaselba { get; set; }
    public DateTime CreatedDate { get; set; }
    public bool IsSaved { get; set; }
    public int SaveCount { get; set; }
}
