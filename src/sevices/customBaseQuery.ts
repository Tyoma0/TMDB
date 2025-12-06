import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: "https://api.themoviedb.org/3/"
});

// ✅ ГЛОБАЛЬНЫЙ перехват ошибок
export const customBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    // Сетевая ошибка (интернет выключен)
    if (result.error?.status === "FETCH_ERROR") {
        toast.error("Network error. Check your internet connection.");
    }

    // Невалидный токен
    if (result.error?.status === 401) {
        toast.error("Invalid API key.");
    }

    // Ошибка 404
    if (result.error?.status === 404) {
        toast.error("Not found. Incorrect API request (404)");
    }

    return result;
};
