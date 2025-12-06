import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDebouncedVote } from '../features/filterSlice.ts';
import type { AppDispatch, RootState } from '../app/store.ts';

export const useDebouncedFilter = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { vote_gte, vote_lte } = useSelector((state: RootState) => state.filters);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setDebouncedVote({ gte: vote_gte, lte: vote_lte }));
        }, 200);

        return () => clearTimeout(timer);
    }, [vote_gte, vote_lte, dispatch]);
};