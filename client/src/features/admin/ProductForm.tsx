import {createProductSchema, CreateProductSchema} from "../../lib/schemas/createProductSchema.ts";
import {FieldValues, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Box, Button, Paper, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import AppTextInput from "../../app/shared/components/AppTextInput.tsx";
import {useFetchFiltersQuery} from "../catalog/catalogApi.ts";
import AppSelectInput from "../../app/shared/components/AppSelectInput.tsx";
import AppDropzone from "../../app/shared/components/AppDropzone.tsx";
import {Product} from "../../app/models/product.ts";
import {useEffect} from "react";
import {useCreateProductMutation, useUpdateProductMutation} from "./adminApi.ts";
import {LoadingButton} from "@mui/lab";
import {handleApiError} from "../../lib/util.ts";

type Props = {
  setEditMode: (value: boolean) => void;
  product: Product | null;
  refetch: () => void;
  setSelectedProduct: (value: Product | null) => void;
}
export default function ProductForm({setEditMode, product, refetch, setSelectedProduct}: Props) {
  const {control, handleSubmit, watch, reset, setError, formState: {isSubmitting}} = useForm<CreateProductSchema>({
    mode: 'onTouched',
    resolver: zodResolver(createProductSchema)
  })
  const watchFile = watch('file');
  const {data} = useFetchFiltersQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  
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
      handleApiError<CreateProductSchema>(error, setError, ['brand', 'description', 'file', 'name', 'pictureUrl', 'price', 'quantityInStock', 'type']);
    }
  }
  
  return (
    <Box component={Paper} sx={{p: 4, maxWidth: 'lg', mx: 'auto'}}>
      <Typography variant="h4" sx={{mb: 4}}>
        Product details
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <AppTextInput control={control} label="Product name" name="name" />
          </Grid>
          <Grid size={6}>
            {data?.brands &&
            <AppSelectInput 
                items={data.brands}
                control={control}
                label="Brand"                          
                name="brand"
            />}
          </Grid>
          <Grid size={6}>
            {data?.types &&
                <AppSelectInput
                    items={data.types}
                    control={control}
                    label="Type"
                    name="type"
                />}
          </Grid>
          <Grid size={6}>
            <AppTextInput type="number" control={control} label="Price in cents" name="price" />
          </Grid>
          <Grid size={6}>
            <AppTextInput type="number" control={control} label="Quantity in stock" name="quantityInStock" />
          </Grid>
          <Grid size={12}>
            <AppTextInput 
                control={control}
                multiline
                rows={4}
                label="Description" 
                name="description" />
          </Grid>
          <Grid size={12} display='flex' justifyContent='space-between' alignItems='center'>
            <AppDropzone name = "file" control={control} />
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