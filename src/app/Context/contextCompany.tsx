'use client'
import { createContext, useState } from 'react';
import { DataCompanyContext } from '../../types/dataCompany';

export const companyContext = createContext<{dataCompany:DataCompanyContext, setDataCompany:Function}>({dataCompany:{
  contact:[], 
  questions:[], 
  gbFiles:{type:"", 
  size:0, 
  porcentage:0
}, 
plan:{maxSize:0}}, setDataCompany:(dataCompany) => {}});

export default function Index({ children }) {
    const [dataCompany, setDataCompany] = useState<DataCompanyContext>({contact:[], questions:[], gbFiles:{type:"", size:0, porcentage:0}, plan:{maxSize:0}})
  return (
    <companyContext.Provider value={{dataCompany, setDataCompany}}>
      {children}
    </companyContext.Provider>
  );
}