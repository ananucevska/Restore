export interface CategoryTag {
  id: string;
  label: string; // Macedonian label for display
  value: string; // English value for API
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
}

export interface SelectedCategory {
  categoryId: string;
  subcategoryId?: string;
  tags?: string[]; // Selected tag values (male/female)
}
