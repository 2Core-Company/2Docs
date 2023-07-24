import React, { useEffect, useState } from 'react'
import { db, storage } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { Files } from '../../../types/files'
import { getDownloadURL, ref } from 'firebase/storage';
import { Cross2Icon } from '@radix-ui/react-icons';

  interface Props{
    file:Files
    setFiles: React.Dispatch<React.SetStateAction<Files[]>>
    setViewFile: React.Dispatch<React.SetStateAction<{status: boolean, file?: Files | undefined}>>
    admin: boolean
  }

function ViewFile({file, setFiles, setViewFile, admin}:Props) {
  const from: 'admin' | 'user' = admin ? 'admin' : 'user'
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
    try{
      let viewedDate = new Date().getTime();

      if(from !== file.from && file.viewedDate === null){
        updateDoc(doc(db, 'files', file.id_company, file.id_user, 'user', 'files', file.id), {
          viewedDate: viewedDate
        })
        
        setFiles((files) => {
          const index = files.findIndex((fileIndex) => fileIndex.id === file.id)
          files[index].viewedDate = viewedDate;
          return files;
        })
      }
    } catch(e) {
      console.log(e)
      toast.error("Não foi possível visualizar este arquivo.")
    }
  }

  if(url != ''){
    return (
      <div className='h-screen w-screen fixed bg-black/30 z-50 top-0 left-0 backdrop-blur-sm flex items-center justify-center'>
        <div className='bg-primary dark:bg-dprimary flex flex-col min-h-[90%] h-full w-[60%] max-sm:w-full px-[5px]'>
          <Cross2Icon width={35} height={35} onClick={() => setViewFile({status: false})} className={`self-end cursor-pointer mt-[5px]`}/>
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