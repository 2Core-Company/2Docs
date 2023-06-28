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
  viewedDate:string
  type:string
  from:string
  message:string
  created_date:string | number | Date
  checked?:boolean
  viewed:boolean
  trash:boolean
  favorite:boolean
  downloaded: boolean
  nameCompany?:string
  type2?:string
}