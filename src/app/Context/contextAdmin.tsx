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
  status:true, 
  fixed:true,  
  permission:0,
  phone:''}, setDataAdmin:(dataAdmin) => {}});

export default function Index({ children }) {
  const [dataAdmin, setDataAdmin] = useState<DataUserContext>({
    id:'', 
    email:'',
    id_company:'',
    name:'',
    nameImage:'',
    verifiedEmail:true, 
    photo_url:'', 
    status:true, 
    fixed:true, 
    permission:0,
    phone:''})
  return (
    <adminContext.Provider value={{dataAdmin, setDataAdmin}}>
      {children}
    </adminContext.Provider>
  );
}
