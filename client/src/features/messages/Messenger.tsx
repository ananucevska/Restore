import { useState, useEffect, useRef } from 'react';
import { 
    Box, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemAvatar, 
    Avatar, 
    Typography, 
    TextField, 
    IconButton, 
    Paper,
    Badge,
} from '@mui/material';
import { Send, Message as MessageIcon, Refresh } from '@mui/icons-material';
import { useFetchConversationsQuery, useFetchMessagesQuery, useSendMessageMutation } from './messagesApi';
import ProductCard from './ProductCard';
import { Product } from '../../app/models/product';
import { useUserInfoQuery } from '../account/accountApi';

export default function Messenger() {
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data: user } = useUserInfoQuery();
    const { data: conversations = [], isLoading: conversationsLoading, refetch: refetchConversations } = useFetchConversationsQuery(undefined, {
        refetchOnMountOrArgChange: true, // Always refetch when component mounts or args change
        refetchOnFocus: true, // Refetch when window regains focus
        refetchOnReconnect: true // Refetch when network reconnects
    });
    
    const { data: messages = [], isLoading: messagesLoading } = useFetchMessagesQuery(selectedConversation!, {
        skip: !selectedConversation
    });
    const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'end',
                inline: 'nearest'
            });
        }
    };

    useEffect(() => {
        // Use a small timeout to ensure the layout is stable before scrolling
        const timeoutId = setTimeout(() => {
            scrollToBottom();
        }, 100);
        
        return () => clearTimeout(timeoutId);
    }, [messages]);

    // Invalidate conversations when messages are fetched (which marks them as read)
    useEffect(() => {
        if (messages.length > 0 && selectedConversation) {
            // Messages were fetched, which means they were marked as read on the backend
            // Only refetch conversations if there were unread messages
            const conversation = conversations.find(c => c.id === selectedConversation);
            if (conversation?.hasUnreadMessages) {
                refetchConversations();
            }
        }
    }, [messages, selectedConversation, conversations, refetchConversations]);


    // Listen for custom events to trigger immediate refetch
    useEffect(() => {
        const handleMessageSent = () => {
            refetchConversations();
        };

        // Listen for localStorage changes (cross-tab communication)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'messageSent' && e.newValue) {
                refetchConversations();
            }
        };

        window.addEventListener('messageSent', handleMessageSent);
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('messageSent', handleMessageSent);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [refetchConversations]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            await sendMessage({
                conversationId: selectedConversation,
                content: newMessage.trim()
            }).unwrap();
            setNewMessage('');
            
            // Only refetch conversations after sending a message
            refetchConversations();
            
            // Dispatch custom event to trigger refetch in other components
            window.dispatchEvent(new CustomEvent('messageSent'));
            
            // Use localStorage to communicate across browser tabs
            localStorage.setItem('messageSent', Date.now().toString());
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return date.toLocaleDateString('en-US', { weekday: 'long' });
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const selectedConversationData = conversations.find(c => c.id === selectedConversation);

    if (conversationsLoading) {
        return <Typography>Loading conversations...</Typography>;
    }

    return (
        <Box sx={{ 
            width: '100%', 
            height: '600px',
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: 2,
            mb: 4
        }}>
            {/* Conversations List */}
            <Paper sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Messages</Typography>
                    <IconButton 
                        size="small" 
                        onClick={() => refetchConversations()}
                        title="Refresh conversations"
                    >
                        <Refresh />
                    </IconButton>
                </Box>
                <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
                    {conversations.length === 0 ? (
                        <ListItem>
                            <ListItemText 
                                primary="No conversations yet"
                                secondary="Start a conversation by messaging a product owner"
                            />
                        </ListItem>
                    ) : (
                        conversations.map((conversation) => (
                            <ListItem
                                key={conversation.id}
                                component="div"
                                onClick={() => setSelectedConversation(conversation.id)}
                                sx={{ 
                                    borderBottom: 1, 
                                    borderColor: 'divider',
                                    backgroundColor: conversation.id === selectedConversation 
                                        ? 'primary.light' 
                                        : conversation.hasUnreadMessages 
                                            ? '#f5f5f5' 
                                            : 'transparent',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: conversation.id === selectedConversation 
                                            ? 'primary.light' 
                                            : 'action.hover'
                                    }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        {conversation.otherUserName?.charAt(0) || 'U'}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle2" noWrap>
                                                {conversation.otherUserName || 'Unknown User'}
                                            </Typography>
                                            {conversation.lastMessageAt && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatDate(conversation.lastMessageAt)}
                                                </Typography>
                                            )}
                                        </Box>
                                    }
                                    secondary={
                                        <Box>
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {conversation.lastMessageContent || 'No messages yet'}
                                            </Typography>
                                            {conversation.productName && (
                                                <Typography variant="caption" color="primary" noWrap>
                                                    About: {conversation.productName}
                                                </Typography>
                                            )}
                                        </Box>
                                    }
                                />
                                {conversation.hasUnreadMessages && (
                                    <Badge color="primary" variant="dot" />
                                )}
                            </ListItem>
                        ))
                    )}
                </List>
            </Paper>

            {/* Chat Area */}
            <Paper sx={{ 
                height: '100%', 
                display: 'grid',
                gridTemplateRows: 'auto auto 1fr auto',
                overflow: 'hidden'
            }}>
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                            <Typography variant="h6">
                                {selectedConversationData?.otherUserName || 'Unknown User'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {selectedConversationData?.otherUserCity && 
                                    `from ${selectedConversationData.otherUserCity}`
                                }
                            </Typography>
                        </Box>

                        {/* Product Card */}
                        {selectedConversationData?.productId && (
                            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Product being discussed:
                                </Typography>
                                <ProductCard 
                                    product={{
                                        id: selectedConversationData.productId,
                                        name: selectedConversationData.productName || '',
                                        pictureUrl: selectedConversationData.productPictureUrl || '',
                                        creatorName: selectedConversationData.otherUserName || '',
                                        type: '',
                                        description: '',
                                        quantityInStock: 0,
                                        userId: selectedConversationData.otherUserId || '',
                                        creatorCity: selectedConversationData.otherUserCity || '',
                                        creatorMunicipality: '',
                                        creatorNeighborhood: '',
                                        createdDate: '', // Will be handled gracefully by ProductCard
                                        isSaved: false,
                                        saveCount: 0
                                    } as Product}
                                    compact
                                />
                            </Box>
                        )}

                        {/* Messages */}
                        <Box sx={{ 
                            overflow: 'auto', 
                            p: 2,
                            minHeight: 0
                        }}>
                            {messagesLoading ? (
                                <Typography>Loading messages...</Typography>
                            ) : messages.length === 0 ? (
                                <Typography color="text.secondary" align="center">
                                    No messages yet. Start the conversation!
                                </Typography>
                            ) : (
                                messages.map((message) => (
                                    <Box
                                        key={message.id}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: message.senderId === user?.id ? 'flex-end' : 'flex-start',
                                            mb: 2
                                        }}
                                    >
                                        <Paper
                                            sx={{
                                                p: 2,
                                                maxWidth: '70%',
                                                backgroundColor: message.senderId === user?.id ? 'primary.main' : '#f5f5f5',
                                                color: message.senderId === user?.id ? 'white' : 'text.primary'
                                            }}
                                        >
                                            <Typography variant="body2">
                                                {message.content}
                                            </Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                                                {formatTime(message.sentAt)}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </Box>

                        {/* Message Input - Fixed at bottom */}
                        <Box sx={{ 
                            p: 2, 
                            borderTop: 1, 
                            borderColor: 'divider',
                            backgroundColor: 'background.paper',
                            height: '80px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    maxRows={2}
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={sendingMessage}
                                />
                                <IconButton
                                    color="primary"
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim() || sendingMessage}
                                >
                                    <Send />
                                </IconButton>
                            </Box>
                        </Box>
                    </>
                ) : (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '100%',
                        color: 'text.secondary',
                        gridRow: '1 / -1'
                    }}>
                        <MessageIcon sx={{ fontSize: 64, mb: 2 }} />
                        <Typography variant="h6">Select a conversation</Typography>
                        <Typography variant="body2">
                            Choose a conversation from the list to start messaging
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
