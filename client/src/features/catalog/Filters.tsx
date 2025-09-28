import {Box, Button, Paper} from "@mui/material";
import Search from "./Search.tsx";
import HierarchicalMenu from "../../app/shared/components/HierarchicalMenu.tsx";
import {useAppDispatch, useAppSelector} from "../../app/store/store.ts";
import {resetParams, addSelectedCategory, removeSelectedCategory} from "./catalogSlice.ts";
import {categoryMenu} from "../../app/data/categories.ts";
import {SelectedCategory} from "../../app/models/category.ts";

type Props = {
    filtersData: {types: string[];}
}

export default function Filters({filtersData: data}: Props) {
    const {selectedCategories} = useAppSelector(state => state.catalog);
    const dispatch = useAppDispatch();

    const handleCategorySelect = (category: SelectedCategory) => {
        dispatch(addSelectedCategory(category));
    };

    const handleCategoryDeselect = (categoryId: string, subcategoryId?: string) => {
        dispatch(removeSelectedCategory({ categoryId, subcategoryId }));
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
              <Button onClick={()=> dispatch(resetParams())}>
                  Reset Filters
              </Button>
          </Box>
      )
}