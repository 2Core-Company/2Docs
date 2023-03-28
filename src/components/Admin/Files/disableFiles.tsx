'use client'
import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify'; 
import { Files } from '../../../types/interfaces'

interface Props{
  files:Files[], 
  selectFiles:Files[], 
  setFiles:Function
}

async function DisableFiles({files, selectFiles, setFiles}:Props) {
  try{
    for await (const file of selectFiles){
      updateDoc(doc(db, 'files', file.id_company, "documents", file.id_file), {
        trash: true
      })
      const index:number = files.findIndex(file => file.id_file === file.id_file)
      files.splice(index, 1);
    } 
    setFiles(files)
  }catch(e){
    console.log(e)
    toast.error("Não Foi possivel excluir este arquivo.")
  }
}

export default DisableFiles