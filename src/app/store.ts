import { configureStore } from '@reduxjs/toolkit'
import currentQueryReduser from "../features/currentQuerySlice.ts";
import categoryReducer from "../features/CategorySlice.ts";
import themeReducer from "../features/themeSlice.ts";
import  filterReducer from "../features/filterSlice.ts";
import {KinopoiskApi} from "../sevices/KinopoiskApi.ts";
export const store = configureStore({
    reducer: {
        [KinopoiskApi.reducerPath]: KinopoiskApi.reducer,
        currentQuery:currentQueryReduser,
        category: categoryReducer,
        theme: themeReducer,
        filters: filterReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(KinopoiskApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch