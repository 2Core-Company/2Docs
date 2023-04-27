  export interface WindowsAction{
    createUser: boolean,
    updateUser: boolean,
  }

  export interface Modal{
    status?:boolean,
    message:string,
    subMessage1?:string,
    subMessage2?:string,
    user?:string
  }

  export interface Enterprise{
    name:string, 
    id:string
  }

  export interface Filter {
    name:boolean,
    size:boolean,
    date:boolean,
    status:boolean
  }