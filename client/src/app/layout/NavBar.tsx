import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import { DarkMode, LightMode } from '@mui/icons-material';
import {NavLink, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector } from "../store/store";
import { setDarkMode } from "./uiSlice";
import { setSelectedCategories } from "../../features/catalog/catalogSlice";
import { catalogApi } from "../../features/catalog/catalogApi";
import UserMenu from "./UserMenu.tsx";
import {useUserInfoQuery} from "../../features/account/accountApi.ts";

const midLinks = [
    { title: 'Почетна', path: '/' },
    { title: 'Контакт', path: '/contact' },
]

const rightLinks = [
    { title: 'Најава', path: '/login' },
    { title: 'Регистрација', path: '/register' }
]


export default function NavBar() {
    const {data: user} = useUserInfoQuery();
    const {darkMode} = useAppSelector(state => state.ui);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    
    const handleHomeClick = () => {
        // Clear selected categories when navigating to homepage
        dispatch(setSelectedCategories([]));
        // Invalidate the products cache to force a refetch
        dispatch(catalogApi.util.invalidateTags(['Product']));
        navigate('/');
    };
    
    return (
        <AppBar position="fixed">
            <Toolbar sx={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                minHeight: '64px',
                '& > *': {
                    display: 'flex',
                    alignItems: 'center',
                    height: '64px'
                }
            }}>
                <Box>
                    <Typography 
                        sx={{
                            color: 'inherit',
                            cursor: 'pointer',
                            fontSize: '1.25rem',
                            fontWeight: 500,
                            lineHeight: '64px',
                            height: '64px',
                            display: 'inline-block',
                            verticalAlign: 'top'
                        }} 
                        onClick={handleHomeClick}
                    >
                        Дај, не фрлај
                    </Typography>
                    <IconButton onClick={() => dispatch(setDarkMode())} sx={{ ml: 1, verticalAlign: 'middle' }}>
                        {darkMode ? <DarkMode /> : <LightMode sx={{ color: 'yellow' }} />}
                    </IconButton>
                </Box>

                <Box>
                    {midLinks.map(({ title, path }) => (
                        <Typography
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={{
                                color: 'inherit',
                                fontSize: '1.25rem',
                                fontWeight: 500,
                                px: 2,
                                lineHeight: '64px',
                                height: '64px',
                                display: 'inline-block',
                                verticalAlign: 'top',
                                textDecoration: 'none',
                                '&:hover': {
                                    color: 'grey.500'
                                },
                                '&.active': {
                                    color: '#baecf9'
                                }
                            }}
                            onClick={path === '/' ? handleHomeClick : undefined}
                        >
                            {title.toUpperCase()}
                        </Typography>
                    ))}
                </Box>

                <Box>
                    {user ? (
                        <UserMenu user={user} />
                    ) : (
                        <>
                            {rightLinks.map(({ title, path }) => (
                                <Typography
                                    component={NavLink}
                                    to={path}
                                    key={path}
                                    sx={{
                                        color: 'inherit',
                                        fontSize: '1.25rem',
                                        fontWeight: 500,
                                        px: 2,
                                        lineHeight: '64px',
                                        height: '64px',
                                        display: 'inline-block',
                                        verticalAlign: 'top',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            color: 'grey.500'
                                        },
                                        '&.active': {
                                            color: '#baecf9'
                                        }
                                    }}
                                >
                                    {title.toUpperCase()}
                                </Typography>
                            ))}
                        </>
                    )}
                </Box>

            </Toolbar>
        </AppBar>
    )
}