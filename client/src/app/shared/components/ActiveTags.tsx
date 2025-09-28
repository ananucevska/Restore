import { Box, Chip, Typography, Stack } from '@mui/material';
import { SelectedCategory } from '../../models/category';
import { categoryMenu } from '../../data/categories';

interface ActiveTagsProps {
  selectedCategories: SelectedCategory[];
  onTagRemove: (categoryId: string, tagValue: string) => void;
}

export default function ActiveTags({ selectedCategories, onTagRemove }: ActiveTagsProps) {
  // Get all active filters - only show what's actually selected
  const activeFilters = selectedCategories.flatMap(cat => {
    const category = categoryMenu.categories.find(c => c.id === cat.categoryId);
    if (!category) return [];
    
    const subcategory = category.subcategories?.find(s => s.id === cat.subcategoryId);
    const filters = [];
    
    // Add category/subcategory filter only if there's a subcategory
    if (subcategory) {
      filters.push({
        type: 'subcategory',
        categoryId: cat.categoryId,
        subcategoryId: cat.subcategoryId,
        label: `${category.label} - ${subcategory.label}`,
        onRemove: () => onTagRemove(cat.categoryId, cat.subcategoryId || '')
      });
    } else if (!category.tags || category.tags.length === 0) {
      // Add main category filter only for categories without tags
      filters.push({
        type: 'category',
        categoryId: cat.categoryId,
        label: category.label,
        onRemove: () => onTagRemove(cat.categoryId, '')
      });
    }
    
    // Add selected tags for categories with tags
    if (category.tags && category.tags.length > 0 && cat.tags && cat.tags.length > 0) {
      cat.tags.forEach(tagValue => {
        const tag = category.tags!.find(t => t.value === tagValue);
        if (tag) {
          filters.push({
            type: 'tag-option',
            categoryId: cat.categoryId,
            tagValue: tag.value,
            label: tag.label,
            isSelected: true,
            onToggle: () => onTagRemove(cat.categoryId, tag.value)
          });
        }
      });
    }
    
    return filters;
  });

  // Get available (unselected) tag options for selected categories with tags
  const availableTagOptions = selectedCategories
    .filter(cat => {
      const category = categoryMenu.categories.find(c => c.id === cat.categoryId);
      return category?.tags && category.tags.length > 0;
    })
    .flatMap(cat => {
      const category = categoryMenu.categories.find(c => c.id === cat.categoryId);
      if (!category?.tags) return [];
      
      return category.tags
        .filter(tag => !cat.tags || !cat.tags.includes(tag.value)) // Only unselected tags
        .map(tag => ({
          type: 'tag-option',
          categoryId: cat.categoryId,
          tagValue: tag.value,
          label: tag.label,
          isSelected: false,
          onToggle: () => onTagRemove(cat.categoryId, tag.value) // This will add the tag via toggleCategoryTag
        }));
    });

  const allFilters = [...activeFilters, ...availableTagOptions];

  // Only show the filters section if there are categories with tags selected
  const hasCategoriesWithTags = selectedCategories.some(cat => {
    const category = categoryMenu.categories.find(c => c.id === cat.categoryId);
    return category?.tags && category.tags.length > 0;
  });

  if (!hasCategoriesWithTags) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Филтри:
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {allFilters.map((filter, index) => {
          if (filter.type === 'tag-option' && 'tagValue' in filter) {
            return (
              <Chip
                key={`${filter.categoryId}-${filter.type}-${filter.tagValue}`}
                label={filter.label}
                size="small"
                color={filter.isSelected ? "primary" : "default"}
                variant={filter.isSelected ? "filled" : "outlined"}
                onClick={filter.onToggle}
                sx={{ mb: 1, cursor: 'pointer' }}
              />
            );
          } else if ('onRemove' in filter) {
            return (
              <Chip
                key={`${filter.categoryId}-${filter.type}-${index}`}
                label={filter.label}
                size="small"
                color="primary"
                variant="filled"
                onDelete={filter.onRemove}
                sx={{ mb: 1 }}
              />
            );
          }
          return null;
        })}
      </Stack>
    </Box>
  );
}
