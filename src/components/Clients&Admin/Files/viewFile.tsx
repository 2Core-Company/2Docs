import React, { useEffect, useState } from 'react'
import { db, storage } from '../../../../firebase'
import { doc, getDoc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/files'
import { getDownloadURL, ref } from 'firebase/storage';
import { Folders } from '../../../types/folders';
import { GetFolders } from '../../../Utils/Firebase/Folders/getFolders';

  interface Props{
    id_folder:string
    file:Files
    files:Files[],
    from:string,
    setViwedFile:Function,
    childToParentDownload:Function
  }

function ViewFile({id_folder, file, files, from, setViwedFile, childToParentDownload}:Props) {
  const[url, setUrl] = useState('')
  useEffect(() => {
    UpdateFireStore()
    GetUrlViwed()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  async function GetUrlViwed(){
    setUrl(await getDownloadURL(ref(storage, file.path)))
  }

  async function UpdateFireStore(){
    const folders = await GetFolders({id_company:file.id_company, id_enterprise:file.id_enterprise, id_user:file.id_user})
    let folder:Folders = folders.find((folder) => folder.id === id_folder)
    let folderCliente = folders.find((folder) => folder.name === "Cliente")

    try{
      let viewedDate = new Date().toString();

      if(from === "user" && file.id_folder != folderCliente.id && file.viewedDate === null){
        updateDoc(doc(db, 'files', file.id_company, file.id_user, 'user', 'files', file.id), {
          viewed: true,
          viewedDate: viewedDate
        })
        const index = files.findIndex((data) => data.id == file.id)

        files[index].viewedDate = viewedDate;
      } else if(from === "admin" && file.id_folder == folderCliente.id && file.viewedDate === null){
          updateDoc(doc(db, 'files', file.id_company, file.id_user, 'user', 'files', file.id), {
          viewed: true,
          viewedDate: viewedDate
        })

        const index = files.findIndex((data) => data.id == file.id)
        files[index].viewedDate = viewedDate;
      }
      childToParentDownload(files)
    } catch(e) {
      console.log(e)
      toast.error("Não foi possível visualizar este arquivo.")
    }
  }

  if(url != ''){
    return (
      <div className='h-screen w-screen fixed bg-black/30 z-50 top-0 left-0 backdrop-blur-sm flex items-center justify-center'>
        <div className='bg-primary dark:bg-dprimary flex flex-col min-h-[90%] h-full w-[60%] max-sm:w-full px-[5px]'>
          <div onClick={() => setViwedFile(false)} className={`self-end cursor-pointer mt-[20px] w-[30px] h-[2px] bg-black dark:bg-white rotate-45 
          after:w-[30px] after:h-[2px] after:absolute after:bg-black dark:after:bg-white after:rotate-90`}/>
          <object className='w-full h-[90%] mt-[20px]' data={`${url}#toolbar=0`} type="application/pdf">
            <p className='text-[20px] text-center text-black dark:text-white z-50 fixed'>Não foi possível exibir este arquivo.</p>  
          </object>
        </div>  
      </div>
    )
  } else {
    return <></>
  }
}

export default ViewFile