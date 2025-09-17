import { Card, CardContent, CardMedia, Typography, Box, Chip } from '@mui/material';
import { Product } from '../../app/models/product';

type Props = {
    product: Product;
    compact?: boolean;
}

export default function ProductCard({ product, compact = false }: Props) {
    const formatDate = (dateString: string) => {
        if (!dateString || dateString === '') {
            return 'Recently';
        }
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Recently';
        }
        
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (compact) {
        return (
            <Card sx={{ 
                display: 'flex', 
                maxWidth: 300, 
                mb: 1,
                border: '1px solid #e0e0e0'
            }}>
                <CardMedia
                    sx={{ width: 80, height: 80 }}
                    image={product.pictureUrl}
                    title={product.name}
                />
                <CardContent sx={{ flex: 1, p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography variant="subtitle2" noWrap>
                        {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        by {product.creatorName}
                    </Typography>
                    <Chip 
                        label={formatDate(product.createdDate)} 
                        size="small" 
                        variant="outlined"
                        sx={{ mt: 0.5, fontSize: '0.7rem', height: 20 }}
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ 
            maxWidth: 250, 
            mb: 2,
            border: '1px solid #e0e0e0'
        }}>
            <CardMedia
                sx={{ height: 150 }}
                image={product.pictureUrl}
                title={product.name}
            />
            <CardContent>
                <Typography variant="subtitle1" gutterBottom noWrap>
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    by {product.creatorName}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Chip 
                        label={product.type} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                        {formatDate(product.createdDate)}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}
