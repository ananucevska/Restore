import { LockOutlined } from "@mui/icons-material";
import {Box, Button, Container, Paper, TextField, Typography} from "@mui/material";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {loginSchema, LoginSchema} from "../../lib/schemas/loginSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useLazyUserInfoQuery, useLoginMutation} from "./accountApi.ts";

export default function LoginForm() {
    const [login, {isLoading}] = useLoginMutation();
    const [fetchUserInfo] = useLazyUserInfoQuery();
    const location = useLocation();
    const {register, handleSubmit, formState: {errors}} = useForm<LoginSchema>({
        mode: 'onTouched',
        resolver: zodResolver(loginSchema)
    });
    const navigate = useNavigate();
    const onSubmit = async  (data: LoginSchema) => {
        await login(data);
        await fetchUserInfo();
        navigate(location.state?.from || "/");
    }
    
  return (
    <Container component={Paper} maxWidth="md" sx={{ borderRadius: 3, p: 4 }}>
        <Box display='flex' flexDirection='column' alignItems='center' marginTop='8'>
            <LockOutlined sx={{mt: 3, color: 'secondary.main', fontSize: 40 }} />
            <Typography variant="h5">
                Најава
            </Typography>
            <Box 
                component='form'
                onSubmit={handleSubmit(onSubmit)}
                width='100%'
                display='flex'
                flexDirection='column'
                gap={2}
                marginY={2}
            >
                <TextField 
                    fullWidth
                    label="Емаил"
                    autoFocus
                    size="large"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <TextField
                    fullWidth
                    label="Лозинка"
                    type="password"
                    size="large"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <Button disabled={isLoading} variant="contained" type='submit'>
                    Најави се
                </Button>
                <Typography sx={{ textAlign: 'center' }}>
                    Сè уште немаш профил?
                    <Typography sx={{ml: 2}} component={Link} to='/register' color='primary'>
                        Креирај профил
                    </Typography>
                </Typography>
            </Box>
        </Box>
    </Container>
  )
}