import type {ReactNode} from 'react';

import { Box } from "@mui/material"
import {Header} from "./Header.tsx";
import {Footer} from "./Footer.tsx";

interface LayoutProps {
    children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Box component="main" sx={{ flex: 1 }}>
                {children}
            </Box>
            <Footer />
        </Box>
    )
}