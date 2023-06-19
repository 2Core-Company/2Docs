'use client'
import { useContext, createContext, useState, useEffect} from "react";

const ThemeContext = createContext<string>("light");

export default function ThemeContextProvider({children}) { 
    const [theme, setTheme] = useState<string>(
        typeof window != "undefined" ?
            localStorage.theme != undefined ? localStorage.theme :
            "light" 
        :
        "light"
    );

    useEffect(() => {
        const root = window.document.documentElement;
        const removeOldTheme = theme === "dark" ? "light" : "dark";

        root.classList.add(theme);
        root.classList.remove(removeOldTheme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        // @ts-ignore (value on provider can be any value)
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext);    
}