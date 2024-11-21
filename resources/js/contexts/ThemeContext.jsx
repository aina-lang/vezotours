import { palette } from "@/constants/palette.ts";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { createContext, useContext, useMemo, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export default function CustomThemeProvider({ children }) {
    // Initialiser l'état à partir de localStorage
    const [paletteName, setPaletteName] = useState(() => {
        return localStorage.getItem("paletteName") || "yellow";
    });
    const [mode, setMode] = useState(() => {
        return localStorage.getItem("mode") || "light";
    });

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...palette[paletteName],
                },
            }),
        [paletteName, mode]
    );

    // Sauvegarder le mode et la palette dans localStorage
    useEffect(() => {
        localStorage.setItem("paletteName", paletteName);
        localStorage.setItem("mode", mode);
    }, [paletteName, mode]);

    const toggleDarkMode = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    const changePalette = (name) => {
        setPaletteName(name);
    };

    return (
        <ThemeContext.Provider
            value={{ toggleDarkMode, changePalette, paletteName, mode }}
        >
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}
