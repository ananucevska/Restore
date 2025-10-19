import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithErrorHandling} from "../../app/api/baseApi.ts";
import {Product} from "../../app/models/product.ts";
import {ProductParams} from "../../app/models/productParams.ts";
import {Pagination} from "../../app/models/pagination.ts";
import {filterEmptyValues} from "../../lib/util.ts";

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Product', 'MyProducts'],
    endpoints: (builder) => ({
        getMyProducts: builder.query<{items: Product[], pagination: Pagination}, ProductParams>({
            query: (productParams) => ({
                url: 'products/my-products',
                params: filterEmptyValues(productParams)
            }),
            transformResponse: (items: Product[], meta) => {
                const paginationHeader = meta?.response?.headers.get('Pagination');
                const pagination = paginationHeader ? JSON.parse(paginationHeader) : null;
                return {items, pagination}
            },
            providesTags: ['MyProducts']
        }),
        createProduct: builder.mutation<Product, FormData>({
            query: (data: FormData) => {
                return {
                    url: 'products',
                    method: 'POST',
                    body: data
                }
            },
            invalidatesTags: ['Product', 'MyProducts']
        }),
        updateProduct: builder.mutation<void, {id: number, data: FormData}>({
            query: ({id, data}) => {
                data.append('id', id.toString())
                
                return {
                    url: 'products',
                    method: 'PUT',
                    body: data
                }
            },
            invalidatesTags: ['Product', 'MyProducts']
        }),
        deleteProduct: builder.mutation<void, number>({
            query: (id: number) => {
                return {
                    url: `products/${id}`,
                    method: 'DELETE'
                }
            },
            invalidatesTags: ['Product', 'MyProducts']
        })
    })
});

export const {useGetMyProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation} = adminApi;
