import {Box, Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Breadcrumbs from "../shared/components/Breadcrumbs";
import {Outlet, ScrollRestoration} from "react-router-dom";
import { useAppSelector } from "../store/store";

function App() {
    const {darkMode} = useAppSelector(state => state.ui); /*we substitute usestate with redux store code*/
  const palleteType = darkMode ? "dark" : "light";
    const theme = createTheme({
        palette: {
            mode: palleteType,
            background: {
                default: (palleteType === 'light') ? "#eaeaea" : "#121212",
            }
        },
        typography: {
            fontFamily: 'Roboto, Arial, sans-serif',
            h1: {
                fontFamily: 'Poppins, Arial, sans-serif',
                fontWeight: 800,
            },
            h2: {
                fontFamily: 'Poppins, Arial, sans-serif',
                fontWeight: 800,
            },
            h3: {
                fontFamily: 'Poppins, Arial, sans-serif',
                fontWeight: 800,
            },
            h4: {
                fontFamily: 'Poppins, Arial, sans-serif',
                fontWeight: 800,
            },
            h5: {
                fontFamily: 'Poppins, Arial, sans-serif',
                fontWeight: 800,
            },
            h6: {
                fontFamily: 'Poppins, Arial, sans-serif',
                fontWeight: 800,
            },
        }
    });
    
  return (
      <ThemeProvider theme={theme}>
          <ScrollRestoration />
          <CssBaseline />
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <NavBar />
              <Box sx={{
                   flex: 1,
                   background: darkMode ? "radial-gradient(circle, #1e3aBa, #111B27)" 
                       : "radial-gradient(circle, #baecf9, #f0f9ff)",
                  py: 6
              }}
              >
                  <Container maxWidth='xl' sx = {{mt: 8}}>
                      <Breadcrumbs />
                      <Outlet/>
                  </Container>
                </Box>
              <Footer />
          </Box>
      </ThemeProvider>
  )
}

export default App
