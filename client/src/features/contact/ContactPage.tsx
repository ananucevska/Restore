import { Container, Typography, Box, Paper, Grid, TextField, Button, Card, CardContent } from "@mui/material";
import { Email, Phone, LocationOn, AccessTime } from "@mui/icons-material";

export default function ContactPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom align="center">
        Контакт
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom>
              Контактирајте не
            </Typography>
            <Typography variant="body1" paragraph>
              Имате прашања или ви треба помош? Нашиот тим е тука да ви помогне!
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6">Е-маил</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    info@example.com
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6">Телефон</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    +389 XX XXX XXX
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6">Адреса</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Улица Пример бр. 123<br />
                    1000 Скопје, Македонија
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTime sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6">Работно време</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Понеделник - Петок: 09:00 - 18:00<br />
                    Сабота: 10:00 - 16:00<br />
                    Недела: Затворено
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom>
              Испратете ни порака
            </Typography>
            
            <Box component="form" sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Име"
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Презиме"
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Е-маил"
                    type="email"
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Предмет"
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Порака"
                    multiline
                    rows={4}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Испрати порака
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Additional Information */}
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Често поставувани прашања
          </Typography>
          <Typography variant="body1" paragraph>
            Ако имате чести прашања, проверете ја нашата <a href="/faq" style={{ color: 'inherit', textDecoration: 'underline' }}>FAQ страница</a> 
            каде ќе најдете одговори на најчестите прашања.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Време на одговор
          </Typography>
          <Typography variant="body1">
            Обично одговараме на е-маил прашања во рок од 24 часа, а на телефонски повици веднаш во работно време.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}