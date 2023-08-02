'use client'
import { createContext, useState } from 'react';
import { DataUserContext } from '../../types/users' 

export const adminContext = createContext<{dataAdmin:DataUserContext, setDataAdmin:Function}>({dataAdmin:{
  id:'', 
  email:'',
  id_company:'',
  name:'',
  nameImage:'',  
  verifiedEmail:true, 
  photo_url:'', 
  disabled:true, 
  fixed:true,  
  permission:0,
  phone:'',
  pendencies:0}, setDataAdmin:(dataAdmin) => {}});

export default function Index({ children }) {
  const [dataAdmin, setDataAdmin] = useState<DataUserContext>({
    id:'', 
    email:'',
    id_company:'',
    name:'',
    nameImage:'',
    verifiedEmail:true, 
    photo_url:'', 
    disabled:true, 
    fixed:true, 
    permission:0,
    phone:'', 
    pendencies:0})
  return (
    <adminContext.Provider value={{dataAdmin, setDataAdmin}}>
      {children}
    </adminContext.Provider>
  );
}
