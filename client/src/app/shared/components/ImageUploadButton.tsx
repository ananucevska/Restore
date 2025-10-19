import React, { useRef } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useController, UseControllerProps, FieldValues } from 'react-hook-form';

type Props<T extends FieldValues> = {
  name: keyof T;
  label?: string;
  accept?: string;
} & UseControllerProps<T>;

export default function ImageUploadButton<T extends FieldValues>({
  name,
  control,
  label = "Upload Image",
  accept = "image/*"
}: Props<T>) {
  const { field, fieldState } = useController({ name, control });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file)
      });
      field.onChange(fileWithPreview);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <Button
        variant="outlined"
        component="span"
        startIcon={<CloudUpload />}
        onClick={handleButtonClick}
        fullWidth
        sx={{ 
          height: 200,
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: fieldState.error ? 'error.main' : 'inherit',
          '&:hover': {
            borderStyle: 'solid',
            backgroundColor: 'action.hover'
          }
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click to select image
          </Typography>
        </Box>
      </Button>
      {fieldState.error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {fieldState.error.message}
        </Typography>
      )}
    </Box>
  );
}
