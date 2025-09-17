export type Conversation = {
    id: number;
    otherUserId?: string;
    otherUserName?: string;
    otherUserCity?: string;
    productId?: number;
    productName?: string;
    productPictureUrl?: string;
    createdAt: string;
    lastMessageAt?: string;
    lastMessageContent?: string;
    hasUnreadMessages: boolean;
}

export type CreateConversation = {
    otherUserId: string;
    productId: number;
    initialMessage: string;
}
