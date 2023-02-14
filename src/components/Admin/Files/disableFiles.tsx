'use client'
import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify'; 
import { Files } from '../../../types/interfaces'

async function DisableFiles(props:{files:Files[], selectFiles:Files[], childToParentDisable:Function}) {
    const files = props.files
    const selectFiles = props.selectFiles
      try{
        for(let i = 0; i < selectFiles.length; i++){
            updateDoc(doc(db, 'files', selectFiles[i].id_company, "Arquivos", selectFiles[i].id_file), {
            trash: true
          })
          const index:number = files.findIndex(file => file.id_file === selectFiles[i].id_file)
          files.splice(index, 1);
        } 
        props.childToParentDisable(files)
      }catch(e) {
        console.log(e)
        toast.error("Não Foi possivel excluir este arquivo.")
      }
}

export default DisableFiles