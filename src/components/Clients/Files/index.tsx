'use client'
import { MagnifyingGlassIcon} from '@radix-ui/react-icons';
import Image from 'next/image'
import React, {useState, useContext, useEffect} from 'react'
import { FileIcon  } from '@radix-ui/react-icons';
import UploadFile from '../../Clients&Admin/Files/uploadFile'
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import folder from '../../../../public/icons/folder.svg'
import Link from 'next/link'
import TableFiles from '../../Clients&Admin/Files/tableFiles'
import DownloadsFile from '../../Clients&Admin/Files/dowloadFiles';
import Modals from '../../Clients&Admin/Modals'
import DeletFiles from '../../Admin/Files/DeletFiles';
import { Files } from '../../../types/files'
import { Modal } from '../../../types/others'
import { Folders } from '../../../types/folders'
import { where, collection, query, getDocs, getDoc, doc, updateDoc } from "firebase/firestore"; 
import {db} from '../../../../firebase'
import { userContext } from '../../../app/Context/contextUser'
import { loadingContext } from '../../../app/Context/contextLoading';

function Files(){
  const {dataUser} = useContext(userContext)
  const {setLoading} = useContext(loadingContext)
  const [files, setFiles] = useState<Files[]>([])
  const [selectFiles, setSelectFiles] = useState<Files[]>([])
  const [dataPages, setDataPages] = useState<{page:number, maxPages:number}>({page:0, maxPages:0})
  const [menu, setMenu] = useState<boolean>(true)
  const params:any = useSearchParams()
  const folderName:string = params.get("folder")
  const [modal, setModal] = useState<Modal>({status: false, message: "", subMessage1: ""})
  const [indexFile, setIndexFile] = useState<number>(0)
  const id_enterprise:string  = params.get("id_enterprise")
  const [textSearch, setTextSearch] = useState('')
  const router = useRouter();


  // <--------------------------------- GetFiles --------------------------------->
  useEffect(() =>{
    setLoading(true)
    if(dataUser != undefined){
      verifyFolder();
      GetFiles();
    }    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dataUser])

  async function verifyFolder() {
    let mockFolder = dataUser.folders.filter((folder) => folder.name === folderName && folder.id_enterprise === id_enterprise);

    if(mockFolder[0].isPrivate === true) {
      router.push("Dashboard/Clientes/Pastas");
    }
  }

  async function GetFiles(){
    var getFiles:Files[] = []
    var q
    if(folderName === "Favoritos"){
      q = query(collection(db, "files", dataUser.id_company, dataUser.id), where("id_user", "==",  dataUser.id), where("id_enterprise", "==", id_enterprise), where("favorite", "==", true), where("trash", "==", false));
    } else {
      q = query(collection(db, "files", dataUser.id_company, dataUser.id), where("id_user", "==",  dataUser.id), where("id_enterprise", "==", id_enterprise), where("folder", "==", folderName));
    }

    const docRef = doc(db, "companies", dataUser.id_company, "clients", dataUser.id);
    const docSnap = await getDoc(docRef);
    let folder: Folders[] = docSnap.data()?.folders.filter((folder) => folder.name == folderName);

    const querySnapshot: any = await getDocs(q);

    try {
      querySnapshot.forEach((document) => {
        let file: Files = document.data({
          id_file:document.data()?.id_file,
          id_user:document.data()?.id_user,
          folder:document.data()?.folder,
          trash:document.data()?.trash,
          size:document.data()?.size,
          id_company:document.data()?.id_company,
          favorite:document.data()?.favorite,
          id_enterprise:document.data()?.enterprises,
          name:document.data()?.name,
          url:document.data()?.url,
          viewedDate:document.data()?.viewedDate,
          type:document.data()?.type
        });
        let timeDiff = Date.now() - Date.parse(file.created_date.toString());

        switch(folder[0].timeFile) {
          case 3:
            getFiles.push(file);
            break;
          case 2:
            if(timeDiff > 2592000000) {
              updateDoc(doc(db, 'files', dataUser.id_company, "documents", file.id_file), {
                ...file,
                trash: true
              })
            } else {
              getFiles.push(file);
            }
            break;
          case 1:
            if(timeDiff > 604800000) {
              updateDoc(doc(db, 'files', dataUser.id_company, "documents", file.id_file), {
                ...file,
                trash: true
              })
            } else {
              getFiles.push(file);
            }
            break;
          case 0:
            if(timeDiff > 86400000) {
              updateDoc(doc(db, 'files', dataUser.id_company, "documents", file.id_file), {
                ...file,
                trash: true
              })
            } else {
              getFiles.push(file);
            }
            break;
          default:
            throw "A configuração de algum arquivo foi corrompida! Reinicie a página."
        }
      });
    } catch(e) {
      toast.error("Erro: " + e)
    }

    for(var i = 0; i < getFiles.length; i++){
      getFiles[i].checked = false;
      getFiles[i].created_date = getFiles[i].created_date + "";
    }

    setDataPages({page:1, maxPages:Math.ceil(getFiles.length / 10)});
    setFiles(getFiles);
    setLoading(false);
  }

  // <--------------------------------- Select File --------------------------------->
  async function SelectFile(index:number){
    if (files.filter((file) => file.checked === true).length > 9 && files[index].checked === false) {
      toast.error("Você só pode selecionar 10 arquivos");
    } else {
      const allFiles = [...files];
      allFiles[index].checked = !allFiles[index].checked;
      const fileSelect = allFiles.filter((file) => file.checked === true);
      setSelectFiles(fileSelect);
      setFiles(allFiles);
    }
  }

  // <--------------------------------- Delet File --------------------------------->
  function ConfirmationDeleteFile(index:number){
    setIndexFile(index)
    setModal({...modal, status:true, message: "Tem certeza que deseja excluir este arquivo?", subMessage1: "Não será possivel recuperar."})
  }
  
  const childModal = async () => {
    setModal({...modal, status:false})
    toast.promise(DeletFiles({files:files, selectFiles:[files[indexFile]], childToParentDelet}),{pending:"Deletando arquivo.", success:"Arquivo deletado com sucesso.", error:"Não foi possivel deletar os arquivos."})
  }

  function childToParentDelet(files){
    setFiles([...files])
    setMenu(true)
    setSelectFiles([])
  }

  // <--------------------------------- Download File --------------------------------->
  function childToParentDownload(files){
    setFiles(files)
    setMenu(true)
    setSelectFiles([])
  }

  function DowloadFiles(){    
    if(selectFiles.length === 0) throw toast.error("Selecione um arquivo para baixar.")
    toast.promise(DownloadsFile({selectFiles:selectFiles, files:files, from:"user", childToParentDownload:childToParentDownload, folderName: folderName}),{pending:"Fazendo download dos arquivos.",  success:"Download feito com sucesso", error:"Não foi possível fazer o download."})
  }


return (
      <div className="bg-primary dark:bg-dprimary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black dark:text-white">
        <div className='w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>
          <p  className=' font-poiretOne text-[40px] max-sm:text-[35px]'>Documentos</p>
          <div className='flex items-top'>
            <Image src={folder} alt="Imagem de uma pasta" width={21} height={21}/> 
              <Link href={{pathname:"Dashboard/Clientes/Pastas", query:{id_enterprise:id_enterprise}}}  className='text-[18px] flex mx-[5px] text-secondary'>{"Pastas    >"}</Link> 
            <FileIcon height={21} width={21} className={'text-secondary'}/>
            <p  className='text-[18px] flex mx-[5px] text-secondary'>{folderName}</p> 
          </div>
          <div className=' w-full relative border-[2px] border-terciary dark:border-dterciary mt-[30px] max-md:mt-[15px] rounded-[8px]'>
            <div className='mt-[10px] flex justify-between mx-[20px] max-sm:mx-[5px]'>
              <div className='flex items-center bg-transparent'>
              <p className='mr-[20px] max-sm:mr-[5px] text-[20px] font-[500] max-md:text-[18px] max-sm:text-[16px] max-lsm:text-[14px]'>{files.length} <span className='text-black dark:text-white'>Documentos</span></p>
                <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px]"/>
                <input type="text"  onChange={(Text) => setTextSearch(Text.target.value)}  className='w-[300px] text-black max-lg:w-[250px] max-md:w-[200px] max-sm:w-[120px] max-lsm:w-[100px] bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px] dark:placeholder:text-gray-500' placeholder='Buscar' ></input>
              </div>
              <div className={`flex gap-[10px] max-lg:flex-col max-lg:absolute max-lg:right-[0] ${menu ? "" : "max-lg:bg-white/30 dark:max-lg:bg-black/30 backdrop-blur"} max-lg:top-[0] max-lg:px-[5px] max-lg:pb-[5px]`}>
                <button id="MenuTable" aria-label="Botão menu da tabela" onClick={() => setMenu(!menu)} className={`flex-col self-center hidden max-lg:flex ${menu ? "mt-[10px]" : "mt-[20px]"}  mb-[10px]`}>
                  <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black dark:bg-white transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "rotate-45"}`}/>
                  <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black dark:bg-white my-[8px] max-lsm:my-[5px] transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "hidden"}`}/>
                  <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black dark:bg-white transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "rotate-[135deg] mt-[-3px]"}`}/>
                </button>
                <button onClick={() => DowloadFiles()} className={` border-[2px] ${selectFiles.length > 0 ? "bg-blue/40 border-blue text-white" : "bg-hilight border-terciary text-strong"} p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>Download</button>
                <UploadFile files={files} childToParentDownload={childToParentDownload}  id_enterprise={id_enterprise} folderName={folderName}  permission={dataUser?.permission} id={dataUser?.id} id_company={dataUser?.id_company} menu={menu} from={"user"}/>
              </div>
            </div>
            {/*<-------------- Table of Files --------------> */}
            <TableFiles dataPages={dataPages} files={files} ConfirmationDeleteFile={ConfirmationDeleteFile} childToParentDownload={childToParentDownload} SelectFile={SelectFile} folderName={folderName} trash={false} from={"user"} setFiles={setFiles} textSearch={textSearch} setDataPages={setDataPages}/>
          </div>
        </div>
        {modal.status ? <Modals setModal={setModal} message={modal.message} subMessage1={modal.subMessage1} childModal={childModal}/> : <></>}
      </div>
  )
  }
export default Files;
