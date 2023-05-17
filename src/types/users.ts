import { Enterprise } from "./others"


export interface DataUserContext{
    id:string 
    cnpj:string 
    created_date?:string 
    email:string 
    id_company:string 
    name:string 
    nameImage?:string 
    password:string     
    permission:number
    phone:string 
    photo_url?:string 
    status?:boolean
    fixed?:boolean
    enterprises?:Enterprise[]
    checked?:boolean
  }

  export interface DataUser{
    id:string 
    cnpj?:string 
    created_date?:string 
    email:string 
    id_company:string 
    name:string 
    nameImage?:string 
    password:string     
    permission:number
    phone?:string 
    photo_url:string 
    status?:boolean
    fixed?:boolean
    enterprises:Enterprise[]
    checked?:boolean
  }