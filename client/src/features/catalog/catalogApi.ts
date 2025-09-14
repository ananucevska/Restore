import {createApi} from "@reduxjs/toolkit/query/react";
import { Product } from "../../app/models/product";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import {ProductParams} from "../../app/models/productParams.ts";
import {filterEmptyValues} from "../../lib/util.ts";
import {Pagination} from "../../app/models/pagination.ts";

export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Product', 'SavedProducts'],
    endpoints: (builder) => ({
        fetchProducts: builder.query<{items: Product[], pagination: Pagination }, ProductParams> ({
            query: (productParams) => {
                return {
                    url: 'products',
                    params: filterEmptyValues(productParams)
                }
            },
            transformResponse: (items: Product[], meta) => {
                const paginationHeader = meta?.response?.headers.get('Pagination');
                const pagination = paginationHeader ? JSON.parse(paginationHeader) : null;
                return {items, pagination}
            },
            providesTags: ['Product']
        }),
        fetchProductDetails: builder.query<Product, number> ({
            query: (productId) => `products/${productId}`,
            providesTags: (_, __, id) => [{ type: 'Product', id }]
        }),
        saveProduct: builder.mutation<void, number>({
            query: (productId) => ({
                url: `products/${productId}/save`,
                method: 'POST'
            }),
            invalidatesTags: (_, __, productId) => [
                { type: 'Product', id: productId },
                'Product',
                'SavedProducts'
            ],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // Manually refetch saved products
                    dispatch(catalogApi.util.invalidateTags(['SavedProducts']));
                } catch (error) {
                    console.error('Error in saveProduct onQueryStarted:', error);
                }
            }
        }),
        unsaveProduct: builder.mutation<void, number>({
            query: (productId) => ({
                url: `products/${productId}/save`,
                method: 'DELETE'
            }),
            invalidatesTags: (_, __, productId) => [
                { type: 'Product', id: productId },
                'Product',
                'SavedProducts'
            ],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // Manually refetch saved products
                    dispatch(catalogApi.util.invalidateTags(['SavedProducts']));
                } catch (error) {
                    console.error('Error in unsaveProduct onQueryStarted:', error);
                }
            }
        }),
        fetchSavedProducts: builder.query<{items: Product[], pagination: Pagination}, ProductParams>({
            query: (productParams) => ({
                url: 'products/saved',
                params: filterEmptyValues(productParams)
            }),
            transformResponse: (items: Product[], meta) => {
                const paginationHeader = meta?.response?.headers.get('Pagination');
                const pagination = paginationHeader ? JSON.parse(paginationHeader) : null;
                return {items, pagination}
            },
            providesTags: ['SavedProducts']
        }),
        fetchFilters: builder.query<{types: string[]}, void> ({
            query: () => 'products/filters'
        })
    })
});

export const { 
    useFetchProductDetailsQuery, 
    useFetchProductsQuery, 
    useFetchFiltersQuery,
    useSaveProductMutation,
    useUnsaveProductMutation,
    useFetchSavedProductsQuery
} = catalogApi;