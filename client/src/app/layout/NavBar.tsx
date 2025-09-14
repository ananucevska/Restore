import {AppBar, Box, IconButton, LinearProgress, List, ListItem, Toolbar, Typography} from "@mui/material";
import { DarkMode, LightMode } from '@mui/icons-material';
import {NavLink} from "react-router-dom";
import {useAppDispatch, useAppSelector } from "../store/store";
import { setDarkMode } from "./uiSlice";
import UserMenu from "./UserMenu.tsx";
import {useUserInfoQuery} from "../../features/account/accountApi.ts";

const midLinks = [
    { title: 'home', path: '/' },
    { title: 'about', path: '/about' },
    { title: 'contact', path: '/contact' },
]

const rightLinks = [
    { title: 'login', path: '/login' },
    { title: 'register', path: '/register' }
]

const navStyles = {
    color: 'inherit',
    typography: 'h6',
    textDecoration: 'none',
    '&:hover': {
        color: 'grey.500'
    },
    '&.active': {
        color: '#baecf9'
    }
}

export default function NavBar() {
    const {data: user} = useUserInfoQuery();
    const {isLoading, darkMode} = useAppSelector(state => state.ui);
    const dispatch = useAppDispatch();
    
    return (
        <AppBar position="fixed">
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Box display='flex' alignItems='center'>
                    <Typography component={NavLink} sx={navStyles} to='/' variant="h6">Дај, не фрлај</Typography>
                    <IconButton onClick={() => dispatch(setDarkMode())}>
                        {darkMode ? <DarkMode /> : <LightMode sx={{ color: 'yellow' }} />}
                    </IconButton>
                </Box>

                <List sx={{ display: 'flex' }}>
                    {midLinks.map(({ title, path }) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}
                        >
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>

                <Box display='flex' alignItems='center'>
                    {user ? (
                        <UserMenu user={user} />
                    ) : (
                        <List sx={{ display: 'flex' }}>
                            {rightLinks.map(({ title, path }) => (
                                <ListItem
                                    component={NavLink}
                                    to={path}
                                    key={path}
                                    sx={navStyles}
                                >
                                    {title.toUpperCase()}
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>

            </Toolbar>
            {isLoading && ( //ako e tocno isLoading toa so e posle && ke se izvrsi
                <Box sx={{width: '100%'}}>
                    <LinearProgress color="secondary" />
                </Box>
            )}
        </AppBar>
    )
}