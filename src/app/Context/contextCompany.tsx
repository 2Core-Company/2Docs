'use client'
import { createContext, useState } from 'react';

export const companyContext = createContext(null);

export default function Index({ children }) {
    const [dataCompany, setDataCompany] = useState<any>({contact:[], questions:[]})
  return (
    <companyContext.Provider value={{dataCompany, setDataCompany}}>
      {children}
    </companyContext.Provider>
  );
}