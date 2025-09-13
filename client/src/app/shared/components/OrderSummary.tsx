import { Box, Typography, Button, Paper } from "@mui/material";
import {Link, useLocation} from "react-router-dom";
export function OrderSummary() {
    const location = useLocation();

    return (
        <Box display="flex" flexDirection="column" alignItems="center" maxWidth="lg" mx="auto">
            <Paper sx={{mb: 2, p: 3, width: '100%', borderRadius: 3}}>

                <Typography variant="h6" component="p" fontWeight="bold">
                    Order summary
                </Typography>
                <Typography variant="body2" sx={{fontStyle: 'italic'}}>
                    Orders over $100 qualify for free delivery!
                </Typography>

                <Box mt={2}>
                    {!location.pathname.includes("checkout") &&
                    <Button
                        component={Link}
                        to='/checkout'
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{mb: 1}}
                    >
                        Checkout
                    </Button>}
                    <Button
                        component={Link}
                        to='/catalog'
                        fullWidth
                    >
                        Continue Shopping
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}