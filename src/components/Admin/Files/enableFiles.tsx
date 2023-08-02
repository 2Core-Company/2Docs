'use client'
import { db } from '../../../../firebase'
import { doc, updateDoc, writeBatch } from "firebase/firestore";  
import { toast } from 'react-toastify'; 
import { Files } from '../../../types/files'
import React  from 'react'

interface Props{
  selectFiles:Files[], 
  menu:boolean, 
  files:Files[]
  setMenu:Function
  setFiles:Function
}

function EnableFiles({selectFiles, menu, files, setMenu, setFiles}:Props) {

  function ConfirmationEnableFile(){
    if(selectFiles.length > 0){
      toast.promise(EnableFile(),{pending:"Restaurando arquivos.", success:"Arquivos restaurados.", error:"Não foi possível restaurar os arquivos."})
    } else {
      toast.error("Selecione um arquivo para recuperar.")
    }
  }
  
  async function EnableFile(){
    const batch = writeBatch(db);
    try{
      for await (const file of selectFiles){
        const laRef1 = doc(db, "files", file.id_company, file.id_user, 'user', 'files', file.id);
        batch.update(laRef1, {trash: false})
        const index = files.findIndex(file => file.id === file.id)
        files.splice(index,1)
      } 
      await batch.commit();
      setFiles([...files])
      setMenu(false)
    }catch(e) {
      console.log(e)
      toast.error("Não Foi possível recuperar este arquivo.")
    }
  }

  return (
    <button onClick={() => ConfirmationEnableFile()} className={`bg-black cursor-pointer text-white p-[5px] flex justify-center items-center rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>
      Recuperar
    </button>
  )
}

export default EnableFiles