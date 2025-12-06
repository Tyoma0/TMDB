import { createSlice,type PayloadAction } from '@reduxjs/toolkit';

export type SortOption =
    | 'popularity.desc' | 'popularity.asc'
    | 'vote_average.desc' | 'vote_average.asc'
    | 'release_date.desc' | 'release_date.asc'
    | 'title.asc' | 'title.desc';

interface FilterState {
    sort_by: SortOption;
    vote_gte: number;
    vote_lte: number;
    genres: number[];
    page: number;
    debouncedVote: {
        gte: number;
        lte: number;
    };
}

const initialState: FilterState = {
    sort_by: 'popularity.desc',
    vote_gte: 0,
    vote_lte: 10,
    genres: [],
    page: 1,
    debouncedVote: {
        gte: 0,
        lte: 10,
    },
};

export const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setSortBy: (state, action: PayloadAction<SortOption>) => {
            state.sort_by = action.payload;
            state.page = 1;
        },
        setVoteRange: (state, action: PayloadAction<{ gte: number; lte: number }>) => {
            state.vote_gte = action.payload.gte;
            state.vote_lte = action.payload.lte;
            state.page = 1;
        },
        setDebouncedVote: (state, action: PayloadAction<{ gte: number; lte: number }>) => {
            state.debouncedVote = action.payload;
        },
        toggleGenre: (state, action: PayloadAction<number>) => {
            const genreId = action.payload;
            const index = state.genres.indexOf(genreId);
            if (index >= 0) {
                state.genres.splice(index, 1);
            } else {
                state.genres.push(genreId);
            }
            state.page = 1;
        },
        removeGenre: (state, action: PayloadAction<number>) => {
            state.genres = state.genres.filter(id => id !== action.payload);
            state.page = 1;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        resetFilters: (state) => {
            state.sort_by = 'popularity.desc';
            state.vote_gte = 0;
            state.vote_lte = 10;
            state.genres = [];
            state.page = 1;
            state.debouncedVote = { gte: 0, lte: 10 };
        },
    },
});

export const {
    setSortBy,
    setVoteRange,
    setDebouncedVote,
    toggleGenre,
    removeGenre,
    setPage,
    resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;