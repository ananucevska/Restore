import {Grid, Typography } from "@mui/material";
import ProductList from "./ProductList";
import { useFetchFiltersQuery, useFetchProductsQuery } from "./catalogApi";
import Filters from "./Filters";
import ActiveTags from "../../app/shared/components/ActiveTags";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import AppPagination from "../../app/shared/components/AppPagination";
import { setPageNumber, toggleCategoryTag, removeSelectedCategory } from "./catalogSlice";

export default function Catalog() {
    const productParams = useAppSelector(state => state.catalog);
    const {data, isLoading} = useFetchProductsQuery(productParams);
    const {data: filtersData, isLoading: filtersLoading} = useFetchFiltersQuery();
    const dispatch = useAppDispatch();

    const handleTagRemove = (categoryId: string, tagValue: string) => {
        if (tagValue === '') {
            // Remove entire category
            dispatch(removeSelectedCategory({ categoryId }));
        } else {
            // Check if it's a subcategory or tag
            const category = productParams.selectedCategories.find(cat => cat.categoryId === categoryId);
            if (category?.subcategoryId === tagValue) {
                // Remove subcategory
                dispatch(removeSelectedCategory({ categoryId, subcategoryId: tagValue }));
            } else {
                // Remove tag
                dispatch(toggleCategoryTag({ categoryId, tagValue }));
            }
        }
    };

    if (isLoading || !data || filtersLoading || !filtersData) return <div>Loading...</div>

    return (
        <Grid container spacing={4}>
            <Grid size={3}>
                <Filters filtersData={filtersData} />
            </Grid>
            <Grid size={9}>
                <ActiveTags 
                    selectedCategories={productParams.selectedCategories}
                    onTagRemove={handleTagRemove}
                />
                {data.items && data.items.length > 0 ? (
                    <>
                        <ProductList products={data.items} />
                        <AppPagination
                            metadata={data.pagination}
                            onPageChange={(page: number) => {
                                dispatch(setPageNumber(page));
                                window.scrollTo({top: 0, behavior: 'smooth'})
                            }}
                        />
                    </>
                ) : (
                    <Typography variant="h5">Моментално нема производи од оваа категорија</Typography>
                )}
            </Grid>
        </Grid>
    )
}