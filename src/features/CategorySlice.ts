// store/slices/categorySlice.ts
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

export type Category = "popular" | "top_rated" | "upcoming" | "now_playing";

interface CategoryState {
    category: Category;
    page: number;
}

const initialState: CategoryState = {
    category: "popular",
    page: 1,
};

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategory: (state, action: PayloadAction<Category>) => {
            state.category = action.payload;
            state.page = 1; // при смене категории сбрасываем на 1
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        resetCategory: (state) => {
            state.category = "popular";
            state.page = 1;
        },
    },
});

export const { setCategory, setPage, resetCategory } = categorySlice.actions;
export default categorySlice.reducer;
