'use client'
import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify'; 
import { Files, Folders } from '../../../types/interfaces'
import React  from 'react'

interface Props{
  selectFiles:Files[], 
  menu:boolean, 
  folders?:Folders[], 
  files:Files[]
  setMenu:Function
  setFiles:Function
}

function EnableFiles({selectFiles, menu, folders, files, setMenu, setFiles}:Props) {

    function ConfirmationEnableFile(){
      if(selectFiles.length > 0){
        toast.promise(EnableFile(),{pending:"Restaurando arquivos.", success:"Arquivos restaurados.", error:"Não foi possivel restaurar os arquivos."})
      } else {
        toast.error("Selecione um arquivo para recuperar.")
      }
    }

    async function EnableFile(){
      try{
        for(let i = 0; i < selectFiles.length; i++){
          const folderStatus = folders.findIndex(folder => folder.name === selectFiles[i].folder)
          if(folderStatus  == -1){
            folders.push({name: selectFiles[i].folder, color: "#BE0000", id_enterprise:selectFiles[i].id_enterprise, isPrivate:false})
            updateDoc(doc(db, 'users', selectFiles[i].id_company, "Clientes", selectFiles[i].id_user), {
              folders: folders
            })
          }
          updateDoc(doc(db, 'files', selectFiles[i].id_company, "Arquivos", selectFiles[i].id_file), {
            trash: false
          })
          const index = files.findIndex(file => file.id_file === selectFiles[i].id_file)
          files.splice(index,1)
        } 
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