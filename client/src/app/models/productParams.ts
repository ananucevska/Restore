import { SelectedCategory, SelectedFilters } from './category';

export type ProductParams = {
    orderBy: string;
    searchTerm?: string;
    types: string[];
    pageNumber: number;
    pageSize: number;
    selectedCategories: SelectedCategory[];
    selectedFilters?: SelectedFilters;
}