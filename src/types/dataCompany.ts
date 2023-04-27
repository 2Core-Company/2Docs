export interface DataCompanyContext{
    id?:string,
    contact:Contact[],
    questions:Question[],
    gbFiles:gbFiles
    plan:Plan
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

export interface Plan {
  maxSize:number
}