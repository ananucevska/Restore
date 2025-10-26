import { Button, Menu, Fade, MenuItem, ListItemIcon, ListItemText, Divider, Badge } from "@mui/material";
import { useState, useEffect } from "react";
import { User } from "../models/user";
import {Inventory, Logout, Person, Bookmark, Message} from "@mui/icons-material";
import { useLogoutMutation } from "../../features/account/accountApi";
import { useFetchConversationsQuery } from "../../features/messages/messagesApi";
import {Link} from "react-router-dom";

type Props = {
    user: User
}

export default function UserMenu({ user }: Props) {
    const [logout] = useLogoutMutation();
    const { data: conversations = [], refetch: refetchConversations } = useFetchConversationsQuery();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    
    // Calculate total unread messages
    const unreadCount = conversations.reduce((total, conversation) => {
        return total + (conversation.hasUnreadMessages ? 1 : 0);
    }, 0);

    // Listen for cross-tab message notifications
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'messageSent' && e.newValue) {
                console.log('UserMenu: Message sent event received via localStorage, refetching conversations...');
                refetchConversations();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [refetchConversations]);
    
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                onClick={handleClick}
                color='inherit'
                size='large'
                sx={{fontSize: '1.1rem'}}
            >
                {user.name}
            </Button>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem component={Link} to='/profile' onClick={handleClose}>
                    <ListItemIcon>
                        <Person />
                    </ListItemIcon>
                    <ListItemText>Профил</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to='/messages' onClick={handleClose}>
                    <ListItemIcon>
                        <Badge badgeContent={unreadCount} color="error" max={99}>
                            <Message />
                        </Badge>
                    </ListItemIcon>
                    <ListItemText>Пораки</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to='/inventory'>
                    <ListItemIcon>
                        <Inventory />
                    </ListItemIcon>
                    <ListItemText>Мои производи</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to='/saved-products'>
                    <ListItemIcon>
                        <Bookmark />
                    </ListItemIcon>
                    <ListItemText>Зачувани производи</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={logout}>
                    <ListItemIcon>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText>Одјави се</ListItemText>
                </MenuItem>
            </Menu>
        </div>
    );
}