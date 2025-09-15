import { useUpdateProfileMutation, useUserInfoQuery } from "./accountApi.ts";
import { useForm } from "react-hook-form";
import { profileSchema, ProfileSchema } from "../../lib/schemas/profileSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Container, Paper, TextField, Typography, CircularProgress } from "@mui/material";
import { Person } from "@mui/icons-material";
import { useEffect } from "react";

export default function ProfileForm() {
    const [updateProfile] = useUpdateProfileMutation();
    const { data: user, isLoading } = useUserInfoQuery();
    
    const { register, handleSubmit, setValue, setError, formState: { errors, isValid, isSubmitting } } = useForm<ProfileSchema>({
        mode: 'onTouched',
        resolver: zodResolver(profileSchema)
    });

    // Populate form with user data when it loads
    useEffect(() => {
        if (user) {
            setValue('name', user.name);
            setValue('city', user.city);
            setValue('municipality', user.municipality || '');
            setValue('naselba', user.naselba || '');
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
                    } else if (e.includes('City')) {
                        setError('city', {message: e})
                    } else if (e.includes('Municipality')) {
                        setError('municipality', {message: e})
                    } else if (e.includes('Naselba')) {
                        setError('naselba', {message: e})
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
        <Container component={Paper} maxWidth="sm" sx={{ borderRadius: 3, mt: 4 }}>
            <Box display='flex' flexDirection='column' alignItems='center' marginTop='8'>
                <Person sx={{mt: 3, color: 'secondary.main', fontSize: 40 }} />
                <Typography variant="h5">
                    My Profile
                </Typography>
                <Box
                    component='form'
                    onSubmit={handleSubmit(onSubmit)}
                    width='100%'
                    display='flex'
                    flexDirection='column'
                    gap={3}
                    marginY={3}
                >
                    <TextField
                        fullWidth
                        label="Email"
                        value={user?.email || ''}
                        disabled
                        helperText="Email cannot be changed"
                    />
                    <TextField
                        fullWidth
                        label="Name"
                        autoFocus
                        {...register('name')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                    <TextField
                        fullWidth
                        label="City"
                        {...register('city')}
                        error={!!errors.city}
                        helperText={errors.city?.message}
                    />
                    <TextField
                        fullWidth
                        label="Municipality (Optional)"
                        {...register('municipality')}
                        error={!!errors.municipality}
                        helperText={errors.municipality?.message}
                    />
                    <TextField
                        fullWidth
                        label="Naselba (Optional)"
                        {...register('naselba')}
                        error={!!errors.naselba}
                        helperText={errors.naselba?.message}
                    />
                    <Button 
                        disabled={isSubmitting || !isValid} 
                        variant="contained" 
                        type='submit'
                        sx={{ mt: 2 }}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Profile'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
