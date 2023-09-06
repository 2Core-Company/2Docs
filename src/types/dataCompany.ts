export interface DataCompanyContext{
    id:string,
    name:string
    contact:Contact[],
    questions:Question[],
    maxSize:number
    domain:string
  }

export interface Contact {

}

export interface Question {
  response:string, 
  question:string
}

export interface gbFiles {
  type:string, 
  size:number, 
  porcentage:number
}
