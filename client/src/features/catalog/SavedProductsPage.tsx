import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { useFetchSavedProductsQuery, useUnsaveProductMutation } from "./catalogApi";
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Button,
    IconButton
} from "@mui/material";
import { Bookmark, Visibility } from "@mui/icons-material";
import { Link } from "react-router-dom";
import AppPagination from "../../app/shared/components/AppPagination";
import { setPageNumber } from "./catalogSlice";

export default function SavedProductsPage() {
    const productParams = useAppSelector(state => state.catalog);
    const { data, isLoading, error } = useFetchSavedProductsQuery(productParams);
    const [unsaveProduct] = useUnsaveProductMutation();
    const dispatch = useAppDispatch();

    const handleUnsave = async (productId: number) => {
        try {
            await unsaveProduct(productId).unwrap();
        } catch (error) {
            console.error('Error removing product from saved:', error);
        }
    };

    if (isLoading) return null;
    if (error) return <div>Error loading saved products</div>;

    return (
        <Box sx={{ p: 3 }}>
            {data && data.items && data.items.length > 0 ? (
                <>
                    <Grid container spacing={3}>
                        {data.items.map((product) => (
                            <Grid size={3} display='flex' key={product.id}>
                                <Card sx={{ 
                                    width: 350, 
                                    height: '100%',
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    justifyContent: 'space-between',
                                    position: 'relative'
                                }}>
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image={product.pictureUrl}
                                        alt={product.name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {product.description.length > 100 
                                                ? `${product.description.substring(0, 100)}...` 
                                                : product.description
                                            }
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'space-between', p: 2.5, mt: -1 }}>
                                        <Button
                                            component={Link}
                                            to={`/product/${product.id}`}
                                            startIcon={<Visibility />}
                                            variant="contained"
                                            size="small"
                                        >
                                            Прегледај производ
                                        </Button>
                                        <IconButton
                                            onClick={() => handleUnsave(product.id)}
                                            color="primary"
                                            size="small"
                                            title="Remove from saved"
                                        >
                                            <Bookmark />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                        {data.pagination && (
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
                        Сè уште немате зачувано производи
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Разгледајте ги достапните производи и зачувајте ги оние за кои сте заинтересирани!
                    </Typography>
                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        sx={{ mt: 2 }}
                    >
                        Пребарај Производи
                    </Button>
                </Paper>
            )}
        </Box>
    );
}
