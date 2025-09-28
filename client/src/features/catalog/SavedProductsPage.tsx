import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { useFetchSavedProductsQuery, useUnsaveProductMutation } from "./catalogApi";
import {
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    Chip,
    IconButton
} from "@mui/material";
import { Bookmark, Visibility, BookmarkBorder } from "@mui/icons-material";
import { Link } from "react-router-dom";
import AppPagination from "../../app/shared/components/AppPagination";
import { setPageNumber } from "./catalogSlice";

export default function SavedProductsPage() {
    const productParams = useAppSelector(state => state.catalog);
    const { data, isLoading, error } = useFetchSavedProductsQuery(productParams);
    const [unsaveProduct] = useUnsaveProductMutation();
    const dispatch = useAppDispatch();

    // Debug logging
    console.log('SavedProductsPage - data:', data);
    console.log('SavedProductsPage - isLoading:', isLoading);
    console.log('SavedProductsPage - error:', error);

    const handleUnsave = async (productId: number) => {
        try {
            console.log('Removing product from saved:', productId);
            await unsaveProduct(productId).unwrap();
            console.log('Product removed from saved successfully');
        } catch (error) {
            console.error('Error removing product from saved:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading saved products</div>;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            {data && data.items && data.items.length > 0 ? (
                <>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
                        {data.items.map((product) => (
                            <Card key={product.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.pictureUrl}
                                    alt={product.name}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {product.description.length > 100 
                                            ? `${product.description.substring(0, 100)}...` 
                                            : product.description
                                        }
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                        <Chip label={product.type} size="small" variant="outlined" />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Added by: {product.creatorName || 'Unknown'}
                                        {product.creatorCity && (
                                            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                from {product.creatorCity}
                                                {product.creatorMunicipality && `, ${product.creatorMunicipality}`}
                                                {product.creatorNeighborhood && `, ${product.creatorNeighborhood}`}
                                            </Typography>
                                        )}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDate(product.createdDate)}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between' }}>
                                    <Button
                                        component={Link}
                                        to={`/${product.id}`}
                                        startIcon={<Visibility />}
                                        variant="contained"
                                        size="small"
                                    >
                                        View Details
                                    </Button>
                                    <IconButton
                                        onClick={() => handleUnsave(product.id)}
                                        color="primary"
                                        size="small"
                                        title="Remove from saved"
                                    >
                                        <BookmarkBorder />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        ))}
                    </Box>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        {data.pagination && data.items.length > 0 && (
                            <AppPagination
                                metadata={data.pagination}
                                onPageChange={(page: number) => dispatch(setPageNumber(page))}
                            />
                        )}
                    </Box>
                </>
            ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Bookmark sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        Сè уште немате зачувано продукти
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Разгледајте ги достапните продукти и зачувајте ги оние за кои сте заинтересирани!
                    </Typography>
                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        sx={{ mt: 2 }}
                    >
                        Пребарај Продукти
                    </Button>
                </Paper>
            )}
        </Box>
    );
}
