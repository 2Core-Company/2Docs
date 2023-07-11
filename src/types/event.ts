export interface Event{
  id:string
  id_user:string
  id_folder:string
  id_enterprise:string
  nameEnterprise:string
  userName:string
  title:string
  description:string
  complete:boolean
  dateStarted:Date | number
  dateEnd:null | Date
  definedDate:boolean
  repeatMonths:boolean
  limitedDelivery:boolean
  lastModify:string | null
  delivered:boolean
}