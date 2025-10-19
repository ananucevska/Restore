import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { useMemo } from "react";
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
  Chip,
} from "@mui/material";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";
import { useFetchProductDetailsQuery, useSaveProductMutation, useUnsaveProductMutation } from "./catalogApi";
import { useUserInfoQuery } from "../account/accountApi";
import { useState, useEffect } from "react";
import MessageButton from "../messages/MessageButton";
import ImageCarousel from "../../app/shared/components/ImageCarousel";
export default function ProductDetails() {
  const {id} = useParams();
  const [isSaved, setIsSaved] = useState(false);

  const {data: product, isLoading} = useFetchProductDetailsQuery(id ? +id : 0) /* + symbol casts it into a number */
  const {data: user} = useUserInfoQuery();
  const [saveProduct] = useSaveProductMutation();
  const [unsaveProduct] = useUnsaveProductMutation();

  // Update local state when product data changes
  useEffect(() => {
    if (product) {
      setIsSaved(product.isSaved);
    }
  }, [product]);

  // Check if the product belongs to the current user
  const isOwnProduct = user && product && user.id === product.userId;

  const formatDate = useMemo(() => {
    return (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
  }, []);

  if (!product || isLoading) return <div>Loading...</div>

  const handleSaveToggle = async () => {
    if (!product) return;

    try {
      if (isSaved) {
        await unsaveProduct(product.id).unwrap();
        setIsSaved(false);
      } else {
        await saveProduct(product.id).unwrap();
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };
  
  
  // Parse delivery options from JSON string
  const getDeliveryOptions = () => {
    if (!product.delivery) return [];
    try {
      const deliveryArray = JSON.parse(product.delivery);
      return Array.isArray(deliveryArray) ? deliveryArray : [];
    } catch {
      return [];
    }
  };

  const deliveryOptions = getDeliveryOptions();
  const deliveryLabels = deliveryOptions.map(option => {
    switch(option) {
      case 'Pick up only':
        return 'Лично подигнување';
      case 'Can deliver':
        return 'Можност за испорака по карго';
      default:
        return option;
    }
  });

  // Map condition values to Macedonian labels
  const getConditionLabel = (condition: string | null) => {
    if (!condition) return null;
    switch(condition) {
      case 'Like New':
        return 'Како ново';
      case 'Good':
        return 'Добро сочувано';
      case 'Functional':
        return 'Функционално';
      default:
        return condition;
    }
  };

  const productDetails = [
    {label: 'Опис', value: product.description},
    ...(product.condition ? [{label: 'Состојба', value: getConditionLabel(product.condition)}] : []),
    ...(deliveryOptions.length > 0 ? [{label: 'Начин на испорака', value: deliveryLabels.join(', ')}] : [])
  ]
  
  return (
      <Grid container spacing={6} maxWidth="lg" sx={{mx: 'auto'}}>
        <Grid size={6}>
          {product.images && product.images.length > 0 ? (
            <ImageCarousel images={product.images} alt={product.name} />
          ) : (
            <img src={product.pictureUrl} alt={product.name} style={{width:'100%'}} />
          )}
        </Grid>
        <Grid size={6}>
          <Typography variant="h4">{product.name}</Typography>
          <Divider sx={{mb: 2}}/>
          {/* Description without label */}
          <Typography variant="body1" sx={{ mb: 2 }}>
            {product.description}
          </Typography>
          
          <TableContainer>
            <Table>
              <TableBody>
                {productDetails.filter(detail => detail.label !== 'Опис').map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', border: 'none', py: 1 }}>
                      {detail.label}:
                    </TableCell>
                    <TableCell sx={{ border: 'none', py: 1 }}>
                      {detail.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Creator Information and Like Section */}
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">
                Додадено од корисникот {product.creatorName || 'Unknown'}
                {product.creatorCity && (
                  <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                    од {product.creatorCity}
                    {product.creatorMunicipality && `, ${product.creatorMunicipality}`}
                    {product.creatorNeighborhood && `, ${product.creatorNeighborhood}`}
                  </Typography>
                )}
              </Typography>
            </Box>
            <Box sx={{ display: 'left', flexDirection: 'column', gap: 2 }}>
            <Chip 
                label={formatDate(product.createdDate)} 
                size="small" 
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
                          </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <MessageButton product={product} />
              <IconButton 
                onClick={handleSaveToggle}
                color={isSaved ? 'primary' : 'default'}
                disabled={isOwnProduct}
                sx={{ p: 1 }}
                title={isOwnProduct ? "You cannot save your own products" : ""}
              >
                {isSaved ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </Box>
            
          </Box>
        </Grid>
      </Grid>
  )
}