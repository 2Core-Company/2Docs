import React, { useEffect, useState} from 'react'
import { db } from '../../../../firebase'
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { Files } from '../../../types/files'
import { Folders } from '../../../types/folders';

interface Props{
  file:Files
  files:Files[]
  setMoveTo:Function
  childToParentDownload:Function
}

function MoveTo({file, files, setMoveTo, childToParentDownload}:Props) {
    const [folders, setFolders] = useState([])
    const [folderName, setFolderName] = useState<string>()
    const messageToast = {pending:"Movendo o arquivo.", success:"Arquivo movido com sucesso.", error:"Não foi possivel mover o arquivo"}
    
    useEffect(() =>{
      GetFolders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    async function GetFolders(){
      const docRef = doc(db, "companies", file.id_company, "clients", file.id_user);
      const docSnap = await getDoc(docRef);
      const foldersHere = docSnap.data()?.folders.filter(folder => folder.id_enterprise === file.id_enterprise || folder.name === "Favoritos" || folder.name === "Cliente")
      if(foldersHere.length > 3){
        setFolders(foldersHere)
      } else {
        setMoveTo(false)
        throw toast.error("Você precisa ter no minimo 2 pastas para conseguir mover um arquivo.")
      }
    }

    async function ChangeFolder(){
      try{
        await updateDoc(doc(db, 'files', file.id_company, "documents", file.id_file), {
          folder: folderName
        })
        const index:number = files.findIndex(file => file.id_file === file.id_file)
        files.splice(index, 1);
        childToParentDownload(files)
        setMoveTo(false)
      } catch(e) {
        console.log(e)
        throw toast.error("Não foi possivél trocar a pasta deste arquivo.")
      }
    }


    return (
      folders.length > 3 ?
      <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black dark:text-white z-50 top-[0px] left-0'>
        <div className='bg-primary dark:bg-dprimary w-[500px] max-lsm:w-[320px] rounded-[4px] flex flex-col'>
          <div  className='bg-blue w-full h-[15px] rounded-t-[4px]'/>
          <div className=' px-[10px]'>
            <p className='text-[26px] mt-[10px]'>Para qual pasta voce deseja mover este arquivo? </p>
            <div className='flex w-full flex-wrap justify-center gap-[20px]'>
            {folders?.map((folder:Folders) => {
                if(folder.name === "Favoritos" || folder.name === "Cliente" || folder.name === file.folder){
                  return
                }
                return (
                  <div onClick={() => folderName === folder.name ? setFolderName(undefined) : setFolderName(folder.name)} key={folder.name} className={`${folder.name === folderName ? "bg-blue/10" : "" } cursor-pointer group mt-[30px] w-[110px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] p-[10px] rounded-[8px] hover:scale-105 hover:shadow-[#dadada] dark:hover:shadow-[#414141] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.9)]`}>
                    <div className='relative w-[90px] h-[90px] max-lg:h-[70px] max-lg:w-[70px] max-sm:h-[60px] max-sm:w-[60px] max-lsm:h-[50px] max-lsm:w-[50px]'>
                      <svg width="100%" height="100%" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path  d="M77.537 15.361H34.4308L29.0135 7.23427C28.7414 6.82757 28.2849 6.58325 27.7963 6.58325H1.46296C0.655407 6.58325 0 7.2372 0 8.04621V16.824V22.6758V65.1062C0 69.1381 3.27704 72.4166 7.30604 72.4166H71.694C75.723 72.4166 79 69.1381 79 65.1062V22.6758V16.824C79 16.015 78.3446 15.361 77.537 15.361ZM76.0741 21.2129H2.92593V18.287H33.6481H76.0741V21.2129ZM2.92593 9.50918H27.0136L30.9153 15.361H2.92593V9.50918ZM76.0741 65.1062C76.0741 67.523 74.1093 69.4907 71.694 69.4907H7.30604C4.89069 69.4907 2.92593 67.523 2.92593 65.1062V24.1388H76.0741V65.1062Z" fill={folder.color}/>
                      </svg>
                    </div>
                    <p className='font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[90%] overflow-hidden whitespace-nowrap text-ellipsis'>{folder.name === "Cliente" ? "Meus" : folder.name}</p>
                  </div>
                )
              })}
            </div>

          </div>
          <div className='flex w-full justify-end gap-4 bg-hilight dark:bg-dhilight self-end  pr-[10px] py-[10px] rounded-b-[4px] mt-[25px]'>
            <button onClick={() => setMoveTo(false)} className='bg-strong/40 dark:bg-dstrong/40 border-[2px] border-strong dark:border-dstrong hover:scale-[1.10] duration-300 p-[5px]  rounded-[8px] text-[20px] text-white '>Cancelar</button>
            <button  onClick={() => toast.promise(ChangeFolder(), messageToast)} className={`${folderName != undefined ? "bg-blue/40 border-blue cursor-pointer": "bg-strong/30 dark:bg-dstrong/20 border-strong dark:border-dstrong cursor-not-allowed text-white" } border-2 hover:scale-[1.10]  duration-300 py-[5px] px-[15px] rounded-[8px] text-[20px] text-white `}>Mover</button>
          </div>
        </div>
      </div>
      : <></>
    )
}

export default MoveTo