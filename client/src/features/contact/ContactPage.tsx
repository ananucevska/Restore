import { Container, Typography, Box, Paper, TextField, Button, Alert, Snackbar } from "@mui/material";
import { Email } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactSchema } from "../../lib/schemas/contactSchema";
import { useSendContactMessageMutation } from "./contactApi";
import { useState, useEffect } from "react";
import { useUserInfoQuery } from "../account/accountApi";

export default function ContactPage() {
  const [sendContactMessage, { isLoading }] = useSendContactMessageMutation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const { data: user } = useUserInfoQuery();

  const { control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched'
  });

  // Auto-fill form with user data when available
  useEffect(() => {
    if (user) {
      setValue('username', user.name);
      setValue('email', user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data: ContactSchema) => {
    try {
      await sendContactMessage(data).unwrap();
      setShowSuccess(true);
      reset();
    } catch (error) {
      console.error('Error sending contact message:', error);
      setShowError(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Често поставувани прашања
          </Typography>
          <Typography variant="body1" paragraph>
            Ако имате некое прашање, проверете ја нашата <a href="/faq" style={{ color: 'inherit', textDecoration: 'underline' }}>ЧПП страница</a> каде ќе најдете одговори на најчестите прашања. Доколку не го пронајдете одговорот таму, пополнете ја формата и ние ќе ви одговориме во најбрз можен рок.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Email sx={{ mt: 3, color: 'secondary.main', fontSize: 40 }} />
            <Typography variant="h5">
              Испратете ни порака
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              fullWidth
              label="Корисничко име"
              variant="outlined"
              size="large"
              {...control.register('username')}
              value={watch('username') || ''}
              error={!!errors.username}
              helperText={errors.username?.message}
              disabled={!!user}
              InputProps={{
                readOnly: !!user
              }}
            />
            <TextField
              fullWidth
              label="Е-маил"
              type="email"
              variant="outlined"
              size="large"
              {...control.register('email')}
              value={watch('email') || ''}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={!!user}
              InputProps={{
                readOnly: !!user
              }}
            />
            <TextField
              fullWidth
              label="Предмет"
              variant="outlined"
              size="large"
              {...control.register('subject')}
              error={!!errors.subject}
              helperText={errors.subject?.message}
            />
            <TextField
              fullWidth
              label="Порака"
              multiline
              rows={6}
              variant="outlined"
              size="large"
              {...control.register('message')}
              error={!!errors.message}
              helperText={errors.message?.message}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Испраќа...' : 'Испрати порака'}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          Вашата порака е успешно испратена! Ќе ви одговориме во најбрз можен рок.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert onClose={() => setShowError(false)} severity="error">
          Грешка при испраќање на пораката. Ве молиме обидете се повторно.
        </Alert>
      </Snackbar>
    </Container>
  );
}