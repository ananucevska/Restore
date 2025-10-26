import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Close, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { ProductImage } from '../../models/product';

interface ImageModalProps {
  open: boolean;
  onClose: () => void;
  images: ProductImage[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  alt: string;
}

export default function ImageModal({
  open,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  alt,
}: ImageModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!images || images.length === 0) return null;

  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? sortedImages.length - 1 : currentIndex - 1;
    onIndexChange(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex === sortedImages.length - 1 ? 0 : currentIndex + 1;
    onIndexChange(newIndex);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    } else if (event.key === 'ArrowLeft') {
      goToPrevious();
    } else if (event.key === 'ArrowRight') {
      goToNext();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      onKeyDown={handleKeyDown}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          color: 'white',
          boxShadow: 'none',
        },
      }}
    >
      <DialogContent
        sx={{
          p: 0,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: isMobile ? '100vh' : '80vh',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 2,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
            },
          }}
        >
          <Close />
        </IconButton>

        {/* Navigation Arrows */}
        {sortedImages.length > 1 && (
          <>
            <IconButton
              onClick={goToPrevious}
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
              }}
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              onClick={goToNext}
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}

        {/* Main Image */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            p: 2,
          }}
        >
          <img
            src={sortedImages[currentIndex].url}
            alt={`${alt} - Image ${currentIndex + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: isMobile ? '70vh' : '80vh',
              objectFit: 'contain',
              borderRadius: 8,
            }}
          />
          
          {/* Image Counter */}
          {sortedImages.length > 1 && (
            <Typography
              variant="body2"
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                px: 2,
                py: 1,
                borderRadius: 1,
              }}
            >
              {currentIndex + 1} / {sortedImages.length}
            </Typography>
          )}
        </Box>

        {/* Image Indicators */}
        {sortedImages.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 60,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              zIndex: 2,
            }}
          >
            {sortedImages.map((_, index) => (
              <Box
                key={index}
                onClick={() => onIndexChange(index)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: index === currentIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: index === currentIndex ? 'primary.dark' : 'rgba(255, 255, 255, 0.8)',
                  },
                }}
              />
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
