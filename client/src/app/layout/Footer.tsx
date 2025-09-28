import { Box, Container, Typography, Link, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        py: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center">
          <Grid size={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Дај, не фрлај
            </Typography>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Сите права се задржани.
            </Typography>
          </Grid>
          
          <Grid size={9}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
              <Link
                component={RouterLink}
                to="/privacy"
                variant="body2"
                color="text.secondary"
                sx={{ 
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: 'primary.main'
                  }
                }}
              >
                Политика на приватност
              </Link>
              
              <Link
                component={RouterLink}
                to="/faq"
                variant="body2"
                color="text.secondary"
                sx={{ 
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: 'primary.main'
                  }
                }}
              >
                Најчесто поставувани прашања
              </Link>
              
              <Link
                component={RouterLink}
                to="/contact"
                variant="body2"
                color="text.secondary"
                sx={{ 
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: 'primary.main'
                  }
                }}
              >
                Контакт
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
