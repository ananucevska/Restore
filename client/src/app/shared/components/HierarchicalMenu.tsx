import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  ChevronRight,
} from '@mui/icons-material';
import { CategoryItem, SelectedCategory } from '../../models/category';

interface HierarchicalMenuProps {
  categories: CategoryItem[];
  selectedCategories: SelectedCategory[];
  onCategorySelect: (category: SelectedCategory) => void;
  onCategoryDeselect: (categoryId: string, subcategoryId?: string) => void;
}

export default function HierarchicalMenu({
  categories,
  selectedCategories,
  onCategorySelect,
  onCategoryDeselect,
}: HierarchicalMenuProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const isCategorySelected = (categoryId: string, subcategoryId?: string) => {
    return selectedCategories.some(
      (selected) =>
        selected.categoryId === categoryId &&
        (!subcategoryId || selected.subcategoryId === subcategoryId)
    );
  };

  const isMainCategorySelected = (categoryId: string) => {
    return selectedCategories.some(
      (selected) =>
        selected.categoryId === categoryId &&
        !selected.subcategoryId
    );
  };

  const getSelectedTags = (categoryId: string) => {
    const selected = selectedCategories.find((cat) => cat.categoryId === categoryId);
    return selected?.tags || [];
  };

  const handleCategoryClick = (category: CategoryItem, subcategory?: CategoryItem) => {
    const categoryId = category.id;
    const subcategoryId = subcategory?.id;

    if (isCategorySelected(categoryId, subcategoryId)) {
      // If clicking on the same category/subcategory, deselect it
      onCategoryDeselect(categoryId, subcategoryId);
    } else {
      // Always select with empty tags array - users will choose tags individually
      onCategorySelect({
        categoryId,
        subcategoryId,
        tags: [],
      });
    }
  };


  const renderCategoryItem = (category: CategoryItem, level: number = 0) => {
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    const hasTags = category.tags && category.tags.length > 0;
    const isExpanded = expandedItems.has(category.id);
    const isSelected = isMainCategorySelected(category.id);
    const selectedTags = getSelectedTags(category.id);

    return (
      <Box key={category.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              if (hasSubcategories) {
                toggleExpanded(category.id);
              } else {
                // For all other categories (including those with tags), just select them
                handleCategoryClick(category);
              }
            }}
            sx={{
              pl: 2 + level * 2,
              backgroundColor: isSelected ? 'primary.light' : 'transparent',
              '&:hover': {
                backgroundColor: isSelected ? 'primary.light' : 'action.hover',
              },
            }}
          >
            <ListItemText
              primary={
                <Typography variant="body2" fontWeight={isSelected ? 'bold' : 'normal'}>
                  {category.label}
                </Typography>
              }
            />
            {hasSubcategories && (
              <Box>
                {isExpanded ? <ExpandLess /> : <ChevronRight />}
              </Box>
            )}
          </ListItemButton>
        </ListItem>


        {/* Subcategories */}
        {hasSubcategories && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {category.subcategories!.map((subcategory) => {
                const isSubSelected = isCategorySelected(category.id, subcategory.id);
                return (
                  <ListItem key={subcategory.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleCategoryClick(category, subcategory)}
                      sx={{
                        pl: 4 + level * 2,
                        backgroundColor: isSubSelected ? 'primary.light' : 'transparent',
                        '&:hover': {
                          backgroundColor: isSubSelected ? 'primary.light' : 'action.hover',
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={isSubSelected ? 'bold' : 'normal'}>
                            {subcategory.label}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        )}



      </Box>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Категории
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List component="nav" disablePadding>
        {categories.map((category) => renderCategoryItem(category))}
      </List>
    </Paper>
  );
}
