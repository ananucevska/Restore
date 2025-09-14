import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Box,
  IconButton,
  Chip
} from "@mui/material";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { useFetchProductDetailsQuery, useSaveProductMutation, useUnsaveProductMutation } from "./catalogApi";
import { useState, useEffect } from "react";
export default function ProductDetails() {
  const {id} = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);

  const {data: product, isLoading} = useFetchProductDetailsQuery(id ? +id : 0) /* + symbol casts it into a number */
  const [saveProduct] = useSaveProductMutation();
  const [unsaveProduct] = useUnsaveProductMutation();

  // Update local state when product data changes
  useEffect(() => {
    if (product) {
      setIsSaved(product.isSaved);
      setSaveCount(product.saveCount);
    }
  }, [product]);

  if (!product || isLoading) return <div>Loading...</div>

  const handleSaveToggle = async () => {
    if (!product) return;

    try {
      if (isSaved) {
        console.log('Unsaving product:', product.id);
        await unsaveProduct(product.id).unwrap();
        setIsSaved(false);
        setSaveCount(prev => prev - 1);
        console.log('Product unsaved successfully');
      } else {
        console.log('Saving product:', product.id);
        await saveProduct(product.id).unwrap();
        setIsSaved(true);
        setSaveCount(prev => prev + 1);
        console.log('Product saved successfully');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  
  const productDetails = [
    {label: 'Name', value: product.name},    
    {label: 'Description', value: product.description},
    {label: 'Type', value: product.type},
    {label: 'Quantity', value: product.quantityInStock}
/*
    {label: 'By', value: user.name}
*/

  ]
  
  return (
      <Grid container spacing={6} maxWidth="lg" sx={{mx: 'auto'}}>
        <Grid size={6}>
          <img src={product.pictureUrl} alt={product.name} style={{width:'100%'}} />
        </Grid>
        <Grid size={6}>
          <Typography variant="h3">{product.name}</Typography>
          <Divider sx={{mb: 2}}/>
          <TableContainer>
            <Table sx={{
              '& td': {fontsize: '1rem'}
            }}>
              <TableBody>
                  {productDetails.map((detail, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{fontWeight: 'bold'}}>{detail.label}</TableCell>
                      <TableCell>{detail.value}</TableCell>
                    </TableRow>
                    ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Creator Information and Like Section */}
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Added by: {product.creatorName || 'Unknown'}
                {product.creatorCity && (
                  <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    from {product.creatorCity}
                  </Typography>
                )}
              </Typography>
              <Chip 
                label={formatDate(product.createdDate)} 
                size="small" 
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                onClick={handleSaveToggle}
                color={isSaved ? 'primary' : 'default'}
                sx={{ p: 1 }}
              >
                {isSaved ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {saveCount} {saveCount === 1 ? 'save' : 'saves'}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
  )
}