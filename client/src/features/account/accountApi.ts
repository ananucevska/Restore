import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithErrorHandling} from "../../app/api/baseApi.ts";
import {User} from "../../app/models/user.ts";
import {LoginSchema} from "../../lib/schemas/loginSchema.ts";
import {router} from "../../app/routes/Routes.tsx";
import {toast} from "react-toastify";

export const accountApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['UserInfo'],
    endpoints: (builder) => ({
        login: builder.mutation<void, LoginSchema>({
            query: (creds) => {
                return {
                    url: 'login?useCookies=true',
                    method: 'POST',
                    body: creds
                }
            },
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled;
                    dispatch(accountApi.util.invalidateTags(['UserInfo']))
                } catch(error) {
                    console.log(error);
                }
            }
        }),
        register: builder.mutation<void, object>({
            query: (creds) => {
                return {
                    url: 'account/register',
                    method: 'POST',
                    body: creds
                }
            },
            async onQueryStarted(_, {queryFulfilled}) {
                try {
                    await queryFulfilled;
                    toast.success('Успешна регистрација!')
                    router.navigate('/login')
                } catch (error) {
                    console.log(error)
                    throw error;
                }
            }
        }),
        userInfo: builder.query<User, void> ({
            query: () => 'account/user-info',
            providesTags: ['UserInfo']
        }),
        updateProfile: builder.mutation<void, object>({
            query: (profileData) => {
                return {
                    url: 'account/update-profile',
                    method: 'PUT',
                    body: profileData
                }
            },
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled;
                    dispatch(accountApi.util.invalidateTags(['UserInfo']));
                    toast.success('Профилот е успешно ажуриран!')
                } catch(error) {
                    console.log(error);
                    throw error;
                }
            }
        }),
        logout: builder.mutation({
            query:  () => ({
                url: 'account/logout',
                method: 'POST'
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                await queryFulfilled;
                dispatch(accountApi.util.invalidateTags(['UserInfo']));
                router.navigate('/');
            }
        }),
    })
});

export const {useLoginMutation, useRegisterMutation, useLogoutMutation, 
    useUserInfoQuery, useLazyUserInfoQuery, useUpdateProfileMutation} = accountApi;