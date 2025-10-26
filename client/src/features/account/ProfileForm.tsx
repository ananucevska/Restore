import { useUpdateProfileMutation, useUserInfoQuery } from "./accountApi.ts";
import { useForm } from "react-hook-form";
import { profileSchema, ProfileSchema } from "../../lib/schemas/profileSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, Paper, TextField, CircularProgress, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from "@mui/material";
import { Person } from "@mui/icons-material";
import { useEffect } from "react";
import { macedonianCities } from "../../app/data/cities";
import { skopjeMunicipalities } from "../../app/data/municipalities";

export default function ProfileForm() {
    const [updateProfile] = useUpdateProfileMutation();
    const { data: user, isLoading } = useUserInfoQuery();
    
    const { register, handleSubmit, setValue, setError, watch, formState: { errors, isValid, isSubmitting } } = useForm<ProfileSchema>({
        mode: 'onTouched',
        resolver: zodResolver(profileSchema)
    });
    
    const selectedCity = watch('city');

    // Populate form with user data when it loads
    useEffect(() => {
        if (user) {
            setValue('name', user.name);
            setValue('email', user.email);
            setValue('city', user.city);
            setValue('municipality', user.municipality || '');
            setValue('neighborhood', user.neighborhood || '');
        }
    }, [user, setValue]);
    
    const onSubmit = async (data: ProfileSchema) => {
        try {
            await updateProfile(data).unwrap();
        } catch (error) {
            const apiError = error as { message: string };
            if (apiError.message && typeof apiError.message === 'string') {
                const errorArray = apiError.message.split(',');
                
                errorArray.forEach(e => {
                    if(e.includes('Name')) {
                        setError('name', {message: e})
                    } else if (e.includes('Email')) {
                        setError('email', {message: e})
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

    if (isLoading) {
        return (
            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }
    
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', py: 4 }}>
            <Container component={Paper} maxWidth="md" sx={{ borderRadius: 3, p: 4 }}>
                <Box display='flex' flexDirection='column' alignItems='center'>
                    <Person sx={{ mt: 3, color: 'secondary.main', fontSize: 40 }} />
                    <Typography variant="h5">
                        Профил
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
                        type="email"
                        size="large"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        fullWidth
                        label="Корисничко име"
                        autoFocus
                        size="large"
                        {...register('name')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
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
                        label="Населба (Опционално)"
                        size="large"
                        {...register('neighborhood')}
                        error={!!errors.neighborhood}
                        helperText={errors.neighborhood?.message}
                    />
                        <Button 
                            disabled={isSubmitting || !isValid} 
                            variant="contained" 
                            type='submit'
                            sx={{ mt: 2 }}
                        >
                            {isSubmitting ? 'Се ажурира...' : 'Ажурирај профил'}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
