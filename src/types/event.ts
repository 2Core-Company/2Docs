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
  dateStarted:number
  dateEnd:null | number
  definedDate:boolean
  repeatMonths:boolean
  limitedDelivery:boolean
  lastModify:number | null
  delivered:boolean
  tasks: Array<{title: string, isRequired: boolean}>
}