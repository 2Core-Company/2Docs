'use client'
import { createContext, useState } from 'react';
import { DataUser } from '../../types/users' 

export const userContext = createContext<{dataUser:DataUser, setDataUser:Function}>({dataUser:{
    id:'', 
    created_date:0,
    email:'',
    id_company:'',
    name:'',
    nameImage:'',
    verifiedEmail:true,
    permission:0,
    phone:'',
    photo_url:'',
    fixed:false,
    enterprises:[],
    checked:false,
    admins:[],
    pendencies:0}, setDataUser:(dataUser) => {}});

export default function Index({ children }) {
  const [dataUser, setDataUser] = useState<DataUser>({
    id:'', 
    created_date:0,
    email:'',
    id_company:'',
    name:'',
    nameImage:'',
    verifiedEmail:true,
    permission:0,
    phone:'',
    photo_url:'',
    fixed:false,
    enterprises:[],
    checked:false,
    admins:[],
    pendencies:0})
  return (
    <userContext.Provider value={{dataUser, setDataUser}}>
      {children}
    </userContext.Provider>
  );
}
