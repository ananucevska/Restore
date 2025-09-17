using System.ComponentModel.DataAnnotations;

namespace API.Entities;

public class Message
{
    public int Id { get; set; }
    public int ConversationId { get; set; }
    public string? SenderId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; } = false;
    
    // Navigation properties
    public Conversation? Conversation { get; set; }
    public User? Sender { get; set; }
}
