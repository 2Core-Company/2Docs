'use client'
import { MagnifyingGlassIcon, PersonIcon} from '@radix-ui/react-icons';
import Image from 'next/image'
import React, {useState, useContext, useEffect} from 'react'
import { userContext } from '../../../app/contextUser';
import { loadingContext } from '../../../app/contextLoading';
import {db} from '../../../../firebase'
import { doc, getDoc} from "firebase/firestore";  
import { FileIcon  } from '@radix-ui/react-icons';
import UploadFile from '../../Clients&Admin/Files/uploadFile'
import Modals from '../../Clients&Admin/Modals'
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import folder from '../../../../public/icons/folder.svg'
import Link from 'next/link'
import DeletFiles from './DeletFiles'
import DisableFiles from './DisableFiles'
import EnableFiles from './enableFiles'
import TableFiles from '../../Clients&Admin/Files/tableFiles'
import DownloadsFile from '../../Clients&Admin/Files/dowloadFiles';
import { Files, Modal, DataUser } from '../../../types/interfaces'
import LightModeSwitch from "../../Clients&Admin/LightModeSwitch"
import { GetFilesToTrash, GetFilesToFavorites, GetFilesToNormal } from '../../../Utils/Firebase/GetFiles';
import { useRouter } from 'next/navigation';
import { Search } from '../../../Utils/Other/Search';

