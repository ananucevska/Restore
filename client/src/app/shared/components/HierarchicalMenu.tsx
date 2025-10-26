import { useState } from 'react';
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
  ChevronRight,
} from '@mui/icons-material';
import { CategoryItem, SelectedCategory } from '../../models/category';

// Function to sort Macedonian text alphabetically
const sortMacedonian = (a: string, b: string): number => {
  return a.localeCompare(b, 'mk', { sensitivity: 'base' });
};

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
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
      // Clear selected subcategory when collapsing a category
      setSelectedSubcategory(null);
    } else {
      newExpanded.add(itemId);
      // Clear selected subcategory when expanding a different category
      setSelectedSubcategory(null);
    }
    setExpandedItems(newExpanded);
  };

  const isCategorySelected = (categoryId: string, subcategoryId?: string) => {
    return selectedCategories.some(
      (selected) =>
        selected.categoryId === categoryId &&
        selected.subcategoryId === subcategoryId &&
        (!selected.tags || selected.tags.length === 0)
    );
  };

  const isTagSelected = (categoryId: string, subcategoryId: string, tagId: string) => {
    return selectedCategories.some(
      (selected) =>
        selected.categoryId === categoryId &&
        selected.subcategoryId === subcategoryId &&
        selected.tags?.includes(tagId)
    );
  };

  const isMainCategorySelected = (categoryId: string) => {
    return selectedCategories.some(
      (selected) =>
        selected.categoryId === categoryId &&
        !selected.subcategoryId &&
        (!selected.tags || selected.tags.length === 0)
    );
  };


  const handleCategoryClick = (category: CategoryItem, subcategory?: CategoryItem) => {
    const categoryId = category.id;
    const subcategoryId = subcategory?.id;

    if (isCategorySelected(categoryId, subcategoryId)) {
      // If clicking on the same category/subcategory, deselect it
      onCategoryDeselect(categoryId, subcategoryId);
      // Clear selected subcategory if deselecting
      if (subcategoryId) {
        setSelectedSubcategory(null);
      }
    } else {
      // Always select with empty tags array - users will choose tags individually
      onCategorySelect({
        categoryId,
        subcategoryId,
        tags: [],
      });
      // Set selected subcategory to show its tags
      if (subcategoryId) {
        setSelectedSubcategory(subcategoryId);
      }
    }
  };


  const renderCategoryItem = (category: CategoryItem, level: number = 0) => {
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    const isExpanded = expandedItems.has(category.id);
    const isSelected = isMainCategorySelected(category.id);

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
              {category.subcategories!
                .sort((a, b) => sortMacedonian(a.label, b.label))
                .map((subcategory) => {
                const isSubSelected = isCategorySelected(category.id, subcategory.id);
                const isSubcategorySelected = selectedSubcategory === subcategory.id;
                const hasTags = subcategory.tags && subcategory.tags.length > 0;
                
                return (
                  <Box key={subcategory.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          if (hasTags) {
                            // If subcategory has tags, toggle expansion instead of selecting
                            toggleExpanded(subcategory.id);
                          } else {
                            // If no tags, select the subcategory directly
                            handleCategoryClick(category, subcategory);
                          }
                        }}
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
                        {hasTags && (
                          <Box>
                            {expandedItems.has(subcategory.id) ? <ExpandLess /> : <ChevronRight />}
                          </Box>
                        )}
                      </ListItemButton>
                    </ListItem>
                    
                    {/* Tags for this subcategory when it's expanded or has selected tags */}
                    {hasTags && (expandedItems.has(subcategory.id) || isSubcategorySelected) && (
                      <Collapse in={true} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {subcategory.tags!.map((tag) => {
                            const isTagSelectedValue = isTagSelected(category.id, subcategory.id, tag.id);
                            
                            return (
                              <ListItem key={tag.id} disablePadding>
                                <ListItemButton
                                  onClick={() => {
                                    if (isTagSelectedValue) {
                                      // Remove tag
                                      onCategoryDeselect(category.id, subcategory.id);
                                    } else {
                                      // Add category with subcategory and tag
                                      onCategorySelect({
                                        categoryId: category.id,
                                        subcategoryId: subcategory.id,
                                        tags: [tag.id],
                                      });
                                      // Set selected subcategory to show its tags
                                      setSelectedSubcategory(subcategory.id);
                                    }
                                  }}
                                  sx={{
                                    pl: 8 + level * 2,
                                    backgroundColor: isTagSelectedValue ? 'primary.light' : 'transparent',
                                    '&:hover': {
                                      backgroundColor: isTagSelectedValue ? 'primary.light' : 'action.hover',
                                    },
                                  }}
                                >
                                  <ListItemText
                                    primary={
                                      <Typography variant="body2" fontWeight={isTagSelectedValue ? 'bold' : 'normal'}>
                                        {tag.label}
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
              })}
            </List>
          </Collapse>
        )}




      </Box>
    );
  };

  // Sort categories alphabetically by Macedonian alphabet
  const sortedCategories = [...categories].sort((a, b) => sortMacedonian(a.label, b.label));

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Категории
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List component="nav" disablePadding>
        {sortedCategories.map((category) => renderCategoryItem(category))}
      </List>
    </Paper>
  );
}
