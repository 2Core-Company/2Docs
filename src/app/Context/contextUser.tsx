'use client'
import { createContext, useState } from 'react';
import { DataUser } from '../../types/users' 

export const userContext = createContext<{dataUser:DataUser, setDataUser:Function}>({dataUser:{
  id:'', 
  created_date:'',
  email:'',
  id_company:'',
  name:'',
  nameImage:'', 
  verifiedEmail:true,     
  permission:0,
  phone:'',
  photo_url:'',
  status:false,
  fixed:false,
  enterprises:[],
  checked:false,
  admins:[]}, setDataUser:(dataUser) => {}});

export default function Index({ children }) {
  const [dataUser, setDataUser] = useState<DataUser>({
    id:'', 
    created_date:'',
    email:'',
    id_company:'',
    name:'',
    nameImage:'',
    verifiedEmail:true,   
    permission:0,
    phone:'',
    photo_url:'',
    status:false,
    fixed:false,
    enterprises:[],
    checked:false,
    admins:[]})
  return (
    <userContext.Provider value={{dataUser, setDataUser}}>
      {children}
    </userContext.Provider>
  );
}
