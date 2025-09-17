namespace API.DTOs;

public class ConversationDto
{
    public int Id { get; set; }
    public string? OtherUserId { get; set; }
    public string? OtherUserName { get; set; }
    public string? OtherUserCity { get; set; }
    public int? ProductId { get; set; }
    public string? ProductName { get; set; }
    public string? ProductPictureUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public string? LastMessageContent { get; set; }
    public bool HasUnreadMessages { get; set; }
}

public class CreateConversationDto
{
    public string OtherUserId { get; set; } = string.Empty;
    public int ProductId { get; set; }
    public string InitialMessage { get; set; } = string.Empty;
}
