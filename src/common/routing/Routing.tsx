
import { Route, Routes } from "react-router-dom"
import {PageNotFound} from "../../pages/pageNotFound/PageNotFound.tsx";
import {MainPage} from "../../pages/main/MainPage.tsx";
import {CategoryMovies} from "../../pages/categoryMovies/CategoryMovies.tsx";
import {Favorites} from "../../pages/favorites/Favorites.tsx";
import {FilteredMovies} from "../../pages/filteredMovies/FilteredMovies.tsx";
import {Search} from "../../pages/search/Search.tsx";
import { Layout } from "../../components/layout/Layout.tsx";
import { MovieDetails } from "../../pages/movieDetails/MovieDetails.tsx";


export const Path = {
    Main: '/',
    CategoryMovies:'CategoryMovies',
    FilteredMovies: 'FilteredMovies',
    Search: 'Search',
    Favorites:'Favorites',
    NotFound: '*',
    MovieDetails: '/movie/:id',

} as const




export const Routing = () => (


    <Routes>
        <Route path={Path.Main} element={
            <Layout>
                <MainPage />
            </Layout>
        } />
        <Route path={Path.CategoryMovies} element={
            <Layout>
                <CategoryMovies />
            </Layout>
        } />
        <Route path={Path.FilteredMovies} element={
            <Layout>
                <FilteredMovies />
            </Layout>
        } />
        <Route path={Path.Search} element={
            <Layout>
                <Search />
            </Layout>
        } />
        <Route path={Path.Favorites} element={
            <Layout>
                <Favorites />
            </Layout>
        } />

        <Route path={Path.MovieDetails} element={
            <Layout>
                <MovieDetails />
            </Layout>
        } />

        <Route path={Path.NotFound} element={<PageNotFound />} />
    </Routes>
)
//http://localhost:5178/