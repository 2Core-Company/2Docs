import React, { useEffect, useState} from 'react'
import { db, storage } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { Files } from '../../../types/files'
import { Folders } from '../../../types/folders';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getFolders } from '@/src/Utils/Firebase/Folders/getFolders';

interface Props{
  files:Files[]
  moveFile: {status: boolean, file?: Files | undefined}
  setMoveFile: React.Dispatch<React.SetStateAction<{status: boolean, file?: Files | undefined}>>
  setFiles: React.Dispatch<React.SetStateAction<Files[]>>
}

function MoveTo({files, moveFile, setMoveFile, setFiles}:Props) {
  const file = moveFile.file!;

  const [folders, setFolders] = useState([])
  const [dataFolder, setDataFolder] = useState({name:'', id:''})
  const messageToast = {pending:"Movendo o arquivo.", success:"Arquivo movido com sucesso.", error:`Não foi possível mover o arquivo: ${file.name}`}
  
  useEffect(() =>{
    VerifyFolders()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  async function VerifyFolders(){
    const id_company = file.id_company
    const id_user = file.id_user
    const id_enterprise = file.id_enterprise
    const foldersHere = await getFolders({id_company, id_user, id_enterprise})

    if(foldersHere.length > 4){
      setFolders(foldersHere)
    } else {
      setMoveFile({status: false})
      throw toast.error("Você precisa ter criado no mínimo 2 pastas para conseguir mover um arquivo.")
    }
  }

  async function GetFile(){
    const url = await getDownloadURL(ref(storage, file.path))
    await handleRequest(url)
  }

  function makeAsyncRequest(url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      
      xhr.onload = function () {
        var recoveredBlob = xhr.response;
        resolve(recoveredBlob);
      };
      
      xhr.onerror = function () {
        reject(new Error('Erro na requisição'));
      };
      
      xhr.open('GET', url);
      xhr.send();
    });
  }
  
  async function handleRequest(url) {
    try {
      var recoveredBlob = await makeAsyncRequest(url);
      await CopyngFileStorage(recoveredBlob);
      console.log('Processo concluído');
    } catch (error) {
      console.error('Erro:', error);
    }
  }
  
  async function CopyngFileStorage(blob){
    try{
      const docsRef = ref(storage, `${file.id_company}/files/${file.id_user}/${file.id_enterprise}/${dataFolder.id}/${file.id}`);
      const docsRef2 = ref(storage, `${file.id_company}/files/${file.id_user}/${file.id_enterprise}/${file.id_folder}/${file.id}`);
      const [promise1, promise2] = await Promise.all([
        deleteObject(docsRef2),
        uploadBytes(docsRef, blob)
      ])
      const path = promise2.metadata.fullPath
      await ChangeFolder({path})
    }catch(e){
      throw toast.error("Não foi possível copiar o arquivo")
    }
  }

  async function ChangeFolder({path}:{path:string}){
    try{
      if(dataFolder.id !== '' && dataFolder.name !== '') {
        await updateDoc(doc(db, 'files', file.id_company, file.id_user, 'user', 'files', file.id), {
          id_folder: dataFolder.id,
          path:path
        })
  
        setFiles((files) => {
          const index = files.findIndex((fileIndex) => fileIndex.id === file.id);
          if(index !== -1) {
            files.splice(index, 1);
          }
          return files;
        })
      } else {
        throw Error;
      }

      setMoveFile({status: false})
    } catch(e) {
      console.log(e)
    }
  }

 
  return (
    folders.length > 3 ?
    <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black z-50 top-[0px] left-0'>
      <div className='bg-primary w-[500px] max-lsm:w-[320px] rounded-[15px] flex flex-col'>
        <div className='bg-[#10B981] w-full h-[16px] rounded-t-[15px]'/>
          <div className='px-[33px]'>
            <p className='font-[500] text-[26px] mt-[18px] after:bg-[#10B981] after:w-[38px] after:h-[3px] after:block after:rounded-full'>Mover arquivo</p>
            <p className='text-[18px] mt-[20px] font-[400]'>Selecione a pasta que deseja mover o arquivo:</p>
            <div className='flex w-full justify-center flex-wrap mx-auto mt-[30px] gap-x-[28px] gap-y-[30px]'>
            {folders?.map((folder:Folders) => {
                if(folder.name === "Favoritos" || folder.name === "Cliente" || folder.id === file.id_folder || folder.name === "Lixeira"){
                  return
                }
                return (
                  <div onClick={() => dataFolder.id === folder.id ? setDataFolder({name:'', id:''}) : setDataFolder({name:folder.name, id:folder.id})} key={folder.id} className={`${folder.id === dataFolder.id && "bg-[#10B981]/10"} cursor-pointer group w-[110px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] p-[10px] rounded-[8px] hover:scale-105 hover:shadow-[#dadada] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.9)]`}>
                    <div className='relative w-[80px] h-[80px] max-lg:h-[70px] max-lg:w-[70px] max-sm:h-[60px] max-sm:w-[60px] max-lsm:h-[50px] max-lsm:w-[50px]'>
                      <svg width="100%" height="100%" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M77.537 15.361H34.4308L29.0135 7.23427C28.7414 6.82757 28.2849 6.58325 27.7963 6.58325H1.46296C0.655407 6.58325 0 7.2372 0 8.04621V16.824V22.6758V65.1062C0 69.1381 3.27704 72.4166 7.30604 72.4166H71.694C75.723 72.4166 79 69.1381 79 65.1062V22.6758V16.824C79 16.015 78.3446 15.361 77.537 15.361ZM76.0741 21.2129H2.92593V18.287H33.6481H76.0741V21.2129ZM2.92593 9.50918H27.0136L30.9153 15.361H2.92593V9.50918ZM76.0741 65.1062C76.0741 67.523 74.1093 69.4907 71.694 69.4907H7.30604C4.89069 69.4907 2.92593 67.523 2.92593 65.1062V24.1388H76.0741V65.1062Z" fill={folder.color}/>
                      </svg>
                    </div>
                    <p className='text-[16px] max-md:text-[14px] max-sm:text-[12px] w-[90%] overflow-hidden whitespace-nowrap text-ellipsis'>{folder.name === "Cliente" ? "Meus" : folder.name}</p>
                  </div>
                )
              })}
            </div>
          </div>
          <div className='flex w-full justify-between bg-[#D9D9D9] border-t border-t-[#AAAAAA] py-[14px] px-[33px] rounded-b-[15px] mt-[25px]'>
            <button onClick={() => setMoveFile({status: false})} className='cursor-pointer bg-transparent border border-[#686868]/70 py-[10px] px-[23px] rounded-[8px] font-[500] text-[16px] text-[#686868]'>Fechar</button>
            <button onClick={() => toast.promise(GetFile(), messageToast)} className={`${dataFolder.id !== '' ? "bg-[#10B981]/30 border-[#10B981] cursor-pointer" : "bg-strong/30 border-strong disabled cursor-not-allowed text-[#686868]" } border py-[10px] px-[30px] rounded-[8px] font-[500] text-[16px] text-[#117856]`}>Mover</button>
          </div>
      </div>
    </div>
    : <></>
  )
}

export default MoveTo