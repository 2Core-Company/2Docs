
export interface ModelService{
    id:string 
    icon:string
    type:string
    description:string
    charge:boolean
    price:string
    qrCodePix:boolean
    keyPix:boolean
    questions:Array<Question>
  }

  export interface Question{
    id:string
    question:string
    type:"multipleChoice" | "text" | "checkBoxes" | "dropdownList" | "fileUpload" | "date"
    required:boolean
    answers:Array<string>
  }