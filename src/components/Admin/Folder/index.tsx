'use client'
import IconFolder from '../../../../public/icons/folder.svg'
import Image from 'next/image'
import { TrashIcon, DownloadIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useSearchParams } from 'next/navigation';
import React, {useEffect, useContext, useState} from 'react'
import AppContext from '../../AppContext';
import { collection, where, getDocs, query } from "firebase/firestore";  
import { db } from '../../../../firebase'
import CreateFolder from './createFolder';
import DeleteFolder from './deletFolder';
import Link from 'next/link';
import DownloadsFile from '../../Files/dowloadFiles';
import { doc, updateDoc } from "firebase/firestore";  
import Modals from '../../Modals'
import {toast} from 'react-toastify'
import { Files, Modal} from '../../../types/interfaces' 

  function ComponentFolder(){
    const context = useContext(AppContext)
    const params = useSearchParams()
    const id:string = params.get('id')
    const [files, setFiles] = useState<Files[]>([])
    const [recentsFile, setRecentsFile] = useState<Files[]>([])
    const [createFolder, setCreateFolder] = useState<boolean>(false)
    const [user, setUser] = useState<object>()
    const [folders, setFolders] = useState<{color:string, name:string}[]>([])
    const [foldersFilter, setFoldersFilter] = useState([])
    const [modal, setModal] = useState<Modal>({status: false, message: "", subMessage1: "", subMessage2: ""})
    const [searchFolders, setSearchFolders] = useState<string>("")
    const [deletFolder, setDeletFolder] = useState<string>()

    useLayoulyEffect(() =>{
      context.setLoading(true)
      GetFiles()
      GetUser()
    },[])

    useEffect(() => {
      if(searchFolders != null){
        const searchFoldersFilter = []
        for (var i = 0; i < folders.length; i++) {
          if(folders[i].name.toLowerCase().includes(searchFolders.toLowerCase().trim())){
            searchFoldersFilter.push(folders[i])
          }
        }
        setFoldersFilter(searchFoldersFilter)
      }
    },[folders, searchFolders])

    async function GetFiles(){
      const getFiles = []
        const q = query(collection(db, "files"), where("id_user", "==", id));
        const querySnapshot = await getDocs(q);
        const a = querySnapshot.forEach((doc) => {
          getFiles.push(doc.data())
        });
      setFiles(getFiles)
      FilterDate(getFiles)
    }

    async function GetUser(){
        const q = query(collection(db, "users"), where("id", "==", id));
        const querySnapshot = await getDocs(q);
        const a = querySnapshot.forEach((doc) => {
          setUser(doc.data())
          setFolders(doc.data().folders)
          setFoldersFilter(doc.data().folders)
        });
    }

    async function FilterDate(getFiles:Array<{trash:boolean, from:string, date:Date}>){
      const filesHere = [...getFiles].filter(file => file.trash === false && file.from === "user")
      const recents = []
      filesHere.sort((a, b) =>{ 
        a.date = new Date(a.date)
        b.date = new Date(b.date)
        return (a.date.getTime() - b.date.getTime())
      });
      for (var i = 0; 3 > i && i < (filesHere.length); i++) {
        recents.push(filesHere[i])
      }
      context.setLoading(false)
      setRecentsFile(recents)
    }

    function FilterTrash(){
      return files.filter(file => file.trash === true)
    }

    function ConfirmationDeleteFolder(name:string){
      setDeletFolder(name)
      setModal({...modal, status:true, message: "Tem certeza que deseja excluir está Pasta?", subMessage1: "Todos os arquivos irão para a lixeira."})
    }

    const childModal = () => {
      setModal({status: false, message: "", subMessage1: "", subMessage2: ""})
      DeleteFolderAndFiles()
    }

    async function DeleteFolderAndFiles(){
      const name = deletFolder
      const filesHere = [...files]
      toast.promise(DeleteFolder({folders:folders, name:name, setFoldersFilter:setFoldersFilter, setFolders:setFolders, id:id}),{pending:"Deletando pasta.", success:"Pasta deletada.", error:"Não foi possivel deletar esta pasta."})
      const filesToTrash = files.filter(file => file.folder === name)
      for (var i = 0; i < filesToTrash.length; i++){
        await updateDoc(doc(db, 'files', filesToTrash[i].id_file), {
          trash: true
        })
        const index = filesHere.findIndex(file => file.id_file === filesToTrash[i].id_file)
        filesHere[index].trash = true
      }
      setFiles(filesHere)
    }

    return(
      <div className="bg-primary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black">
          <div className='w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>
          {recentsFile.length > 0 ? 
          <>
            <p  className=' font-poiretOne text-[40px] max-sm:text-[35px]'>Uploads recentes</p>
            <div className='flex items-top'>
              <Image src={IconFolder} alt="Imagem de uma pasta"/> 
              <p  className='text-[18px] flex mx-[5px] text-secondary'>{"Pastas"}</p> 
            </div>

            <div className='flex flex-wrap mt-[30px]'>
              {recentsFile.map((file) =>{
                return (
                  <div key={file.id_file} className='group  w-[250px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] p-[10px] rounded-[8px] hover:scale-105 hover:shadow-[#dadada] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.9)] relative'>
                    <button onClick={() => DownloadsFile({filesDownloaded:[file]})}>
                      <DownloadIcon height={25} width={25} className="absolute top-[5px] right-[10px] group-hover:block cursor-pointer hidden" />
                    </button>
                    <Image src={`/icons/${file.type}.svg`} width={90} height={90}  className="max-lg:h-[70px] max-lg:w-[70px] max-sm:h-[60px] max-sm:w-[60px] max-lsm:h-[50px] max-lsm:w-[50px]" alt="Imagem de um arquivo"/>
                    <p className='font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[90%] overflow-hidden whitespace-nowrap text-ellipsis'>{file.name}</p>
                  </div>
                )
              })}
            </div>
          </>
            : <></>}
            <p  className=' font-poiretOne text-[40px] mt-[20px] max-sm:text-[35px]'>Pastas</p>
            <div className='w-[500px] max-md:w-[90%] flex justify-between'>
              <label className='flex w-[80%] justify-center items-center'>
                <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px]"/>
                <input onChange={(text) => setSearchFolders(text.target.value)} type="text"  className='w-[90%] text-black  bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px] border-b-black border-b-[2px]' placeholder='Buscar' ></input>
              </label>
              <button className={`bg-black cursor-pointer text-white p-[5px] flex justify-center items-center rounded-[8px] text-[17px] max-sm:text-[14px] max-lsm:text-[12px]`} onClick={() => setCreateFolder(true)}>
                + Criar
              </button>
            </div>

            <div className='flex flex-wrap mt-[10px]'>
              {foldersFilter.length > 0 ? 
              foldersFilter.map((folder) =>{
                  const qtdFiles = files.filter(file => file.folder === folder.name && file.trash === false)
                return (
                  <div key={folder.name} className='cursor-pointer group mt-[30px] w-[250px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] p-[10px] rounded-[8px] hover:scale-105 hover:shadow-[#dadada] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.9)]'>
                    {folder.name === "Cliente" ? <></> : <TrashIcon height={25} width={25} onClick={() => ConfirmationDeleteFolder(folder.name)} className="absolute top-[5px] right-[10px] group-hover:block cursor-pointer hidden" />}
                    <Link href={{pathname:"/Admin/Arquivos", query:{folder:folder.name, id:id}}}>
                      <div className='relative w-[90px] h-[90px] max-lg:h-[70px] max-lg:w-[70px] max-sm:h-[60px] max-sm:w-[60px] max-lsm:h-[50px] max-lsm:w-[50px]'>
                        <p className='font-500 text-[18px] w-[25px] h-[25px] bg-secondary rounded-full absolute text-center text-[#fff] right-[-10px]'>{qtdFiles.length}</p>
                        <svg width="100%" height="100%" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M77.537 15.361H34.4308L29.0135 7.23427C28.7414 6.82757 28.2849 6.58325 27.7963 6.58325H1.46296C0.655407 6.58325 0 7.2372 0 8.04621V16.824V22.6758V65.1062C0 69.1381 3.27704 72.4166 7.30604 72.4166H71.694C75.723 72.4166 79 69.1381 79 65.1062V22.6758V16.824C79 16.015 78.3446 15.361 77.537 15.361ZM76.0741 21.2129H2.92593V18.287H33.6481H76.0741V21.2129ZM2.92593 9.50918H27.0136L30.9153 15.361H2.92593V9.50918ZM76.0741 65.1062C76.0741 67.523 74.1093 69.4907 71.694 69.4907H7.30604C4.89069 69.4907 2.92593 67.523 2.92593 65.1062V24.1388H76.0741V65.1062Z" fill={folder.color}/>
                        </svg>
                      </div>
                      <p className='font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[90%] overflow-hidden whitespace-nowrap text-ellipsis'>{folder.name}</p>
                    </Link>
                  </div>
                )})
              : <></>}
            </div>

            <p  className=' font-poiretOne text-[40px] mt-[20px]'>Lixeira</p>
            <Link href={{pathname:"/Admin/Arquivos", query:{trash:true, id:id}}} className='w-[250px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] p-[10px] rounded-[8px]'>
              <div className='relative w-[90px] h-[90px] max-lg:h-[70px] max-lg:w-[70px] max-sm:h-[60px] max-sm:w-[60px] max-lsm:h-[50px] max-lsm:w-[50px]'>
                <p className='font-500 text-[18px] w-[25px] h-[25px] bg-secondary rounded-full absolute text-center text-[#fff] right-[-10px]'>{FilterTrash().length}</p>
                <svg width="100%" height="100%" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path  d="M77.537 15.361H34.4308L29.0135 7.23427C28.7414 6.82757 28.2849 6.58325 27.7963 6.58325H1.46296C0.655407 6.58325 0 7.2372 0 8.04621V16.824V22.6758V65.1062C0 69.1381 3.27704 72.4166 7.30604 72.4166H71.694C75.723 72.4166 79 69.1381 79 65.1062V22.6758V16.824C79 16.015 78.3446 15.361 77.537 15.361ZM76.0741 21.2129H2.92593V18.287H33.6481H76.0741V21.2129ZM2.92593 9.50918H27.0136L30.9153 15.361H2.92593V9.50918ZM76.0741 65.1062C76.0741 67.523 74.1093 69.4907 71.694 69.4907H7.30604C4.89069 69.4907 2.92593 67.523 2.92593 65.1062V24.1388H76.0741V65.1062Z" fill="#9E9E9E"/>
                </svg>
              </div>
              <p className='font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[90%] overflow-hidden whitespace-nowrap text-ellipsis'>Excluidos</p>
            </Link>
          </div>
          {createFolder ? <CreateFolder  setCreateFolder={setCreateFolder} idUser={id} user={user} setFolders={setFolders}  setFoldersFilter={setFoldersFilter}/> : <></>}
          {modal.status ? <Modals setModal={setModal} message={modal.message} subMessage1={modal.subMessage1} childModal={childModal}/> : <></>}
      </div>
    )
  }
export default ComponentFolder;

function useLayoulyEffect(arg0: () => void, arg1: undefined[]) {
  throw new Error('Function not implemented.');
}
