import { Enterprise } from "./others"

export interface Event{
    id:string
    id_user:string
    userName:string
    enterprise:Enterprise
    title:string
    observation:string
    complete:boolean
    dateSelected:string
    viewed:boolean
  }