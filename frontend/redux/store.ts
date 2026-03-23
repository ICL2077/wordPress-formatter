import { configureStore } from '@reduxjs/toolkit';
import { scriptApi } from './scriptApi';

export const store = configureStore({
    reducer: {
        [scriptApi.reducerPath]: scriptApi.reducer,
    },
    middleware: (getDefMiddleware) => getDefMiddleware().concat(scriptApi.middleware),
});
