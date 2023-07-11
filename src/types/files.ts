export interface Files{
  id:string
  id_user:string
  id_company:string
  id_enterprise:string
  id_event:string
  id_folder:string
  size:number
  name:string
  path:string
  viewedDate:string | null
  type:string
  from:string
  message:string
  created_date:number
  checked?:boolean
  trash:boolean
  favorite:boolean
  downloaded: boolean
  nameCompany?:string
  type2?:string
}