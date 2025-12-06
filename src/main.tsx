
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Provider} from "react-redux";
import {store} from "./app/store.ts";
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";

createRoot(document.getElementById('root')!).render(

    <Provider store={store}>
        <BrowserRouter>
            <App />
            <ToastContainer position="top-right" autoClose={2500} />
        </BrowserRouter>

    </Provider>,

)
