'use client'
import { createContext, useState, useEffect, Dispatch, SetStateAction} from "react";

export const themeContext = createContext<{theme: "light" | "dark", setTheme: Dispatch<SetStateAction<"light" | "dark">>}>({theme: "light", setTheme: () => {}});

export default function ThemeContextProvider({children}) { 
    const [theme, setTheme] = useState<"light" | "dark">(
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
        
        <themeContext.Provider value={{theme, setTheme}}>
            {children}
        </themeContext.Provider>
    )
}