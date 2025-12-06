import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CurrentQueryState {
    query: string;
    page: number;
}

const initialState: CurrentQueryState = {
    query: "",
    page: 1,
};

export const currentQuerySlice = createSlice({
    name: "currentQuery",
    initialState,
    reducers: {
        // Устанавливаем новый поисковый запрос
        // При этом сбрасываем страницу на 1
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
            state.page = 1;
        },

        // Изменяем текущую страницу (например, при пагинации)
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },

        // Полный сброс состояния поиска
        resetQuery: (state) => {
            state.query = "";
            state.page = 1;
        },
    },
});

// Action creators
export const { setQuery, setPage, resetQuery } = currentQuerySlice.actions;

// Reducer по умолчанию
export default currentQuerySlice.reducer;
