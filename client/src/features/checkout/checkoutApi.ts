﻿import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithErrorHandling} from "../../app/api/baseApi.ts";
import {Basket} from "../../app/models/basket.ts";
import {basketApi} from "../basket/basketApi.ts";

export const checkoutApi = createApi({
    reducerPath: 'checkoutApi',
    baseQuery: baseQueryWithErrorHandling,
    endpoints: (builder) => ({
        createPaymentIntent:builder.mutation<Basket, void>({
            query: () => {
                return {
                    url: 'payments',
                    method: 'POST'
                }
            },
            onQueryStarted: async (_, {dispatch, queryFulfilled}) => {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(
                        basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                            draft.clientSecret = data.clientSecret
                        })
                    )
                } catch (error) {
                    console.log('Payment intent creation failed: ', error)
                }
            }
        })
    })
});

export const {useCreatePaymentIntentMutation} = checkoutApi;