import { Container, Typography, Box, Paper, TextField, Button, Alert, Snackbar } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactSchema } from "../../lib/schemas/contactSchema";
import { useSendContactMessageMutation } from "./contactApi";
import { useState } from "react";

export default function ContactPage() {
  const [sendContactMessage, { isLoading }] = useSendContactMessageMutation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched'
  });

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
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
          <Typography variant="h5" gutterBottom>
            Често поставувани прашања
          </Typography>
          <Typography variant="body1" paragraph>
            Ако имате некое прашање, проверете ја нашата <a href="/faq" style={{ color: 'inherit', textDecoration: 'underline' }}>FAQ страница</a> каде ќе најдете одговори на најчестите прашања. Доколку не го пронајдете одговорот таму, пополнете ја формата и ние ќе ви одговориме во најбрз можен рок.
          </Typography>
          <Typography variant="h4" gutterBottom>
            Испратете ни порака
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Име"
              variant="outlined"
              {...control.register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              fullWidth
              label="Презиме"
              variant="outlined"
              {...control.register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
            <TextField
              fullWidth
              label="Е-маил"
              type="email"
              variant="outlined"
              {...control.register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              label="Предмет"
              variant="outlined"
              {...control.register('subject')}
              error={!!errors.subject}
              helperText={errors.subject?.message}
            />
            <TextField
              fullWidth
              label="Порака"
              multiline
              rows={4}
              variant="outlined"
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