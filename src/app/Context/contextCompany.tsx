'use client'
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { DataCompanyContext } from '../../types/dataCompany';

export const companyContext = createContext<{
  dataCompany:DataCompanyContext, 
  setDataCompany:Dispatch<SetStateAction<DataCompanyContext>>
}>
({dataCompany:{
  id:'',
  name:'',
  contact:[], 
  questions:[], 
  maxSize:0,
  domain:''}, setDataCompany:(dataCompany) => {}});

export default function Index({ children }) {
    const [dataCompany, setDataCompany] = useState<DataCompanyContext>({id:'', name:'', contact:[], questions:[], maxSize:0, domain:''})
  return (
    <companyContext.Provider value={{dataCompany, setDataCompany}}>
      {children}
    </companyContext.Provider>
  );
}