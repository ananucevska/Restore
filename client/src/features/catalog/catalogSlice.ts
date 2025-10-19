import {ProductParams} from "../../app/models/productParams.ts";
import {createSlice} from "@reduxjs/toolkit";

const initialState: ProductParams = {
    pageNumber: 1,
    pageSize: 8,
    types: [],
    searchTerm: '',
    orderBy: 'name', // Always alphabetical
    selectedCategories: [],
    selectedFilters: {
        condition: [],
        delivery: []
    }
}

export const catalogSlice = createSlice({
    name: 'catalogSlice',
    initialState,
    reducers: {
        setPageNumber(state, action) {
            state.pageNumber = action.payload
        },
        setPageSize(state, action) {
            state.pageSize = action.payload
        },
        setTypes(state, action) {
            state.types = action.payload
            state.pageNumber = 1;
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload
            state.pageNumber = 1;
        },
        setSelectedCategories(state, action) {
            state.selectedCategories = action.payload
            state.pageNumber = 1;
        },
        addSelectedCategory(state, action) {
            const newCategory = action.payload;
            // For single selection, replace all categories with the new one
            state.selectedCategories = [newCategory];
            state.pageNumber = 1;
        },
        removeSelectedCategory(state, action) {
            const { categoryId, subcategoryId } = action.payload || {};
            
            if (!categoryId) {
                // If no categoryId provided, clear all categories
                state.selectedCategories = [];
            } else if (subcategoryId) {
                // Remove specific subcategory
                state.selectedCategories = state.selectedCategories.filter(
                    cat => !(cat.categoryId === categoryId && cat.subcategoryId === subcategoryId)
                );
            } else {
                // Remove entire category
                state.selectedCategories = state.selectedCategories.filter(
                    cat => cat.categoryId !== categoryId
                );
            }
            state.pageNumber = 1;
        },
        toggleCategoryTag(state, action) {
            const { categoryId, tagValue } = action.payload;
            const categoryIndex = state.selectedCategories.findIndex(
                cat => cat.categoryId === categoryId
            );
            
            // Category should always exist when toggling tags due to automatic selection
            if (categoryIndex >= 0) {
                const category = state.selectedCategories[categoryIndex];
                const tags = category.tags || [];
                const tagIndex = tags.indexOf(tagValue);
                
                if (tagIndex >= 0) {
                    // Remove the tag
                    tags.splice(tagIndex, 1);
                } else {
                    // Add the tag
                    tags.push(tagValue);
                }
                
                // Always update the tags array (even if empty)
                category.tags = tags;
            }
            // If category doesn't exist, it's an error state - don't create it
            state.pageNumber = 1;
        },
        setSelectedFilters(state, action) {
            state.selectedFilters = action.payload;
            state.pageNumber = 1;
        },
        updateFilter(state, action) {
            const { filterType, value, checked } = action.payload;
            if (!state.selectedFilters) {
                state.selectedFilters = {};
            }
            
            const currentValues = state.selectedFilters[filterType as keyof typeof state.selectedFilters] || [];
            
            if (checked) {
                if (!currentValues.includes(value)) {
                    (state.selectedFilters as any)[filterType] = [...currentValues, value];
                }
            } else {
                (state.selectedFilters as any)[filterType] = currentValues.filter((v: string) => v !== value);
            }
            
            state.pageNumber = 1;
        },
        removeFilter(state, action) {
            const { filterType, value } = action.payload;
            if (state.selectedFilters && (state.selectedFilters as any)[filterType]) {
                (state.selectedFilters as any)[filterType] = (state.selectedFilters as any)[filterType].filter((v: string) => v !== value);
            }
            state.pageNumber = 1;
        },
        clearAllFilters(state) {
            state.selectedFilters = {};
            state.pageNumber = 1;
        },
    }
});

export const { 
    setPageNumber, 
    setPageSize, 
    setSearchTerm, 
    setTypes, 
    setSelectedCategories, 
    addSelectedCategory, 
    removeSelectedCategory, 
    toggleCategoryTag,
    setSelectedFilters,
    updateFilter,
    removeFilter,
    clearAllFilters
} = catalogSlice.actions;