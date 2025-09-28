using System.Text.Json.Serialization;

namespace API.DTOs;

public class SelectedCategoryDto
{
    [JsonPropertyName("categoryId")]
    public string CategoryId { get; set; } = string.Empty;
    
    [JsonPropertyName("subcategoryId")]
    public string? SubcategoryId { get; set; }
    
    [JsonPropertyName("tags")]
    public List<string>? Tags { get; set; }
}
