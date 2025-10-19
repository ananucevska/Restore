import {createProductSchema, CreateProductSchema} from "../../lib/schemas/createProductSchema.ts";
import {FieldValues, useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Box, Button, Paper, Typography, FormControlLabel, Checkbox} from "@mui/material";
import Grid from "@mui/material/Grid";
import AppTextInput from "../../app/shared/components/AppTextInput.tsx";
import AppSelectInput from "../../app/shared/components/AppSelectInput.tsx";
import MultiImageUpload from "../../app/shared/components/MultiImageUpload.tsx";
import {Product} from "../../app/models/product.ts";
import {useEffect, useRef, useState} from "react";
import {useCreateProductMutation, useUpdateProductMutation} from "./adminApi.ts";
import {LoadingButton} from "@mui/lab";
import {handleApiError} from "../../lib/util.ts";
import {categoryMenu} from "../../app/data/categories.ts";
import { toast } from "react-toastify";


type Props = {
  setEditMode: (value: boolean) => void;
  product: Product | null;
  refetch: () => void;
  setSelectedProduct: (value: Product | null) => void;
}
export default function ProductForm({setEditMode, product, refetch, setSelectedProduct}: Props) {
  const {control, handleSubmit, watch, reset, setError, setValue, formState: {isSubmitting}} = useForm<CreateProductSchema>({
    mode: 'onTouched',
    resolver: zodResolver(createProductSchema) as any,
    defaultValues: {
      files: []
    }
  })
  const watchFiles = watch('files');
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const filesRef = useRef<File[]>([]);

  // Generate type options from category menu
  const getTypeOptions = () => {
    const options: { value: string; label: string }[] = [];
    
    categoryMenu.categories.forEach(category => {
      // Only add main category if it has NO subcategories
      if (!category.subcategories || category.subcategories.length === 0) {
        options.push({
          value: category.value,
          label: category.label
        });
      }
      
      // If category has subcategories, add them with parent category prefix
      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach(subcategory => {
          // Only add the subcategory itself if it has NO tags
          if (!subcategory.tags || subcategory.tags.length === 0) {
            options.push({
              value: `${category.value} - ${subcategory.value}`,
              label: `${category.label} - ${subcategory.label}`
            });
          }
          
          // If subcategory has tags (male/female), add them with parent category prefix
          if (subcategory.tags && subcategory.tags.length > 0) {
            subcategory.tags.forEach(tag => {
              options.push({
                value: `${category.value} - ${subcategory.value} - ${tag.value}`,
                label: `${category.label} - ${subcategory.label} - ${tag.label}`
              });
            });
          }
        });
      }
      
      // If category has tags (male/female) and NO subcategories, add them with parent category prefix
      if (category.tags && category.tags.length > 0 && (!category.subcategories || category.subcategories.length === 0)) {
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
    if (product) {
      // Convert delivery string to array for form
      const deliveryArray = product.delivery ? JSON.parse(product.delivery) : [];
      const productData = {
        ...product,
        delivery: deliveryArray
      };
      reset(productData);
    }
    
    return () => {
      if (watchFiles) {
        watchFiles.forEach((file: any) => {
          if (file.preview) URL.revokeObjectURL(file.preview);
        });
      }
    }
  }, [product, reset, watchFiles]);
  
  const createFormData = (items: FieldValues) => {
    const formData = new FormData();
    
    // Add basic fields
    formData.append('name', items.name);
    formData.append('description', items.description);
    formData.append('type', items.type);
    
    // Add condition if provided
    if (items.condition) {
      formData.append('condition', items.condition);
    }
    
    // Add delivery options as JSON array if provided
    if (items.delivery && Array.isArray(items.delivery) && items.delivery.length > 0) {
      const deliveryJson = JSON.stringify(items.delivery);
      formData.append('delivery', deliveryJson);
    }
    
    // Handle files array - get from ref instead of form data
    const files = filesRef.current;
    
    if (files.length > 0) {
      files.forEach((file: File, index: number) => {
        if (index === 0) {
          formData.append('File', file); // First file as main file
        } else if (index < 10) { // Support up to 10 files
          formData.append(`File${index + 1}`, file); // Additional files
        }
      });
    }
    
    return formData;
  }
  const onSubmit = async (data: CreateProductSchema) => {
    try {
      const formData = createFormData(data);
      
      if (product) {
        await updateProduct({id: product.id, data: formData}).unwrap();
        toast.success("Производот е успешно ажуриран!");
      } else {
        await createProduct(formData).unwrap();
        toast.success("Производот е успешно додаден!");
      }
      setEditMode(false);
      setSelectedProduct(null);
      refetch();
    } catch (error) {
      console.log(error);
      handleApiError<CreateProductSchema>(error, setError, ['description', 'files', 'name', 'pictureUrl', 'type']);
    }
  }
  
  return (
    <Box component={Paper} sx={{p: 4, maxWidth: 'lg', mx: 'auto'}}>
      <Typography variant="h4" sx={{mb: 4}}>
        {product ? 'Измени производ' : 'Додај нов производ'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit as any)}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <AppTextInput control={control as any} label="Име на производ" name="name" />
          </Grid>
          <Grid size={12}>
            <AppSelectInput
                items={getTypeOptions() as { value: string; label: string }[]}
                control={control as any}
                label="Тип"
                name="type"
            />
          </Grid>
          <Grid size={12}>
            <AppTextInput 
                control={control as any}
                multiline
                rows={4}
                label="Опис" 
                name="description" />
          </Grid>
          <Grid size={12}>
            <AppSelectInput
                items={[
                    { value: 'Like New', label: 'Како ново' },
                    { value: 'Good', label: 'Добро сочувано' },
                    { value: 'Functional', label: 'Функционално' }
                ]}
                control={control as any}
                label="Состојба"
                name="condition"
            />
          </Grid>
          <Grid size={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Опции за подигнување/достава
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Controller
                name="delivery"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value?.includes('Pick up only') || false}
                          onChange={(e) => {
                            const currentDelivery = field.value || [];
                            const newDelivery = e.target.checked
                              ? [...currentDelivery, 'Pick up only']
                              : currentDelivery.filter((item: string) => item !== 'Pick up only');
                            console.log('Pick up only changed:', e.target.checked, 'New delivery:', newDelivery);
                            field.onChange(newDelivery);
                          }}
                        />
                      }
                      label="Лично подигнување"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value?.includes('Can deliver') || false}
                          onChange={(e) => {
                            const currentDelivery = field.value || [];
                            const newDelivery = e.target.checked
                              ? [...currentDelivery, 'Can deliver']
                              : currentDelivery.filter((item: string) => item !== 'Can deliver');
                            console.log('Can deliver changed:', e.target.checked, 'New delivery:', newDelivery);
                            field.onChange(newDelivery);
                          }}
                        />
                      }
                      label="Можност за испорака по карго"
                    />
                  </>
                )}
              />
            </Box>
          </Grid>
          <Grid size={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>Слики</Typography>
            <MultiImageUpload 
              name="files" 
              control={control as any} 
              label="Прикачи слики"
              existingImages={product?.images || []}
              onFilesChange={(files) => {
                console.log('onFilesChange called with files:', files);
                console.log('Number of files:', files.length);
                filesRef.current = files;
                // Update a separate validation field
                setValue('hasFiles', files.length > 0);
              }}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-between" sx={{mt: 3}}>
          <LoadingButton
              loading={isSubmitting}
              variant="contained" 
              color='success' 
              type="submit">Зачувај</LoadingButton>
        </Box>
      </form>
    </Box>
  )
}
