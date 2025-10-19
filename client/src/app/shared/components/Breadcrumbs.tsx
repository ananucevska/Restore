import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Home, NavigateNext } from '@mui/icons-material';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbLabel = (pathname: string): string => {
    // Handle specific routes
    switch (pathname) {
      case 'profile':
        return 'Профил';
      case 'saved-products':
        return 'Зачувани производи';
      case 'messages':
        return 'Пораки';
      case 'inventory':
        return 'Мои производи';
      case 'contact':
        return 'Контакт';
      case 'privacy':
        return 'Приватност';
      case 'faq':
        return 'ЧПП';
      case 'login':
        return 'Најава';
      case 'register':
        return 'Регистрација';
      default:
        // If it's a number, it's likely a product ID
        if (!isNaN(Number(pathname))) {
          return 'Детали за производ';
        }
        return pathname.charAt(0).toUpperCase() + pathname.slice(1);
    }
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Почетна', path: '/' },
    ...pathnames.map((pathname, index) => ({
      label: getBreadcrumbLabel(pathname),
      path: index === pathnames.length - 1 ? undefined : `/${pathnames.slice(0, index + 1).join('/')}`
    }))
  ];

  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <Box sx={{ mb: 2, mt: 1 }}>
      <MuiBreadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: 'text.secondary'
          }
        }}
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          
          return isLast ? (
            <Typography
              key={item.label}
              color="text.primary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              {index === 0 && <Home sx={{ mr: 0.5, fontSize: '1rem' }} />}
              {item.label}
            </Typography>
          ) : (
            <Link
              key={item.label}
              component={RouterLink}
              to={item.path || '/'}
              color="inherit"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              {index === 0 && <Home sx={{ mr: 0.5, fontSize: '1rem' }} />}
              {item.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
}
