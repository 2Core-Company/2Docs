import React, { useEffect } from 'react'
import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/interfaces'

  interface Props{
    file:Files
    viwedFile:{viwed:boolean, url:string},
    files:Files[],
    from:string,
    setViwedFile:Function,
    childToParentDownload:Function
  }

  function ViewFile({file, viwedFile, files, from, setViwedFile, childToParentDownload}:Props) {
    useEffect(() => {
      try{
        if(from === "user" && file.folder != "Cliente"){
          updateDoc(doc(db, 'files', file.id_company, "documents", file.id_file), {
            viwed: true
          })
          const index = files.findIndex(file => file.id_file == file.id_file)
          files[index].viwed = true
        } else if(from === "admin" && file.folder == "Cliente"){
            updateDoc(doc(db, 'files', file.id_company, "documents", file.id_file), {
            viwed: true
          })
          const index = files.findIndex(file => file.id_file == file.id_file)
          files[index].viwed = true
        }
        childToParentDownload(files)
      } catch(e) {
        console.log(e)
        toast.error("Não foi possível visualizar este arquivo.")
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

  return (
    <div className='h-screen w-screen fixed bg-black/30 z-50 top-0 left-0 backdrop-blur-sm flex items-center justify-center'>
      <div className='bg-primary dark:bg-dprimary flex flex-col min-h-[90%] h-full w-[40%] max-sm:w-full px-[5px]'>
        <div onClick={() => setViwedFile({...viwedFile, viwed: false, url:""})} className={`self-end cursor-pointer mt-[20px] w-[30px] h-[3px] bg-black dark:bg-white rotate-45 
        after:w-[30px] after:h-[3px] after:absolute after:bg-black dark:after:bg-white after:rotate-90`}/>
        <object className='w-full h-[90%] mt-[20px]' data={viwedFile.url}>
          <p className='text-[20px] text-center text-black dark:text-white z-50 fixed'>Não foi possível exibir este arquivo.</p>  
        </object>
      </div>  
    </div>
  )
}

export default ViewFile