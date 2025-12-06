
import { useSelector } from 'react-redux';
import type {RootState} from "../app/store.ts";

export const useGlobalLoading = () => {
    return useSelector((state: RootState) => {
        // Получаем все активные запросы из RTK Query API
        const queries = Object.values(state.kinopoiskApi.queries || {});
        const mutations = Object.values(state.kinopoiskApi.mutations || {});

        // Проверяем, есть ли активные запросы (статус 'pending')
        const hasActiveQueries = queries.some(query => query?.status === 'pending');
        const hasActiveMutations = mutations.some(mutation => mutation?.status === 'pending');

        return hasActiveQueries || hasActiveMutations;
    });
};