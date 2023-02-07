import React, { useEffect } from 'react'
import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/interfaces'

  function ViewFile(props:{setViwedFile:Function, viwedFile:any, files:Files[], from:string, childToParentDownload:Function }) {
    useEffect(() => {
      const file = props.viwedFile.file
      const files =  props.files
      try{
        if(props.from === "user" && file.folder != "Cliente"){
          updateDoc(doc(db, 'files', file.id_company, "Arquivos", file.id_file), {
            viwed: true
          })
          const index = files.findIndex(file => file.id_file == file.id_file)
          files[index].viwed = true
        } else if(props.from === "admin" && file.folder == "Cliente"){
            updateDoc(doc(db, 'files', file.id_company, "Arquivos", file.id_file), {
            viwed: true
          })
          const index = files.findIndex(file => file.id_file == file.id_file)
          files[index].viwed = true
        }
        props.childToParentDownload(files)
      } catch(e) {
        console.log(e)
        toast.error("Não foi possivél visualizar este arquivo.")
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

  return (
    <div className='h-screen w-screen fixed bg-black/30 z-50 top-0 left-0 backdrop-blur-sm flex items-center justify-center'>
      <div className='bg-primary flex flex-col min-h-[90%] h-full w-[40%] max-sm:w-full px-[5px]'>
        <div onClick={() => props.setViwedFile({...props.viwedFile, viwed: false, url:""})} className={`self-end cursor-pointer mt-[20px] w-[35px] max-lsm:w-[30px]  h-[3px] bg-black rotate-45 
        after:w-[35px] after:max-lsm:w-[30px] after:h-[3px] after:absolute after:bg-black after:rotate-90`}/>
        <object className='w-full h-[90%] mt-[20px]' data={props.viwedFile.url}>
          <p className='text-[20px] text-center text-black z-50 fixed'>Não foi possivel exibir este arquivo.</p>  
        </object>
      </div>  
    </div>
  )
}

export default ViewFile