import {Box, Paper} from "@mui/material";
import Search from "./Search.tsx";
import HierarchicalMenu from "../../app/shared/components/HierarchicalMenu.tsx";
import OptionalFilters from "../../app/shared/components/OptionalFilters.tsx";
import {useAppDispatch, useAppSelector} from "../../app/store/store.ts";
import {addSelectedCategory, removeSelectedCategory, updateFilter, removeFilter, clearAllFilters} from "./catalogSlice.ts";
import {categoryMenu} from "../../app/data/categories.ts";
import {SelectedCategory, SelectedFilters} from "../../app/models/category.ts";

export default function Filters() {
    const {selectedCategories, selectedFilters} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();

    const handleCategorySelect = (category: SelectedCategory) => {
        dispatch(addSelectedCategory(category));
    };

    const handleCategoryDeselect = (categoryId?: string, subcategoryId?: string) => {
        dispatch(removeSelectedCategory({ categoryId, subcategoryId }));
    };

    const handleFilterChange = (filterType: keyof SelectedFilters, value: string, checked: boolean) => {
        dispatch(updateFilter({ filterType, value, checked }));
    };

    const handleFilterRemove = (filterType: keyof SelectedFilters, value: string) => {
        dispatch(removeFilter({ filterType, value }));
    };

    const handleClearAll = () => {
        dispatch(clearAllFilters());
    };

    return (
        <Box display='flex' flexDirection='column' gap={3}>
            <Paper>
                <Search/>
            </Paper>
            <HierarchicalMenu
                categories={categoryMenu.categories}
                selectedCategories={selectedCategories}
                onCategorySelect={handleCategorySelect}
                onCategoryDeselect={handleCategoryDeselect}
            />
            {categoryMenu.filters && (
                <OptionalFilters
                    filters={categoryMenu.filters}
                    selectedFilters={selectedFilters || {}}
                    onFilterChange={handleFilterChange}
                    onFilterRemove={handleFilterRemove}
                    onClearAll={handleClearAll}
                />
            )}
        </Box>
    )
}