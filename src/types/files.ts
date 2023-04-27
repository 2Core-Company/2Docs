export interface Files{
    id_event?:string
    name:string,
    id_file:string
    checked?:boolean
    id_user:string
    folder:string
    type:string
    trash:boolean
    created_date?:any,
    size:number
    url:string
    viwed?:boolean
    viewedDate:string,
    from?:string,
    urlDownload?:string
    id_company:string
    favorite:boolean
    message?:string
    id_enterprise:string
    nameCompany?:string
  }

  export interface OptionsFiles{
    url?:string,
    viwed?:boolean
    downlowed?: boolean
  }