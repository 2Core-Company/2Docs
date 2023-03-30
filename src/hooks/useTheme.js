'use client'
import { useContext, createContext, useState, useEffect} from "react";

const ThemeContext = createContext();

export default function ThemeContextProvider({children}) {
    const [theme, setTheme] = useState(
        typeof window !== "undefined" ? localStorage.theme : "light"
    );

    useEffect(() => {
        const root = window.document.documentElement;
        const removeOldTheme = theme === "dark" ? "light" : "dark";

        root.classList.add(theme);
        root.classList.remove(removeOldTheme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext);    
}