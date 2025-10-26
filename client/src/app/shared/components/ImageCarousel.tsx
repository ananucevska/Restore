import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { ProductImage } from '../../models/product';
import ImageModal from './ImageModal';

interface ImageCarouselProps {
  images: ProductImage[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  // Sort images by order
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sortedImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === sortedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleImageClick = () => {
    setModalOpen(true);
  };

  if (sortedImages.length === 1) {
    return (
      <>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <img 
            src={sortedImages[0].url} 
            alt={alt} 
            style={{ 
              width: '100%', 
              maxHeight: '500px', 
              objectFit: 'contain',
              cursor: 'pointer'
            }}
            onClick={handleImageClick}
          />
        </Box>
        <ImageModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          images={sortedImages}
          currentIndex={0}
          onIndexChange={setCurrentIndex}
          alt={alt}
        />
      </>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box 
        sx={{ 
          position: 'relative', 
          overflow: 'hidden',
          borderRadius: 2
        }}
      >
        <img 
          src={sortedImages[currentIndex].url} 
          alt={`${alt} - Image ${currentIndex + 1}`}
          style={{ 
            width: '100%', 
            height: '500px', 
            objectFit: 'contain',
            display: 'block',
            cursor: 'pointer'
          }}
          onClick={handleImageClick}
        />
        
        {/* Navigation Arrows */}
        <IconButton
          onClick={goToPrevious}
          sx={{
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
            zIndex: 1,
          }}
        >
          <ChevronLeft />
        </IconButton>
        
        <IconButton
          onClick={goToNext}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
            zIndex: 1,
          }}
        >
          <ChevronRight />
        </IconButton>
        
        {/* Image Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            zIndex: 1,
          }}
        >
          {sortedImages.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: 8,
                height: 8,
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
      </Box>
      
      <ImageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        images={sortedImages}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        alt={alt}
      />
    </Box>
  );
}