function Files(){
  const { dataUser } = useContext(userContext)
  const router = useRouter()
  const { setLoading } = useContext(loadingContext)
  const [files, setFiles] = useState<Files[]>([])
  const [filesFilter, setFilesFilter] = useState<Files[]>([])
  const [selectFiles, setSelectFiles] = useState<Files[]>([])
  const [modal, setModal] = useState<Modal>({status: false, message: "", subMessage1: "", subMessage2: ""})
  const [pages, setPages] = useState<number>(0)
  const [menu, setMenu] = useState<boolean>(true)
  const params = useSearchParams()
  const trash:boolean = Boolean(params.get("trash"))
  const id:string  = params.get("id")
  const id_enterprise:string  = params.get("id_enterprise")
  const folderName:string  = params.get("folder")
  const [user, setUser] = useState<DataUser>()
  const toastDownload = {pending:"Fazendo download dos arquivos.",  success:"Download feito com sucesso", error:"Não foi possivel fazer o download."}

  // <--------------------------------- GetFiles --------------------------------->
  useEffect(() =>{
    if(dataUser != undefined){
      setLoading(true)
      GetFiles()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dataUser])
  
  async function GetFiles(){
    if(trash){
      await GetFilesToTrash({id_company:dataUser.id_company, id_user:id, id_enterprise:id_enterprise, setFiles:setFiles, setFilesFilter:setFilesFilter, setPages:setPages})
      GetUser()
    } else if(folderName === "Favoritos"){
      await GetFilesToFavorites({id_company:dataUser.id_company, id_user:id, id_enterprise:id_enterprise, setFiles:setFiles, setFilesFilter:setFilesFilter, setPages:setPages})
    } else {
      await GetFilesToNormal({id_company:dataUser.id_company, id_user:id, id_enterprise:id_enterprise, folderName:folderName, setFiles:setFiles, setFilesFilter:setFilesFilter, setPages:setPages})
    }
    setLoading(false)
  }

  // <--------------------------------- GetUser --------------------------------->
  async function GetUser(){
    const docRef = doc(db, "companies", dataUser.id_company, "clients", id);
    const docSnap = await getDoc(docRef);
    setUser(docSnap.data())
  }


  // <--------------------------------- Select Files --------------------------------->
  async function SelectFile(index:number){
    if (filesFilter.filter((file) => file.checked === true).length <= 9) {
      const allFiles = [...filesFilter];
      allFiles[index].checked = !allFiles[index].checked;
      const fileSelect = allFiles.filter((file) => file.checked === true);
      setSelectFiles(fileSelect);
      setFilesFilter(allFiles);
    } else {
      toast.error("Você só pode selecionar 10 arquivos");
    }
  }

  // <--------------------------------- Delet / Disable Files --------------------------------->
  function ConfirmationDeleteFile(){
    if(selectFiles.length > 0){
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
        toast.promise(DisableFiles({files, selectFiles, childToParentDelet}),{pending:"Deletando arquivos...", success:"Seus arquivos foram movidos para a lixeira.", error:"Não foi possivel deletar os arquivos."})
      }
  }

  function childToParentDelet(files){
    setFiles([...files])
    setFilesFilter([...files])
    setSelectFiles([])
    setMenu(true)
  }

  // <--------------------------------- Download File --------------------------------->
  function DowloadFiles(){
    if(selectFiles.length === 0){
      throw toast.error("Selecione um arquivo para baixar.")
    } 
    toast.promise(DownloadsFile({filesDownloaded:selectFiles, files:files, from:"admin", childToParentDownload:childToParentDownload}), toastDownload)
  }

  function childToParentDownload(files){
    setFiles([...files])
    setMenu(true)
    setSelectFiles([])
  }

  return (
    <div className="bg-primary dark:bg-dprimary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black">
      <LightModeSwitch />
      <div className='w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>
        <p  className=' font-poiretOne text-[40px] max-sm:text-[35px] dark:text-white'>{trash ? "Deletados" : "Documentos"}</p>
        <div className='flex items-top'>
          <div onClick={() => router.push('/Dashboard/Admin/Clientes')} className="flex cursor-pointer">
            <PersonIcon height={25} width={25} />
            <p className="cursor-pointer text-[18px] flex mr-[15px] text-secondary dark:text-dsecondary">
              {"Usuários    >"} 
            </p>
          </div>

          <Image src={folder} alt="Imagem de uma pasta"/> 
            <Link href={{pathname:"/Dashboard/Admin/Pastas", query:{id:id, id_enterprise:id_enterprise}}}  className='text-[18px] flex mx-[5px] text-secondary dark:text-dsecondary'>{"Pastas    >"}</Link> 
          <FileIcon className="dark:text-dsecondary" height={21} width={21}/>
          <p  className='text-[18px] flex mx-[5px] text-secondary dark:text-dsecondary'>{trash ? "Lixeira" : folderName}</p> 
        </div>
        
        <div className=' w-full relative border-[2px] border-terciary dark:border-dterciary mt-[30px] max-md:mt-[15px] rounded-[8px]'>
          <div className='mt-[10px] flex justify-between mx-[20px] max-sm:mx-[5px]'>
            <div className='flex items-center bg-transparent'>
            <p className='mr-[20px] max-sm:mr-[5px] text-[20px] font-[500] max-md:text-[18px] max-sm:text-[16px] max-lsm:text-[14px] dark:text-white'>{files.length} <span className='text-black dark:text-white'>Documentos</span></p>
              <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px] dark:text-white"/>
              <input type="text" placeholder='Buscar'  onChange={(Text) => Search({text:Text.target.value, data:files, setReturn:setFilesFilter})}  className='w-[300px] text-black dark:text-white max-lg:w-[250px] max-md:w-[200px] max-sm:w-[120px] max-lsm:w-[100px] bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px] dark:placeholder:text-gray-500'/>
            </div>
            <div className={`flex gap-[10px] max-lg:flex-col max-lg:absolute max-lg:right-[0] ${menu ? "" : "max-lg:bg-white/30 dark:max-lg:bg-black/30 backdrop-blur"} max-lg:top-[0] max-lg:px-[5px] max-lg:pb-[5px]`}>
              <button id="MenuTable" aria-label="Botão menu da tabela" onClick={() => setMenu(!menu)} className={`flex-col self-center hidden max-lg:flex ${menu ? "mt-[10px]" : "mt-[20px]"}  mb-[10px]`}>
                <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black dark:bg-white transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "rotate-45"}`}/>
                <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black dark:bg-white my-[8px] max-lsm:my-[5px] ${menu ? "" : "hidden"}`}/>
                <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black dark:bg-white transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "rotate-[135deg] mt-[-3px]"}`}/>
              </button>

              <button onClick={() => DowloadFiles()} className={` border-[2px] ${selectFiles.length > 0 ? "bg-blue/40 border-blue text-white" : "bg-hilight dark:bg-black/20 border-terciary dark:border-dterciary text-strong dark:text-dstrong"} p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>
                Download
              </button>

              <button onClick={() => ConfirmationDeleteFile()} className={`text-center border-[2px] p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] cursor-pointer  ${selectFiles.length > 0 ? "bg-red/40 border-red text-white" : "bg-hilight dark:bg-black/20 border-terciary dark:border-dterciary  text-strong dark:text-dstrong"} ${menu ? "max-lg:hidden" : ""}`}>
                Deletar
              </button>

              {trash ? 
                <EnableFiles files={files} menu={menu} setMenu={setMenu} setFiles={setFiles}  selectFiles={selectFiles} folders={user?.folders} />
              : 
                folderName != 'Favoritos' && folderName != 'Cliente' ? <UploadFile folderName={folderName}  permission={dataUser?.permission} id={id} id_company={dataUser?.id_company} menu={menu} from={"admin"} id_enterprise={id_enterprise}  setFilesFilter={setFilesFilter} setFiles={setFiles} setMenu={setMenu}/> : <></>
              }
            </div>
          </div>
          {/*<-------------- Table of Files --------------> */}
          <TableFiles filesFilter={filesFilter} setFilesFilter={setFilesFilter} files={files} pages={pages} childToParentDownload={childToParentDownload} SelectFile={SelectFile} trash={trash} folderName={folderName} from="admin"/>
        </div>
      </div>
      {modal.status ? <Modals setModal={setModal} message={modal.message} subMessage1={modal.subMessage1} subMessage2={modal.subMessage2}  childModal={childModal}/> : <></>}
    </div>
  )
}
export default Files;
