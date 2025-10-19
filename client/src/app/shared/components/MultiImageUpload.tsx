import React, { useRef, useState, useEffect } from 'react';
import { Button, Box, Typography, Chip, IconButton } from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { useController, UseControllerProps, FieldValues } from 'react-hook-form';

type FileWithPreview = File & { preview: string };

type Props<T extends FieldValues> = {
  name: keyof T;
  label?: string;
  maxImages?: number;
  accept?: string;
  onFilesChange?: (files: File[]) => void;
  existingImages?: Array<{ id: number; url: string; order: number }>;
} & UseControllerProps<T>;


export default function MultiImageUpload<T extends FieldValues>({
  name,
  control,
  label = "Прикачи слики",
  maxImages = 10,
  accept = "image/*",
  onFilesChange,
  existingImages = []
}: Props<T>) {
  const { field, fieldState } = useController({ name, control });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [existingImagesState, setExistingImagesState] = useState<Array<{ id: number; url: string; order: number }>>([]);
  const filesRef = useRef<File[]>([]);

  // Handle existing images
  useEffect(() => {
    if (existingImages && existingImages.length > 0) {
      const sortedImages = [...existingImages].sort((a, b) => a.order - b.order);
      setExistingImagesState(sortedImages);
    }
  }, [existingImages]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length > 0) {
      // Limit to maxImages
      const limitedFiles = files.slice(0, maxImages);
      
      // Create files with preview
      const filesWithPreview = limitedFiles.map(file => {
        const fileWithPreview = file as FileWithPreview;
        fileWithPreview.preview = URL.createObjectURL(file);
        return fileWithPreview;
      });
      
      setImages(filesWithPreview);
      
      // Store files in ref
      filesRef.current = limitedFiles;
      
      // Call the onFilesChange callback with the original files
      if (onFilesChange) {
        onFilesChange(limitedFiles);
      }
      
      // Store a flag in form field for validation
      field.onChange(limitedFiles.length > 0 ? ['files-exist'] : []);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newFiles = filesRef.current.filter((_, i) => i !== index);
    setImages(newImages);
    filesRef.current = newFiles;
    
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
    field.onChange(newFiles.length > 0 ? ['files-exist'] : []);
  };

  const clearAllImages = () => {
    setImages([]);
    filesRef.current = [];
    
    if (onFilesChange) {
      onFilesChange([]);
    }
    field.onChange([]);
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      <Button
        variant="outlined"
        component="span"
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
        <Box sx={{ 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1
          }}>
            <CloudUpload sx={{ mr: 1, fontSize: '2rem' }} />
            <Typography variant="h6" sx={{ lineHeight: 1 }}>
              {label}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Кликни за да избереш
          </Typography>
          {images.length > 0 && (
            <Typography variant="caption" color="primary" sx={{ display: 'block' }}>
              Избрани: {images.length}
            </Typography>
          )}
        </Box>
      </Button>

      {fieldState.error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {fieldState.error.message}
        </Typography>
      )}

      {/* Image Previews */}
      {(images.length > 0 || existingImagesState.length > 0) && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2">
              Почетната слика ја избирате со кликнување на сликата која сакате прва да се прикаже
            </Typography>
            <Button
              size="small"
              color="error"
              onClick={clearAllImages}
              startIcon={<Delete />}
            >
              Избриши ги сите
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {/* Existing Images */}
            {existingImagesState.map((image, index) => (
              <Box
                key={`existing-${image.id}`}
                sx={{
                  position: 'relative',
                  width: 120,
                  height: 120,
                  border: '2px solid',
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => {
                  // Move existing image to front
                  const newExistingImages = [image, ...existingImagesState.filter((_, i) => i !== index)];
                  setExistingImagesState(newExistingImages);
                }}
              >
                <img
                  src={image.url}
                  alt={`Existing image ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    borderRadius: '50%',
                    width: 24,
                    height: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {index + 1}
                </Box>
              </Box>
            ))}
            
            {/* New Images */}
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  width: 120,
                  height: 120,
                  border: '2px solid',
                  borderColor: index === 0 ? 'primary.main' : 'grey.300',
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main'
                  }
                }}
                onClick={() => {
                  // Move image to front (make it primary)
                  const newImages = [image, ...images.filter((_, i) => i !== index)];
                  const newFiles = [filesRef.current[index], ...filesRef.current.filter((_, i) => i !== index)];
                  setImages(newImages);
                  filesRef.current = newFiles;
                  
                  if (onFilesChange) {
                    onFilesChange(newFiles);
                  }
                  field.onChange(['files-exist']);
                }}
              >
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* Primary indicator */}
                {index === 0 && (
                  <Chip
                    label="Главна"
                    size="small"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      left: 4,
                      fontSize: '0.7rem'
                    }}
                  />
                )}
                
                {/* Remove button */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
