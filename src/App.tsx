
import './App.css'
import {CssBaseline, ThemeProvider} from "@mui/material";
import {LinearProgress} from "./components/LinearProgress/LinearProgress.tsx";
import {useSelector} from "react-redux";
import {useGlobalLoading} from "./hooks/useGlobalLoading.ts";
import type {RootState} from "./app/store.ts";
import {darkTheme, lightTheme} from "./common/theme/MiuTheme.ts";
import {Routing} from "./common/routing/Routing.tsx";

const GlobalProgress = () => {
  const isGlobalLoading = useGlobalLoading();

  if (!isGlobalLoading) return null;

  return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999
      }}>
        <LinearProgress height={3} />
      </div>
  );
};


function App() {

  const mode = useSelector((state: RootState) => state.theme.mode);
  return (
      <>
        <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
          <CssBaseline />
          <GlobalProgress />
          <Routing/>
        </ThemeProvider>

      </>
  )
}

export default App
