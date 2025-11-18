namespace API.Entities;

public class Save
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    
    public DateTime SavedDate { get; set; } = DateTime.UtcNow;
}

