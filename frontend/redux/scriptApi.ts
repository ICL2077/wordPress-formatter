import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const scriptApi = createApi({
    reducerPath: 'scriptApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/tools/doc-to-blocks/`,
    }),
    endpoints: (build) => ({
        postFile: build.mutation({
            query: (body) => ({
                url: '',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { usePostFileMutation } = scriptApi;
