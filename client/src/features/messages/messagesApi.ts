import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import { Conversation, CreateConversation } from "../../app/models/conversation";
import { Message, SendMessage } from "../../app/models/message";

export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Conversation', 'Message'],
    endpoints: (builder) => ({
        fetchConversations: builder.query<Conversation[], void>({
            query: () => 'messages/conversations',
            providesTags: ['Conversation']
        }),
        fetchMessages: builder.query<Message[], number>({
            query: (conversationId) => `messages/conversations/${conversationId}/messages`,
            providesTags: (_, __, conversationId) => [
                { type: 'Message', id: conversationId }
            ]
        }),
        createConversation: builder.mutation<Conversation, CreateConversation>({
            query: (conversation) => ({
                url: 'messages/conversations',
                method: 'POST',
                body: conversation
            }),
            invalidatesTags: ['Conversation']
        }),
        sendMessage: builder.mutation<Message, SendMessage>({
            query: (message) => ({
                url: 'messages/messages',
                method: 'POST',
                body: message
            }),
            invalidatesTags: (_, __, message) => [
                { type: 'Message', id: message.conversationId },
                'Conversation'
            ]
        }),
    })
});

export const {
    useFetchConversationsQuery,
    useFetchMessagesQuery,
    useCreateConversationMutation,
    useSendMessageMutation
} = messagesApi;
