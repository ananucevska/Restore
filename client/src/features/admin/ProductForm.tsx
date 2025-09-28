import {createProductSchema, CreateProductSchema} from "../../lib/schemas/createProductSchema.ts";
import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Box, Button, Paper, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import AppTextInput from "../../app/shared/components/AppTextInput.tsx";
import AppSelectInput from "../../app/shared/components/AppSelectInput.tsx";
import AppDropzone from "../../app/shared/components/AppDropzone.tsx";
import {Product} from "../../app/models/product.ts";
import {useEffect} from "react";
import {useCreateProductMutation, useUpdateProductMutation} from "./adminApi.ts";
import {LoadingButton} from "@mui/lab";
import {handleApiError} from "../../lib/util.ts";
import {categoryMenu} from "../../app/data/categories.ts";

type Props = {
  setEditMode: (value: boolean) => void;
  product: Product | null;
  refetch: () => void;
  setSelectedProduct: (value: Product | null) => void;
}
export default function ProductForm({setEditMode, product, refetch, setSelectedProduct}: Props) {
  const {control, handleSubmit, watch, reset, setError, formState: {isSubmitting}} = useForm<CreateProductSchema>({
    mode: 'onTouched',
    resolver: zodResolver(createProductSchema) as any
  })
  const watchFile = watch('file');
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  // Generate type options from category menu
  const getTypeOptions = () => {
    const options: { value: string; label: string }[] = [];
    
    categoryMenu.categories.forEach(category => {
      // Always add the main category
      options.push({
        value: category.value,
        label: category.label
      });
      
      // If category has subcategories, add them with parent category prefix
      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach(subcategory => {
          options.push({
            value: `${category.value} - ${subcategory.value}`,
            label: `${category.label} - ${subcategory.label}`
          });
        });
      }
      
      // If category has tags (male/female), add them with parent category prefix
      if (category.tags && category.tags.length > 0) {
        category.tags.forEach(tag => {
          options.push({
            value: `${category.value} - ${tag.value}`,
            label: `${category.label} - ${tag.label}`
          });
        });
      }
    });
    
    return options;
  };
  
  useEffect(() => {
    if (product) reset(product);
    
    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview);
    }
  }, [product, reset, watchFile]);
  
  const createFormData = (items: FieldValues) => {
    const formData = new FormData();
    for (const key in items) {
      formData.append(key, items[key]);
    }
    return formData;
  }
  const onSubmit = async (data: CreateProductSchema) => {
    try {
      const formData = createFormData(data);
      
      if (watchFile) formData.append('file', watchFile);
      
      if (product) await updateProduct({id: product.id, data: formData}).unwrap();
      else await createProduct(formData).unwrap();
      setEditMode(false);
      setSelectedProduct(null);
      refetch();
    } catch (error) {
      console.log(error);
      handleApiError<CreateProductSchema>(error, setError, ['description', 'file', 'name', 'pictureUrl', 'type']);
    }
  }
  
  return (
    <Box component={Paper} sx={{p: 4, maxWidth: 'lg', mx: 'auto'}}>
      <Typography variant="h4" sx={{mb: 4}}>
        Product details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit as any)}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <AppTextInput control={control as any} label="Product name" name="name" />
          </Grid>
          <Grid size={12}>
            <AppSelectInput
                items={getTypeOptions() as { value: string; label: string }[]}
                control={control as any}
                label="Type"
                name="type"
            />
          </Grid>
          <Grid size={12}>
            <AppTextInput 
                control={control as any}
                multiline
                rows={4}
                label="Description" 
                name="description" />
          </Grid>
          <Grid size={12} display='flex' justifyContent='space-between' alignItems='center'>
            <AppDropzone name = "file" control={control as any} />
            {watchFile?.preview ? (
                <img src={watchFile.preview} alt='preview of image' style={{ maxHeight: 200 }} />
            ) : product?.pictureUrl ? (
                <img src={product?.pictureUrl} alt='preview of image' style={{ maxHeight: 200 }} />
            ) : null}
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-between" sx={{mt: 3}}>
          <Button onClick={() => setEditMode(false)} variant="contained" color='inherit'>Cancel</Button>
          <LoadingButton
              loading={isSubmitting}
              variant="contained" 
              color='success' 
              type="submit">Submit</LoadingButton>
        </Box>
      </form>
    </Box>
  )
}
