
import { Link } from "react-router-dom";
import { Product } from "../../app/models/product"
import {Card, CardContent, CardMedia, Typography, Box} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { useMemo } from "react";

type Props = {
    product: Product
}
export default function ProductCard({product}: Props) {
    const formattedDate = useMemo(() => {
        return new Date(product.createdDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }, [product.createdDate]);

    return (
        <Card 
            component={Link}
            to={`/product/${product.id}`}
            elevation={3} 
            sx={{
                width: 280, 
                borderRadius: 2,
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between",
                textDecoration: 'none',
                cursor: 'pointer'
            }}
        >
            <CardMedia 
                sx={{
                    height: 240, 
                    backgroundSize: "cover",
                    cursor: 'pointer'
                }}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent sx={{ textAlign: 'center' }}>
                <Typography 
                    gutterBottom 
                    sx={{
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 400,
                        '&:hover': {
                            color: 'primary.main'
                        }
                    }}
                    variant="body1"
                >
                    {product.name}
                </Typography>
                
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mt: 1,
                    px: 1
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOn sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: '1rem' }}
                        >
                            {product.creatorCity || 'N/A'}
                        </Typography>
                    </Box>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: '1rem' }}
                    >
                        {formattedDate}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}