export interface Files{
    id_file:string
    id_user:string
    folder:string
    trash:boolean
    size:number
    id_company:string
    favorite:boolean
    id_enterprise:string
    name:string
    url:string
    viewedDate:string
    type:string
    created_date:string
    id_event?:string
    checked?:boolean
    viwed?:boolean
    from?:string
    urlDownload?:string
    message?:string
    nameCompany?:string
    downloaded?: boolean
  }

  export interface OptionsFiles{
    url?:string,
    viwed?:boolean
    downlowed?: boolean
  }