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
    path:string
    viewedDate:string
    type:string
    created_date:string | number
    id_event:string
    checked?:boolean
    viwed:boolean
    from:string
    message:string
    nameCompany?:string
    downloaded: boolean
    type2?:string
  }

  export interface OptionsFiles{
    url?:string,
    viwed?:boolean
    downlowed?: boolean
  }