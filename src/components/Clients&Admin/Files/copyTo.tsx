import React, { useLayoutEffect, useState, useContext } from 'react'
import { db, storage } from '../../../../firebase'
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Files } from '../../../types/interfaces'
import { toast } from 'react-toastify';
import {ref, getDownloadURL, uploadBytes } from "firebase/storage";




interface Props{
    file:Files
    setCopyTo:Function
}

function  CopyTo(props: Props) {
    const [folders, setFolders] = useState([])
    const [folderName, setFolderName] = useState(undefined)
    const [file, setFile] = useState()
    const messageToast = {pending:"Copiando arquivo.", success:"Arquivo copiado com sucesso para a pasta: " + folderName, error:"Não foi possivel copiar o arquivo"}
    const toastId = "copyTo"

    useLayoutEffect(() =>{
        GetFolders()
        GetFile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    async function GetFolders(){
        const docRef = doc(db, "users", props.file.id_company, "Clientes", props.file.id_user);
        const docSnap = await getDoc(docRef);
        if(docSnap.data().folders.length > 3){
          setFolders(docSnap.data().folders)
        } else {
          toast.error("Você precisa ter no minimo 2 pastas para conseguir copiar um arquivo.", {toastId:toastId})
          props.setCopyTo(false)
        }
    }

    async function GetFile(){
        var xhr = new XMLHttpRequest;
        xhr.responseType = 'blob';
        xhr.onload = function () {
            var recoveredBlob = xhr.response;
            setFile(recoveredBlob)
        };
        xhr.open('GET', props.file.url);
        xhr.send();
    }

    async function CopyngFileStorage(){
      props.setCopyTo(false)
      const referencesFile = Math.floor(1000 + Math.random() * 9000) + props.file.name;
      const docsRef = ref(storage, props.file.id_company + "/files/" + props.file.id_user + "/" + referencesFile );
      const upload = await uploadBytes(docsRef, file)
      await GetUrlDownload({referencesFile:referencesFile, path:upload.metadata.fullPath})
    }

    async function GetUrlDownload(data){
        const name = props.file.name
        const url = await getDownloadURL(ref(storage, data.path))
        await UploadFilestore({url, nameFile:data.referencesFile, name:name})
    }

    async function UploadFilestore(params){
      let blob = await fetch(params.url).then(r => r.blob());
      var urlDownload = (window.URL ? URL : webkitURL).createObjectURL(blob)
      const size = props.file.size
      const date = new Date() + ""
      try {
        const docRef = await setDoc(doc(db, "files", props.file.id_company, "Arquivos", params.nameFile), {
          id_user: props.file.id_user,
          id_file: params.nameFile,
          id_company: props.file.id_company,
          url: params.url,
          name: params.name,
          size: Math.ceil(size / 1000),
          created_date: date,
          type:props.file.type, 
          trash: false,
          viwed: false,
          folder: folderName,
          from: props.file.from
        });
      } catch (e) {
        console.log(e)
        throw toast.error("Não foi possivel copiar o arquivo")
      } 
    }

    return (
      folders.length > 3 ?
      <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black z-50 top-[0px] left-0'>
        <div className='bg-primary w-[500px] max-lsm:w-[320px] rounded-[4px] flex flex-col'>
          <div  className='bg-greenV w-full h-[15px] rounded-t-[4px]'/>
          <div className=' px-[10px]'>
            <p className='text-[26px] mt-[10px]'>Para qual pasta voce deseja mover este arquivo? </p>
            <div className='flex w-full flex-wrap justify-center gap-[20px]'>
            {folders?.map((folder) =>{
                if(folder.name === "Favoritos" || folder.name === "Cliente" || folder.name === props.file.folder){
                    return
                }
                return (
                  <div onClick={() => folderName === folder.name ? setFolderName(undefined) : setFolderName(folder.name)} key={folder.name} className={`${folder.name === folderName ? "bg-greenV/10" : "" } cursor-pointer group mt-[30px] w-[110px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] p-[10px] rounded-[8px] hover:scale-105 hover:shadow-[#dadada] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.9)]`}>
                    <div className='relative w-[90px] h-[90px] max-lg:h-[70px] max-lg:w-[70px] max-sm:h-[60px] max-sm:w-[60px] max-lsm:h-[50px] max-lsm:w-[50px]'>
                      <svg width="100%" height="100%" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path  d="M77.537 15.361H34.4308L29.0135 7.23427C28.7414 6.82757 28.2849 6.58325 27.7963 6.58325H1.46296C0.655407 6.58325 0 7.2372 0 8.04621V16.824V22.6758V65.1062C0 69.1381 3.27704 72.4166 7.30604 72.4166H71.694C75.723 72.4166 79 69.1381 79 65.1062V22.6758V16.824C79 16.015 78.3446 15.361 77.537 15.361ZM76.0741 21.2129H2.92593V18.287H33.6481H76.0741V21.2129ZM2.92593 9.50918H27.0136L30.9153 15.361H2.92593V9.50918ZM76.0741 65.1062C76.0741 67.523 74.1093 69.4907 71.694 69.4907H7.30604C4.89069 69.4907 2.92593 67.523 2.92593 65.1062V24.1388H76.0741V65.1062Z" fill={folder.color}/>
                      </svg>
                    </div>
                    <p className='font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[90%] overflow-hidden whitespace-nowrap text-ellipsis'>{folder.name === "Cliente" ? "Meus" : folder.name}</p>
                  </div>
                )})}
            </div>

          </div>
          <div className='flex w-full justify-end gap-4 bg-hilight self-end  pr-[10px] py-[10px] rounded-b-[4px] mt-[25px]'>
            <button onClick={() => props.setCopyTo(false)} className='bg-strong/40 border-[2px] border-strong hover:scale-[1.10] duration-300 p-[5px]  rounded-[8px] text-[20px] text-white '>Cancelar</button>
            <button  onClick={() => toast.promise(CopyngFileStorage(),messageToast)} className={`${folderName != undefined ? "bg-greenV/40 border-greenV": "bg-strong/30 border-strong text-white" } border-2 hover:scale-[1.10]  duration-300 py-[5px] px-[15px] rounded-[8px] text-[20px] text-white `}>Copiar</button>
          </div>
        </div>
      </div>
      : <></>
    )
}

export default CopyTo