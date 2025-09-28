import {ProductParams} from "../../app/models/productParams.ts";
import {SelectedCategory} from "../../app/models/category.ts";
import {createSlice} from "@reduxjs/toolkit";

const initialState: ProductParams = {
    pageNumber: 1,
    pageSize: 8,
    types: [],
    searchTerm: '',
    orderBy: 'name', // Always alphabetical
    selectedCategories: []
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
            // For single selection, clear all categories when deselecting
            state.selectedCategories = [];
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
        resetParams() {
            return initialState;  
        }
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
    resetParams 
} = catalogSlice.actions;