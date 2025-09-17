using System.ComponentModel.DataAnnotations;

namespace API.Entities;

public class Conversation
{
    public int Id { get; set; }
    public string? User1Id { get; set; }
    public string? User2Id { get; set; }
    public int? ProductId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastMessageAt { get; set; }
    
    // Navigation properties
    public User? User1 { get; set; }
    public User? User2 { get; set; }
    public Product? Product { get; set; }
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}
