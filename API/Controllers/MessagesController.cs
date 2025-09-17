using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class MessagesController(StoreContext context, UserManager<User> userManager) : BaseApiController
{
    [Authorize]
    [HttpGet("conversations")]
    public async Task<ActionResult<List<ConversationDto>>> GetConversations()
    {
        var currentUser = await userManager.GetUserAsync(User);
        if (currentUser == null) return Unauthorized();

        var conversations = await context.Conversations
            .Include(c => c.User1)
            .Include(c => c.User2)
            .Include(c => c.Product)
            .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
            .Where(c => c.User1Id == currentUser.Id || c.User2Id == currentUser.Id)
            .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
            .ToListAsync();

        var conversationDtos = conversations.Select(c =>
        {
            var otherUser = c.User1Id == currentUser.Id ? c.User2 : c.User1;
            var lastMessage = c.Messages.FirstOrDefault();
            var unreadCount = context.Messages
                .Count(m => m.ConversationId == c.Id && 
                           m.SenderId != currentUser.Id && 
                           !m.IsRead);

            return new ConversationDto
            {
                Id = c.Id,
                OtherUserId = otherUser?.Id,
                OtherUserName = otherUser?.Name,
                OtherUserCity = otherUser?.City,
                ProductId = c.ProductId,
                ProductName = c.Product?.Name,
                ProductPictureUrl = c.Product?.PictureUrl,
                CreatedAt = c.CreatedAt,
                LastMessageAt = c.LastMessageAt,
                LastMessageContent = lastMessage?.Content,
                HasUnreadMessages = unreadCount > 0
            };
        }).ToList();

        return conversationDtos;
    }

    [Authorize]
    [HttpGet("conversations/{id}/messages")]
    public async Task<ActionResult<List<MessageDto>>> GetMessages(int id)
    {
        var currentUser = await userManager.GetUserAsync(User);
        if (currentUser == null) return Unauthorized();

        var conversation = await context.Conversations
            .FirstOrDefaultAsync(c => c.Id == id && 
                                    (c.User1Id == currentUser.Id || c.User2Id == currentUser.Id));

        if (conversation == null) return NotFound();

        var messages = await context.Messages
            .Include(m => m.Sender)
            .Where(m => m.ConversationId == id)
            .OrderBy(m => m.SentAt)
            .ToListAsync();

        // Mark messages as read
        var unreadMessages = messages.Where(m => m.SenderId != currentUser.Id && !m.IsRead).ToList();
        foreach (var message in unreadMessages)
        {
            message.IsRead = true;
        }
        await context.SaveChangesAsync();

        var messageDtos = messages.Select(m => new MessageDto
        {
            Id = m.Id,
            ConversationId = m.ConversationId,
            SenderId = m.SenderId,
            SenderName = m.Sender?.Name,
            Content = m.Content,
            SentAt = m.SentAt,
            IsRead = m.IsRead
        }).ToList();

        return messageDtos;
    }

    [Authorize]
    [HttpPost("conversations")]
    public async Task<ActionResult<ConversationDto>> CreateConversation(CreateConversationDto dto)
    {
        var currentUser = await userManager.GetUserAsync(User);
        if (currentUser == null) return Unauthorized();

        // Check if conversation already exists
        var existingConversation = await context.Conversations
            .FirstOrDefaultAsync(c => 
                ((c.User1Id == currentUser.Id && c.User2Id == dto.OtherUserId) ||
                 (c.User1Id == dto.OtherUserId && c.User2Id == currentUser.Id)) &&
                c.ProductId == dto.ProductId);

        if (existingConversation != null)
        {
            // If conversation exists, just send the message
            var message = new Message
            {
                ConversationId = existingConversation.Id,
                SenderId = currentUser.Id,
                Content = dto.InitialMessage
            };

            context.Messages.Add(message);
            existingConversation.LastMessageAt = DateTime.UtcNow;
            await context.SaveChangesAsync();

            return await GetConversationDto(existingConversation.Id, currentUser.Id);
        }

        // Create new conversation
        var conversation = new Conversation
        {
            User1Id = currentUser.Id,
            User2Id = dto.OtherUserId,
            ProductId = dto.ProductId
        };

        context.Conversations.Add(conversation);
        await context.SaveChangesAsync();

        // Add initial message
        var initialMessage = new Message
        {
            ConversationId = conversation.Id,
            SenderId = currentUser.Id,
            Content = dto.InitialMessage
        };

        context.Messages.Add(initialMessage);
        conversation.LastMessageAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        return await GetConversationDto(conversation.Id, currentUser.Id);
    }

    [Authorize]
    [HttpPost("messages")]
    public async Task<ActionResult<MessageDto>> SendMessage(SendMessageDto dto)
    {
        var currentUser = await userManager.GetUserAsync(User);
        if (currentUser == null) return Unauthorized();

        var conversation = await context.Conversations
            .FirstOrDefaultAsync(c => c.Id == dto.ConversationId && 
                                    (c.User1Id == currentUser.Id || c.User2Id == currentUser.Id));

        if (conversation == null) return NotFound();

        var message = new Message
        {
            ConversationId = dto.ConversationId,
            SenderId = currentUser.Id,
            Content = dto.Content
        };

        context.Messages.Add(message);
        conversation.LastMessageAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        var messageDto = new MessageDto
        {
            Id = message.Id,
            ConversationId = message.ConversationId,
            SenderId = message.SenderId,
            SenderName = currentUser.Name,
            Content = message.Content,
            SentAt = message.SentAt,
            IsRead = message.IsRead
        };

        return messageDto;
    }

    private async Task<ConversationDto> GetConversationDto(int conversationId, string currentUserId)
    {
        var conversation = await context.Conversations
            .Include(c => c.User1)
            .Include(c => c.User2)
            .Include(c => c.Product)
            .Include(c => c.Messages.OrderByDescending(m => m.SentAt).Take(1))
            .FirstAsync(c => c.Id == conversationId);

        var otherUser = conversation.User1Id == currentUserId ? conversation.User2 : conversation.User1;
        var lastMessage = conversation.Messages.FirstOrDefault();

        return new ConversationDto
        {
            Id = conversation.Id,
            OtherUserId = otherUser?.Id,
            OtherUserName = otherUser?.Name,
            OtherUserCity = otherUser?.City,
            ProductId = conversation.ProductId,
            ProductName = conversation.Product?.Name,
            ProductPictureUrl = conversation.Product?.PictureUrl,
            CreatedAt = conversation.CreatedAt,
            LastMessageAt = conversation.LastMessageAt,
            LastMessageContent = lastMessage?.Content,
            HasUnreadMessages = false
        };
    }
}
