import { Enterprise } from "./others"


export interface DataUserContext{
  id:string
  created_date?:string
  email:string
  id_company:string
  name:string
  verifiedEmail:boolean
  nameImage?:string
  permission:number
  phone:string
  photo_url:string
  disabled:boolean
  fixed:boolean
  enterprises?:Enterprise[]
  checked?:boolean
  pendencies:number
}

  export interface DataUser{
    id:string
    created_date:number
    email:string
    id_company:string
    name:string
    nameImage?:string
    verifiedEmail:boolean
    permission:number
    phone?:string
    photo_url:string
    disabled?:boolean
    fixed?:boolean
    enterprises:Enterprise[]
    checked?:boolean
    admins:string[]
    pendencies:number
  }