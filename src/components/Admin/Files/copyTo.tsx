import React, { useContext, useEffect, useState } from 'react'
import { db, storage } from '../../../../firebase'
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import {ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Files } from '../../../types/files' 
import { Folders } from '../../../types/folders';
import { getFolders } from '@/src/Utils/Firebase/Folders/getFolders';
import { companyContext } from '../../../app/Context/contextCompany';
import { GetSizeCompany } from '../../../Utils/Firebase/Company/GetSizeCompany';
import updateSizeCompany from '../../../Utils/Firebase/Company/UpdateSizeCompany';

interface Props{
  admin: boolean
  copyFile: {status: boolean, file?: Files | undefined}
  setCopyFile: React.Dispatch<React.SetStateAction<{status: boolean, file?: Files | undefined}>>
}

function  CopyTo({admin, copyFile, setCopyFile}: Props) {
  const {dataCompany, setDataCompany} = useContext(companyContext)
  const [folders, setFolders] = useState([])
  const [dataFolder, setDataFolder] = useState({name:'', id:''})
  const [fileCopy, setFileCopy] = useState<any >()
  const messageToast = {pending:"Copiando arquivo.", success:"Arquivo copiado com sucesso para a pasta: " + dataFolder.name}
  const file = copyFile.file!;

  useEffect(() =>{
    VerifyFolders()
    GetFile()
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
      setCopyFile({status: false})
      throw toast.error("Você precisa ter criado no mínimo 2 pastas para conseguir copiar um arquivo.")
    }
  }

  async function GetFile(){
    await getDownloadURL(ref(storage, file.path))
    .then(async (url) => {
      var xhr = new XMLHttpRequest;
      xhr.responseType = 'blob';
      xhr.onload = function () {
        var recoveredBlob = xhr.response;
        setFileCopy(recoveredBlob)
      };
      xhr.open('GET', url);
      xhr.send();
    })
  }

  async function CopyingFileStorage(){
    setCopyFile({status: false})
    try{
      const referencesFile = `${file.id_company}|${Math.floor(1000 + Math.random() * 9000) + file.name}`;
      const docsRef = ref(storage, `${file.id_company}/files/${file.id_user}/${file.id_enterprise}/${dataFolder.id}/${referencesFile}`);
      const upload = await uploadBytes(docsRef, fileCopy)
      await UploadFilestore({path:upload.metadata.fullPath, id:referencesFile, name:file.name})
    }catch(e){
      throw toast.error("Não foi possível copiar o arquivo")
    }
  }

  async function UploadFilestore({path, id, name}){
    const dateNow = new Date().getTime()
    const data: Files = {
      id_user: file.id_user,
      id: id,
      id_company: file.id_company,
      id_enterprise: file.id_enterprise,
      path: path,
      name: name,
      size: file.size,
      created_date: dateNow,
      type: file.type, 
      trash: false,
      id_folder: dataFolder.id,
      from: admin ? 'admin' : 'user',
      favorite: false,
      viewedDate: null,
      id_event: '',
      message: '',
      downloaded: false
    }
    const companySize = await GetSizeCompany({id_company:file.id_company});

    if((companySize + file.size) > dataCompany.maxSize){
      throw toast.error('Limite de armazenamento foi excedido.');
    }

    await updateSizeCompany({id_company:file.id_company, size:file.size, action:'sum'});

    try {
      const docRef = await setDoc(doc(db, "files", file.id_company, file.id_user, 'user', 'files', id), data);
    } catch (e) {
      console.log(e);
      throw toast.error("Não foi possível copiar o arquivo");
    } 
  }

    return (
      folders.length > 3 ?
      <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black z-50 top-[0px] left-0'>
        <div className='bg-primary w-[500px] max-lsm:w-[320px] rounded-[15px] flex flex-col'>
        <div className='bg-[#10B981] w-full h-[16px] rounded-t-[15px]'/>
          <div className=' px-[33px]'>
            <p className='font-[500] text-[26px] mt-[18px] after:bg-[#10B981] after:w-[38px] after:h-[3px] after:block after:rounded-full'>Copiar arquivo</p>
            <p className='text-[18px] mt-[20px] font-[400]'>Selecione a pasta que deseja copiar o arquivo:</p>
            <div className='flex w-full justify-center flex-wrap mx-auto mt-[30px] gap-x-[28px] gap-y-[30px]'>
            {folders?.map((folder:Folders) =>{
              if(folder.name === "Favoritos" || folder.name === "Cliente" || folder.id === file.id_folder || folder.name === 'Lixeira'){
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
            <button type='button' onClick={() => setCopyFile({status: false})} className='cursor-pointer bg-transparent border border-[#686868]/70 py-[10px] px-[23px] rounded-[8px] font-[500] text-[16px] text-[#686868]'>Cancelar</button>
            <button  onClick={() => toast.promise(CopyingFileStorage(), messageToast)} className={`${dataFolder.id !== '' ? "bg-[#10B981]/30 border-[#10B981] cursor-pointer" : "bg-strong/30 border-strong disabled cursor-not-allowed text-[#686868]" } border py-[10px] px-[28px] rounded-[8px] font-[500] text-[16px] text-[#117856]`}>Copiar</button>
          </div>
        </div>
      </div>
      : <></>
    )
}

export default CopyTo