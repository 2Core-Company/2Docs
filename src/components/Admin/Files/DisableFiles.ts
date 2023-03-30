'use client'
import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify'; 
import { Files } from '../../../types/interfaces'

interface Props{
  files:Files[]
  selectFiles:Files[]
  childToParentDelet:Function
}

async function DisableFiles({files, selectFiles, childToParentDelet}:Props) {
  const allFiles = [...files]
  try{
    for await (const file of selectFiles){
      updateDoc(doc(db, 'files', file.id_company, "documents", file.id_file), {
        trash: true
      })
      const index:number = allFiles.findIndex(file => file.id_file === file.id_file)
      allFiles.splice(index, 1);
    } 
    childToParentDelet(allFiles)
  }catch(e){
    console.log(e)
    toast.error("Não Foi possivel excluir este arquivo.")
  }
}

export default DisableFiles