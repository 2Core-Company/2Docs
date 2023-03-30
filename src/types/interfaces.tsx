  export interface Users{
    id?:string, 
    status?:boolean, 
    checked?:boolean,
    length?:number,
    created_date?:Date,
    name?: string
    fixed?: boolean
  }

  export interface WindowsAction{
    createUser: boolean,
    updateUser: boolean,
  }

  export interface Modal{
    status?:boolean,
    message:string,
    subMessage1?:string,
    subMessage2?:string,
    user?:string,
    setModal?:Function, 
    childModal?:Function
  }

  export interface DataUser{
    cnpj?:string 
    created_date?:string 
    email?:string 
    id?:string 
    id_company?:string 
    name?:string 
    nameImage?:string 
    password?:string     
    permission?:number
    folders?: Folders[]
    phone?:string 
    photo_url?:string 
    status?:boolean
    fixed?:boolean
    enterprises?:Enterprise[]
    checked?:boolean
  }

  export interface Enterprise{
    name:string, 
    id:string
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
    photo_url?:string, 
    created_date?:Date | any, 
    status?:boolean,
    checked?:boolean,
    id_company?:string,
    fixed?:boolean
  }

  export interface Files{
    id_event?:string
    name?:string,
    id_file?:string
    checked?:boolean
    id_user?:string
    folder?:string
    type?:string
    trash?:boolean
    created_date?:any,
    size?:number
    url?:string
    viwed?:boolean
    from?:string,
    urlDownload?:string
    id_company?:string
    favorite?:boolean
    message?:string
    id_enterprise?:string
    nameCompany?:string
  }

  export interface Folders{
    name:string, 
    color:string
    id_enterprise:string
    isPrivate:boolean
  }

  export interface DataCompany{
    id?:string,
    contact:Array<string>,
    questions:Array<{response:string, question:string}>
    gbFiles?:{type:string, size:number, porcentage:number}
  }

  export interface Filter {
    name:boolean,
    size:boolean,
    date:boolean,
    status:boolean
  }

  export interface OptionsFiles{
    url?:string,
    viwed?:boolean
    downlowed?: boolean
  }

  export interface Event{
    id:string
    id_user:string
    userName:string
    enterprise:Enterprise
    title:string
    observation:string
    complete:boolean
    dateSelected:string
    viwed:boolean
  }