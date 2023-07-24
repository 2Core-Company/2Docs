import { Folders } from "./folders"

  export interface WindowsAction{
    createUser: boolean,
    updateUser: boolean,
  }

  export interface Modal{
    status:boolean
    title:string
    subject:string
    target:string
  }

  export interface Enterprise{
    name:string, 
    id:string
    folders: Folders[]
  }

  export interface Filter {
    name:boolean,
    size:boolean,
    date:boolean,
    status?:boolean
  }