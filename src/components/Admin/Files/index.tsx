'use client'
import { MagnifyingGlassIcon} from '@radix-ui/react-icons';
import Image from 'next/image'
import React, {useState, useContext, useEffect} from 'react'
import AppContext from '../../Clients&Admin/AppContext';
import {db} from '../../../../firebase'
import { doc, getDoc, where, collection, getDocs, query} from "firebase/firestore";  
import { FileIcon  } from '@radix-ui/react-icons';
import UploadFile from '../../Clients&Admin/Files/uploadFile'
import Modals from '../../Clients&Admin/Modals'
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import folder from '../../../../public/icons/folder.svg'
import Link from 'next/link'
import DeletFiles from './deletFiles'
import DisableFiles from './disableFiles'
import EnableFiles from './enableFiles'
import TableFiles from '../../Clients&Admin/Files/tableFiles'
import DownloadsFile from '../../Clients&Admin/Files/dowloadFiles';
import { Files, Modal, DataUser } from '../../../types/interfaces'

function ComponentUpload(){
  const context = useContext(AppContext)
  const [files, setFiles] = useState<Files[]>([])
  const [filesFilter, setFilesFilter] = useState<Files[]>([])
  const [searchFile, setSearchFile] = useState<string>("")
  const [selectFiles, setSelectFiles] = useState<Files[]>([])
  const [modal, setModal] = useState<Modal>({status: false, message: "", subMessage1: "", subMessage2: ""})
  const [pages, setPages] = useState<number>(0)
  const [menu, setMenu] = useState<boolean>(true)
  const params = useSearchParams()
  const trash:boolean = Boolean(params.get("trash"))
  const id:string  = params.get("id")
  const folderName:string  = params.get("folder")
  const [user, setUser] = useState<DataUser>()
  
  // <--------------------------------- GetUser --------------------------------->
  async function GetUser(){
    const docRef = doc(db, "users", context.dataUser.id_company, "Clientes", id);
    const docSnap = await getDoc(docRef);
    setUser(docSnap.data())
  }
  
  // <--------------------------------- GetFiles --------------------------------->
  useEffect(() =>{
    if(context.dataUser != undefined){
      context.setLoading(true)
      GetFiles()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[context.dataUser])
  
  async function GetFiles(){
    const getFiles = []
    var q
    if(trash){
      q = query(collection(db, "files", context.dataUser.id_company, "Arquivos"), where("id_user", "==",  id), where("trash", "==", true));
      GetUser()
    } else if(folderName === "Favoritos"){
      q = query(collection(db, "files", context.dataUser.id_company, "Arquivos"), where("id_user", "==",  id), where("favorite", "==", true), where("trash", "==", false));
    } else {
      q = query(collection(db, "files", context.dataUser.id_company, "Arquivos"), where("id_user", "==",  id), where("folder", "==", folderName), where("trash", "==", false));
    }

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      getFiles.push(doc.data())
    });

    for(var i = 0; i < getFiles.length; i++){
      getFiles[i].checked = false
      getFiles[i].created_date = files[i].created_date + ""
    }
    setPages(Math.ceil(files.length / 10))
    setFiles(files)
    setFilesFilter(files)
    context.setLoading(false)
  }

  // <--------------------------------- Search Files --------------------------------->
  useEffect(() => {
    if(searchFile != null){
      const searchFilesFilter = []
      for (var i = 0; i < files.length; i++) {
        if(files[i].name.toLowerCase().includes(searchFile.toLowerCase().trim())){
          searchFilesFilter.push(files[i])
        }
      }
      setFilesFilter(searchFilesFilter)
    }
  },[files, searchFile])

  // <--------------------------------- Select Files --------------------------------->
  async function SelectFile(index:number){
    const files = [...filesFilter]
    files[index].checked = !files[index].checked
    const fileSelect = files.filter(file => file.checked === true);
    setSelectFiles(fileSelect)
    setFilesFilter(files)
  }
  
  // <--------------------------------- Upload File --------------------------------->
  const childToParentUpload = (childdata:object) => {
    const allFiles = [...files]
    allFiles.push(childdata)
    setFiles(allFiles)
    setMenu(true)
  }

  // <--------------------------------- Delet / Disable Files --------------------------------->
  function ConfirmationDeleteFile(index:number){
    if(index != undefined) {
      SelectFile(index)
    }
    if(selectFiles.length > 0 || index != undefined){
      if(trash){
        setModal({...modal, status:true, message: "Tem certeza que deseja excluir estes arquivo?", subMessage1: "Será permanente.", subMessage2:"Não será possivel recuperar."})
      } else {
        setModal({...modal, status:true, message: "Tem certeza que deseja excluir estes arquivos?", subMessage1: "Estes arquivos vão para a lixeira.", subMessage2:undefined})
      }
    } else {
      throw toast.error("Selecione um arquivo para deletar.")    
    }
  }

  const childModal = () => {
    setModal({status: false, message: "", subMessage1: "", subMessage2: ""})
      if(trash){
        toast.promise(DeletFiles({files:files, selectFiles:selectFiles, childToParentDelet:childToParentDelet}),{pending:"Deletando arquivos...", success:"Seus arquivos foram deletados.", error:"Não foi possivel deletar os arquivos."})
      } else {
        toast.promise(DisableFiles({files:files, selectFiles:selectFiles, childToParentDisable:childToChangeStatus}),{pending:"Deletando arquivos...", success:"Seus arquivos foram movidos para a lixeira.", error:"Não foi possivel deletar os arquivos."})
      }
  }

  function childToChangeStatus(files){
    setFiles(files)
    GetFiles()
    setMenu(true)
    setSelectFiles([])
  }

  function childToParentDelet(files){
    setFiles(files)
    setMenu(true)
    setSelectFiles([])
  }

  // <--------------------------------- Download File --------------------------------->
  function DowloadFiles(){
    if(selectFiles.length === 0) throw toast.error("Selecione um arquivo para baixar.")
    toast.promise(DownloadsFile({filesDownloaded:selectFiles, files:files, from:"admin", childToParentDownload:childToParentDownload}),{pending:"Fazendo download dos arquivos.",  success:"Download feito com sucesso", error:"Não foi possivel fazer o download."})
  }

  function childToParentDownload(files){
    const allFiles = [...files]
    setFiles(allFiles)
    setMenu(true)
    setSelectFiles([])
  }

return (
      <div className="bg-primary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black">
        <div className='w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>
          <p  className=' font-poiretOne text-[40px] max-sm:text-[35px]'>{trash ? "Deletados" : "Documentos"}</p>
          <div className='flex items-top'>
            <Image src={folder} alt="Imagem de uma pasta"/> 
              <Link href={{pathname:"Admin/Pastas", query:{id:id}}}  className='text-[18px] flex mx-[5px] text-secondary'>{"Pastas    >"}</Link> 
            <FileIcon height={21} width={21}/>
            <p  className='text-[18px] flex mx-[5px] text-secondary'>{trash ? "Lixeira" : folderName}</p> 
          </div>
          <div className=' w-full relative border-[2px] border-terciary mt-[30px] max-md:mt-[15px] rounded-[8px]'>
            <div className='mt-[10px] flex justify-between mx-[20px] max-sm:mx-[5px]'>
              <div className='flex items-center bg-transparent'>
              <p className='mr-[20px] max-sm:mr-[5px] text-[20px] font-[500] max-md:text-[18px] max-sm:text-[16px] max-lsm:text-[14px]'>{files.length} <span className='text-black'>Documentos</span></p>
                <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px]"/>
                <input type="text" value={searchFile} onChange={(Text) => setSearchFile(Text.target.value)}  className='w-[300px] text-black max-lg:w-[250px] max-md:w-[200px] max-sm:w-[120px] max-lsm:w-[100px] bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px]' placeholder='Buscar' ></input>
              </div>
              <div className={`flex gap-[10px] max-lg:flex-col max-lg:absolute max-lg:right-[0] ${menu ? "" : "max-lg:bg-[#959595]"} max-lg:top-[0] max-lg:px-[5px] max-lg:pb-[5px]`}>
                <button id="MenuTable" aria-label="Botão menu da tabela" onClick={() => setMenu(!menu)} className={`flex-col self-center hidden max-lg:flex ${menu ? "mt-[10px]" : "mt-[20px]"}  mb-[10px]`}>
                  <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "rotate-45"}`}/>
                  <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black my-[8px] max-lsm:my-[5px] ${menu ? "" : "hidden"}`}/>
                  <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "rotate-[135deg] mt-[-3px]"}`}/>
                </button>
                <button onClick={() => DowloadFiles()} className={` border-[2px] ${selectFiles.length > 0 ? "bg-blue/40 border-blue text-white" : "bg-hilight border-terciary text-strong"} p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>
                  Download
                </button>
                <button onClick={() => ConfirmationDeleteFile(undefined)} className={` border-[2px] ${selectFiles.length > 0 ? "bg-red/40 border-red text-white" : "bg-hilight border-terciary text-strong"} p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>Deletar</button>
                {trash ? 
                  <EnableFiles files={files} menu={menu} selectFiles={selectFiles} childToChangeStatus={childToChangeStatus} folders={user?.folders} />
                : 
                  <UploadFile folderName={folderName} childToParentUpload={childToParentUpload} permission={context?.dataUser?.permission} id={id} id_company={context?.dataUser?.id_company} menu={menu} from={"admin"}/>
                }
              </div>
            </div>
            {/*<-------------- Table of Files --------------> */}
            <TableFiles filesFilter={filesFilter} setFilesFilter={setFilesFilter} files={files} pages={pages} childToParentDownload={childToParentDownload} SelectFile={SelectFile} trash={trash} searchFile={searchFile} ConfirmationDeleteFile={ConfirmationDeleteFile} folderName={folderName} from="admin"/>
          </div>
        </div>
        {modal.status ? <Modals setModal={setModal} message={modal.message} subMessage1={modal.subMessage1} subMessage2={modal.subMessage2}  childModal={childModal}/> : <></>}
      </div>
  )
  }
export default ComponentUpload;
