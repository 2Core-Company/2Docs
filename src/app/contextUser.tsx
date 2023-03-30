'use client'
import { createContext, useState } from 'react';
import { DataUser } from '../types/interfaces' 

export const userContext = createContext(null);

export default function Index({ children }) {
    const [dataUser, setDataUser] = useState<DataUser>()
  return (
    <userContext.Provider value={{dataUser, setDataUser}}>
      {children}
    </userContext.Provider>
  );
}