export interface Users{
    id?:string, 
    status?:boolean, 
    checked?:boolean,
    length?: number,
    date?:Date,
    name?: string
}

export interface WindowsAction{
    createUser?: boolean,
    updateUser?: boolean,
    deletUser?: boolean
  }

export interface Modal{
    status?:boolean,
    message?:string,
    subMessage1?:string,
    subMessage2?:string,
    user?:string,
    setModal?:Function, 
    childModal?:Function
  }

  export interface DataUser{
    id?:string,
    name?:string,
    email?:string,
    cnpj?:string,
    phone?:string,
    password?: string,
    company?:string,
    nameImage?:string, 
    image?:string, 
    date?:string, 
    status?:boolean,
    folders?:[]
  }

  export interface UsersFilter{
    id?:string,
    name?:string,
    email?:string,
    cnpj?:string,
    phone?:string,
    password?: string,
    company?:string,
    nameImage?:string, 
    image?:string, 
    date?:Date | any, 
    status?:boolean,
    checked?:boolean
  }

  export interface Files{
    name?:string,
    id_file?:string
    checked?:boolean
    id_user?:string
    folder?:string
    type?:string
    trash?:boolean
    date?:Date,
    size?:string
    url?:string
    viwed?:boolean
    from?:string,
    urlDownload?:string
  }

  export interface Folders{
    name:string, 
    color:string
  }

  export interface CommonQuestions{
    id?:string,
    contact:Array<string>,
    question:Array<{response:string, question:string}>
  }

  export interface Filter {
    name:boolean,
    size:boolean,
    date:boolean,
    status:boolean
  }