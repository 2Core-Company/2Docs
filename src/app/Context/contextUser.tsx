'use client'
import { createContext, useState } from 'react';
import { DataUser } from '../../types/users' 

export const userContext = createContext<{dataUser:DataUser, setDataUser:Function}>({dataUser:{
  id:'', 
  cnpj:'',
  created_date:'',
  email:'',
  id_company:'',
  name:'',
  nameImage:'',
  password:'',    
  permission:0,
  phone:'',
  photo_url:'',
  status:false,
  fixed:false,
  enterprises:[],
  checked:false}, setDataUser:(dataUser) => {}});

export default function Index({ children }) {
  const [dataUser, setDataUser] = useState<DataUser>({
    id:'', 
    cnpj:'',
    created_date:'',
    email:'',
    id_company:'',
    name:'',
    nameImage:'',
    password:'',    
    permission:0,
    phone:'',
    photo_url:'',
    status:false,
    fixed:false,
    enterprises:[],
    checked:false})
  return (
    <userContext.Provider value={{dataUser, setDataUser}}>
      {children}
    </userContext.Provider>
  );
}