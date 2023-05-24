'use client'
import { db } from '../../../../firebase'
import { doc, writeBatch } from "firebase/firestore";  
import { toast } from 'react-toastify'; 
import { Files } from '../../../types/files'

interface Props{
  files:Files[]
  selectFiles:Files[]
  childToParentDelet:Function
}

async function DisableFiles({files, selectFiles, childToParentDelet}:Props) {
  const allFiles = [...files]
  const batch = writeBatch(db);
  try{
    for await (const file of selectFiles){
      const laRef = doc(db, "files", file.id_company, file.id_user, 'user', 'files', file.id);
      batch.update(laRef, {trash:true})

      const index:number = allFiles.findIndex(file => file.id === file.id)
      file.checked = false
      allFiles.splice(index, 1);
    } 
    await batch.commit();
    childToParentDelet(allFiles)
  }catch(e){
    console.log(e)
    toast.error("Não Foi possivel excluir este arquivo.")
  }
}

export default DisableFiles