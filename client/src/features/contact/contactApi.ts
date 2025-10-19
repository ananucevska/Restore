import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { ContactSchema } from "../../lib/schemas/contactSchema";

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: [],
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<void, ContactSchema>({
      query: (contactData) => ({
        url: 'contact',
        method: 'POST',
        body: contactData,
      }),
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApi;
