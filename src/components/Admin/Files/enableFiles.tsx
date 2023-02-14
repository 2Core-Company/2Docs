'use client'
import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify'; 
import { Files, Folders } from '../../../types/interfaces'
import React, { useContext } from 'react'
import AppContext from '../../Clients&Admin/AppContext';

function EnableFiles(props:{selectFiles:Files[], menu:boolean, folders?:Folders[], childToChangeStatus:Function, files:Files[]}) {
    const context = useContext(AppContext)

    function ConfirmationEnableFile(){
      if(props.selectFiles.length > 0){
        toast.promise(EnableFile(),{pending:"Restaurando arquivos.", success:"Arquivos restaurados.", error:"Não foi possivel restaurar os arquivos."})
      } else {
        toast.error("Selecione um arquivo para recuperar.")
      }
    }

    async function EnableFile(){
      const files = props.files
      const selectFiles = props.selectFiles
      const folders = props.folders
      try{
        for(let i = 0; i < selectFiles.length; i++){
          const folderStatus = folders.findIndex(folder => folder.name === selectFiles[i].folder)
          if(folderStatus  == -1){
            folders.push({name: selectFiles[i].folder, color: "#BE0000"})
            updateDoc(doc(db, 'users', selectFiles[i].id_company, "Clientes", selectFiles[i].id_user), {
              folders: folders
            })
          }
          updateDoc(doc(db, 'files', selectFiles[i].id_company, "Arquivos", selectFiles[i].id_file), {
            trash: false
          })
          const index = files.findIndex(file => file.id_file === selectFiles[i].id_file)
          files[index].trash = false
        } 
        props.childToChangeStatus(files)
      }catch(e) {
        console.log(e)
        toast.error("Não Foi possivel recuperar este arquivo.")
      }
    }

    return (
      <button onClick={() => ConfirmationEnableFile()} className={`bg-black cursor-pointer text-white p-[5px] flex justify-center items-center rounded-[8px] text-[17px] max-sm:text-[14px] ${props.menu ? "max-lg:hidden" : ""}`}>
        Recuperar
      </button>
    )
}

export default EnableFiles