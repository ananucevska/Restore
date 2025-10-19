import { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, Typography } from '@mui/material';
import { Message } from '@mui/icons-material';
import { useCreateConversationMutation } from './messagesApi';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../app/models/product';
import { useUserInfoQuery } from '../account/accountApi';

type Props = {
    product: Product;
    variant?: 'contained' | 'outlined' | 'text';
    size?: 'small' | 'medium' | 'large';
}

export default function MessageButton({ product, variant = 'contained', size = 'medium' }: Props) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [createConversation, { isLoading }] = useCreateConversationMutation();
    const navigate = useNavigate();
    const { data: user, isLoading: userLoading } = useUserInfoQuery();

    const handleClick = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setOpen(true);
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !product.userId) return;

        try {
            await createConversation({
                otherUserId: product.userId,
                productId: product.id,
                initialMessage: message.trim()
            }).unwrap();
            
            setOpen(false);
            setMessage('');
            navigate('/messages');
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setMessage('');
    };

    // Don't show message button if user is the product owner
    if (user && product.userId === user.id) {
        return null;
    }

    // Show loading state while user is being fetched
    if (userLoading) {
        return (
            <Button
                variant={variant}
                size={size}
                startIcon={<Message />}
                disabled
            >
                Loading...
            </Button>
        );
    }

    return (
        <>
            <Button
                variant={variant}
                size={size}
                startIcon={<Message />}
                onClick={handleClick}
                disabled={!product.userId || !user}
                title={!product.userId ? 'No product owner' : !user ? 'Please log in' : 'Send message'}
            >
                Испрати порака
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Message {product.creatorName || 'the seller'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            About: {product.name}
                        </Typography>
                    </Box>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Your message"
                        fullWidth
                        multiline
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Hi! I'm interested in this product..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button 
                        onClick={handleSendMessage} 
                        variant="contained"
                        disabled={!message.trim() || isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Message'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
