export type Message = {
    id: number;
    conversationId: number;
    senderId?: string;
    senderName?: string;
    content: string;
    sentAt: string;
    isRead: boolean;
}

export type SendMessage = {
    conversationId: number;
    content: string;
}
