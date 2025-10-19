export interface CategoryTag {
  id: string;
  label: string; // Macedonian label for display
  value: string; // English value for API
}

export interface FilterOption {
  id: string;
  label: string; // Macedonian label for display
  value: string; // English value for API
}

export interface FilterCategory {
  id: string;
  label: string; // Macedonian label for display
  value: string; // English value for API
  options: FilterOption[];
}

export interface CategoryItem {
  id: string;
  label: string; // Macedonian label for display
  value: string; // English value for API
  subcategories?: CategoryItem[];
  tags?: CategoryTag[]; // For male/female options
}

export interface CategoryMenu {
  categories: CategoryItem[];
  filters?: FilterCategory[]; // Optional filters
}

export interface SelectedCategory {
  categoryId: string;
  subcategoryId?: string;
  tags?: string[]; // Selected tag values (male/female)
}

export interface SelectedFilters {
  condition?: string[];
  delivery?: string[];
}
