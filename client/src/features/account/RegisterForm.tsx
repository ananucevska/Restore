import {useRegisterMutation} from "./accountApi.ts";
import {useForm} from "react-hook-form";
import {registerSchema, RegisterSchema} from "../../lib/schemas/registerSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Box, Button, Container, Paper, TextField, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText} from "@mui/material";
import {LockOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {macedonianCities} from "../../app/data/cities";
import {skopjeMunicipalities} from "../../app/data/municipalities";

export default function RegisterForm() {
    const [registerUser] = useRegisterMutation();
    const {register, handleSubmit, setError, watch, formState: {errors, isLoading}} = useForm<RegisterSchema>({
        mode: 'onTouched',
        resolver: zodResolver(registerSchema)
    })
    
    const selectedCity = watch('city');
    
    const onSubmit = async (data: RegisterSchema) => {
        console.log('Registration data:', data);
        try {
            await registerUser(data).unwrap();
            console.log('Registration successful');
        } catch (error) {
            console.error('Registration error:', error);
            const apiError = error as { message: string };
            if (apiError.message && typeof apiError.message === 'string') {
                const errorArray = apiError.message.split(',');
                
                errorArray.forEach(e => {
                    if(e.includes('Name') || e.includes('Username')) {
                        setError('username', {message: e})
                    } else if(e.includes('Password')) {
                        setError('password', {message: e})
                    } else if (e.includes('Email')) {
                        setError('email', {message: e})
                    } else if (e.includes('ConfirmPassword')) {
                        setError('confirmPassword', {message: e})
                    } else if (e.includes('City')) {
                        setError('city', {message: e})
                    } else if (e.includes('Municipality')) {
                        setError('municipality', {message: e})
                    } else if (e.includes('Neighborhood')) {
                        setError('neighborhood', {message: e})
                    }
                })
            }
        }
    }
    
    return (
        <Container component={Paper} maxWidth="md" sx={{ borderRadius: 3, p: 4 }}>
            <Box display='flex' flexDirection='column' alignItems='center' marginTop='8'>
                <LockOutlined sx={{mt: 3, color: 'secondary.main', fontSize: 40 }} />
                <Typography variant="h5">
                    Регистрација
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
                        label="Корисничко име"
                        autoFocus
                        size="large"
                        {...register('username')}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                    />
                    <TextField
                        fullWidth
                        label="Емаил"
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
                    <TextField
                        fullWidth
                        label="Потврди лозинка"
                        type="password"
                        size="large"
                        {...register('confirmPassword')}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                    />
                    <FormControl fullWidth error={!!errors.city}>
                        <InputLabel>Град</InputLabel>
                        <Select
                            {...register('city')}
                            label="Град"
                            value={watch('city') || ''}
                        >
                            {macedonianCities.map((city) => (
                                <MenuItem key={city} value={city}>
                                    {city}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.city && (
                            <FormHelperText>{errors.city.message}</FormHelperText>
                        )}
                    </FormControl>
                    {selectedCity === 'Скопје' && (
                        <FormControl fullWidth error={!!errors.municipality}>
                            <InputLabel>Општина (Опционално)</InputLabel>
                            <Select
                                {...register('municipality')}
                                label="Општина (Опционално)"
                                value={watch('municipality') || ''}
                            >
                                <MenuItem value="">
                                    <em>Избери општина</em>
                                </MenuItem>
                                {skopjeMunicipalities.map((municipality) => (
                                    <MenuItem key={municipality} value={municipality}>
                                        {municipality}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.municipality && (
                                <FormHelperText>{errors.municipality.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                    <TextField
                        fullWidth
                        label="Населено место (Опционално)"
                        size="large"
                        {...register('neighborhood')}
                        error={!!errors.neighborhood}
                        helperText={errors.neighborhood?.message}
                    />
                    <Button disabled={isLoading} variant="contained" type='submit'>
                        Регистрирај се
                    </Button>
                    <Typography sx={{ textAlign: 'center' }}>
                        Веќе имаш профил?{' '}
                        <Typography sx={{ml: 2}} component={Link} to='/login' color='primary'>
                            Најави се
                        </Typography>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}