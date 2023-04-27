'use client'
import { createContext, useState } from 'react';

export const loadingContext = createContext<{loading:boolean, setLoading:Function}>({loading:false, setLoading: (loading) => {}});

export default function Index({ children }) {
    const [loading, setLoading] = useState<boolean>(false)
  return (
    <loadingContext.Provider value={{loading, setLoading}}>
      {children}
    </loadingContext.Provider>
  );
}