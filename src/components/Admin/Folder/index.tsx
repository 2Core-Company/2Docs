"use client";
import IconFolder from "../../../../public/icons/folder.svg";
import Image from "next/image";
import { TrashIcon, DownloadIcon, MagnifyingGlassIcon, LockClosedIcon, LockOpen1Icon, PersonIcon, GearIcon} from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useContext, useState } from "react";
import { userContext } from '../../../app/Context/contextUser'
import {getDoc, doc, updateDoc} from "firebase/firestore";
import { db } from "../../../../firebase";
import CreateFolder from "./createFolder";
import DeleteFolder from "./DeletFolder";
import FolderConfig from "./folderConfig";
import Link from "next/link";
import DownloadsFile from "../../Clients&Admin/Files/dowloadFiles";
import Modals from "../../Clients&Admin/Modals";
import { toast } from "react-toastify";
import { DataUser, Files, Modal, Enterprise, FolderCfg, Folders } from "../../../types/interfaces";
import Enterprises from "../../Clients&Admin/Enterprise";
import { GetFilesToAllFolders } from "../../../Utils/Firebase/GetFiles";
import { Search } from "../../../Utils/Other/Search";
import { useRouter } from "next/navigation";

function ComponentFolder() {
  const params = useSearchParams();
  const id_enterprise: string = params.get("id_enterprise");
  const id_user: string = params.get("id");
  const { dataUser } = useContext(userContext);
  const [files, setFiles] = useState<Files[]>([]);
  const [recentsFile, setRecentsFile] = useState<Files[]>([]);
  const [createFolder, setCreateFolder] = useState<boolean>(false);
  const [folderConfig, setFolderConfig] = useState<FolderCfg>({status: false});
  const [user, setUser] = useState<DataUser>();
  const [foldersFilter, setFoldersFilter] = useState<Folders[]>([]);
  const [modal, setModal] = useState<Modal>({status: false, message: "", subMessage1: ""});
  const [deletFolder, setDeletFolder] = useState<string>();
  const [enterprise, setEnterprise] = useState<Enterprise>();
  const toastDeletFolder = {pending: "Deletando pasta.",success: "Pasta deletada.",error: "Não foi possível deletar esta pasta."}
  const router = useRouter()

  useEffect(() => {
    if (enterprise) {
      GetFilesToAllFolders({id_company:dataUser.id_company,  id_user:id_user, id_enterprise:enterprise.id, from:'user', setFiles:setFiles, setRecentFiles:setRecentsFile});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterprise]);

  useEffect(() => {
    if (dataUser != undefined) {
      GetUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUser]);

  //Puxando informações dos usuários
  async function GetUser() {
    const docRef = doc(db, "companies", dataUser.id_company, "clients", id_user);
    const docSnap = await getDoc(docRef);
    setUser(docSnap.data());
    if (id_enterprise) {
      const index = docSnap.data().enterprises.findIndex((enterprise) => enterprise.id === id_enterprise);
      setEnterprise(docSnap.data().enterprises[index]);
    } else {
      setEnterprise(docSnap.data().enterprises[0]);
    }
    setFoldersFilter(docSnap.data().folders);
  }

  //Filtandro arquivos da lixeira
  function FilterTrash() {
    return files.filter((file) => file.trash === true && file.id_enterprise == enterprise?.id);
  }

  //Confirmação de deletar pasta
  function ConfirmationDeleteFolder(name: string) {
    setDeletFolder(name);
    setModal({status: true,message: "Tem certeza que deseja excluir está Pasta?",subMessage1: "Todos os arquivos irão para a lixeira."});
  }

  const childModal = () => {
    setModal({ status: false, message: "", subMessage1: "", subMessage2: "" });
    toast.promise(DeleteFolders(), toastDeletFolder)
  };

  //Deletando pasta
  async function DeleteFolders() {
    const name = deletFolder;
    DeleteFolder({user: user,name: name,setFoldersFilter: setFoldersFilter,setUser: setUser,id: id_user,id_enterprise: enterprise.id,id_company: dataUser.id_company,})
    DisableFiles(name)
  }

  //Movendo arquivos para lixeira
  async function DisableFiles(nameFolder){
    const filesToTrash = files.filter((file) => file.folder === nameFolder);
    const allFiles = [...files]
    try{
      for await (const fileToTrash of filesToTrash){
        updateDoc(doc(db, 'files', fileToTrash.id_company, "documents", fileToTrash.id_file), {
          trash: true
        })
        const index:number = allFiles.findIndex(file => file.id_file === fileToTrash.id_file)
        allFiles[index].trash = true
      } 
      setFiles(allFiles)
    }catch(e){
      console.log(e)
      toast.error("Não Foi possível excluir este arquivo.")
    }
  }

  async function PrivateFolderChange(privateState: boolean, index: number) {    
    foldersFilter[index].isPrivate = !privateState;
    user.folders[index].isPrivate = !privateState;
    try{
      toast.promise(
        updateDoc(
          doc(db, "companies", dataUser.id_company, "clients", user.id),
          {
            folders: foldersFilter,
          }
        ),
        {
          pending: privateState ? "Desprivando pasta." : "Privando pasta.",
          success: privateState ? "Pasta desprivada." : "Pasta privada.",
        }
      );
    } catch(e) {
      throw toast("Erro ao realizar a ação: " + e)
    }

    setFoldersFilter([...foldersFilter]);
  }


  return (
    <div className="bg-primary dark:bg-dprimary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black dark:text-white">
      {user?.enterprises[0] && enterprise ? (
        <Enterprises enterprises={user?.enterprises} user={user} setUser={setUser} enterprise={enterprise} setEnterprise={setEnterprise} from={"admin"}/>
      ) : (
        <></>
      )}

      <div className="w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]">
        <div className="flex items-top">
          <div onClick={() => router.push('/Dashboard/Admin/Clientes')} className="flex cursor-pointer">
            <PersonIcon height={25} width={25} />
            <p className="cursor-pointer text-[18px] flex mr-[15px] text-secondary dark:text-dsecondary">
              {"Usuários    >"}
            </p>
          </div>

          <div className="flex">
            <Image src={IconFolder}  alt="Imagem de uma pasta" />
            <p className="text-[18px] flex ml-[5px] text-secondary dark:text-dsecondary">
              Pastas
            </p>
          </div>
        </div>
        {recentsFile.length > 0 ? (
          <>
            <p className=" font-poiretOne text-[40px] max-sm:text-[35px]">
              Uploads recentes
            </p>
            <div className="flex flex-wrap mt-[30px]">
              {recentsFile.map((file) => {
                return (
                  <div key={file.id_file}className="group  w-[250px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] p-[10px] rounded-[8px] hover:scale-105 hover:shadow-[#dadada] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.9)] dark:hover:shadow-[#414141] relative">
                    <button onClick={() => DownloadsFile({filesDownloaded: [file], from: "admin"})}>
                      <DownloadIcon height={25} width={25} className="absolute top-[5px] right-[10px] group-hover:block cursor-pointer hidden"/>
                    </button>
                    <Image src={`/icons/${file.type}.svg`} alt="Imagem de um arquivo" width={90} height={90} className="max-lg:h-[70px] max-lg:w-[70px] max-sm:h-[60px] max-sm:w-[60px] max-lsm:h-[50px] max-lsm:w-[50px]"/>
                    <p className="font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[90%] overflow-hidden whitespace-nowrap text-ellipsis">
                      {file.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <></>
        )}
        
        <p className=" font-poiretOne text-[40px] mt-[20px] max-sm:text-[35px] dark:text-white">
          Pastas
        </p>
        <div className="w-[500px] max-md:w-[90%] flex justify-between">
          <label className="flex w-[80%] justify-center items-center">
            <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px] dark:text-white"/>
            <input onChange={(text) => Search({text:text.target.value, data:user?.folders, setReturn: setFoldersFilter})} type="text" placeholder="Buscar" className="w-[90%] text-black dark:text-white bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px] border-b-black dark:border-b-white border-b-[2px]"/>
          </label>
          <button onClick={() => setCreateFolder(true)} className={`bg-black dark:bg-white cursor-pointer text-white dark:text-black p-[5px] flex justify-center items-center rounded-[8px] text-[17px] max-sm:text-[14px] max-lsm:text-[12px]`}>
            + Criar
          </button>
        </div>

        <div className="flex flex-wrap mt-[10px]">
          {foldersFilter.length > 0 ? (
            foldersFilter.map((folder, index) => {
              var qtdFiles
              if(folder.name === "Favoritos"){
                qtdFiles = files.filter((file) => file.favorite === true && file.trash === false)
              } else {
                qtdFiles = files.filter((file) => file.folder === folder.name && file.trash === false)
              }
              if(enterprise.id === folder.id_enterprise || folder.name == 'Cliente' ||  folder.name == 'Favoritos')
              return (
                <div key={folder.name} className="group mt-[30px] w-[250px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] p-[10px] rounded-[8px] hover:scale-105 hover:shadow-[#dadada] dark:hover:shadow-[#414141] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.9)]">
                  {folder.name === "Cliente" || folder.name === "Favoritos" ? (
                    <></>
                  ) : (
                    <div>
                      {folder.isPrivate === true ? (
                        <LockClosedIcon height={24} width={24} onClick={() => {PrivateFolderChange(folder.isPrivate, index);}} className="absolute top-[5px] right-[40px] group-hover:block cursor-pointer hidden"/>
                      ) : (
                        <LockOpen1Icon height={24} width={24} onClick={() => {PrivateFolderChange(folder.isPrivate, index);}} className="absolute top-[5px] right-[40px] group-hover:block cursor-pointer hidden"/>
                      )}
                      <TrashIcon height={25} width={25} onClick={() => ConfirmationDeleteFolder(folder.name)} className="absolute top-[5px] right-[10px] group-hover:block cursor-pointer hidden"/>
                      <GearIcon height={25} width={25} onClick={() => setFolderConfig({status: true, name: folder.name, color: folder.color, isPrivate: folder.isPrivate, singleDownload: folder.singleDownload, onlyMonthDownload: folder.onlyMonthDownload, timeFile: folder.timeFile})} className="absolute bottom-[5px] right-[10px] group-hover:block cursor-pointer hidden" />
                    </div>
                  )}
                  
                  <Link href={{pathname: "/Dashboard/Admin/Arquivos", query: { folder: folder.name, id: id_user, id_enterprise: enterprise?.id}}}>
                    <div className="relative w-[90px] h-[90px] max-lg:h-[70px] max-lg:w-[70px] max-sm:h-[60px] max-sm:w-[60px] max-lsm:h-[50px] max-lsm:w-[50px]">
                      <p className="font-500 text-[18px] w-[25px] h-[25px] bg-secondary dark:bg-dsecondary rounded-full absolute text-center text-white right-[-10px]">
                        {qtdFiles.length}
                      </p>
                      <svg width="100%" height="100%" viewBox="0 0 79 79" fill="none"xmlns="http://www.w3.org/2000/svg"> <path d="M77.537 15.361H34.4308L29.0135 7.23427C28.7414 6.82757 28.2849 6.58325 27.7963 6.58325H1.46296C0.655407 6.58325 0 7.2372 0 8.04621V16.824V22.6758V65.1062C0 69.1381 3.27704 72.4166 7.30604 72.4166H71.694C75.723 72.4166 79 69.1381 79 65.1062V22.6758V16.824C79 16.015 78.3446 15.361 77.537 15.361ZM76.0741 21.2129H2.92593V18.287H33.6481H76.0741V21.2129ZM2.92593 9.50918H27.0136L30.9153 15.361H2.92593V9.50918ZM76.0741 65.1062C76.0741 67.523 74.1093 69.4907 71.694 69.4907H7.30604C4.89069 69.4907 2.92593 67.523 2.92593 65.1062V24.1388H76.0741V65.1062Z" fill={folder.color}/></svg>
                    </div>
                    <p className="font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[90%] overflow-hidden whitespace-nowrap text-ellipsis">
                      {folder.name}
                    </p>
                  </Link>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>

        <p className=" font-poiretOne text-[40px] mt-[20px]">Lixeira</p>
        <div className="w-[250px] p-[10px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] rounded-[8px] hover:scale-105 hover:shadow-[#dadada] dark:hover:shadow-[#414141] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.9)]">
          <Link href={{ pathname: "Dashboard/Admin/Arquivos", query: { trash: true, id: id_user, id_enterprise: enterprise?.id },}}>
            <div className="relative w-[90px] h-[90px] max-lg:h-[70px] max-lg:w-[70px] max-sm:h-[60px] max-sm:w-[60px] max-lsm:h-[50px] max-lsm:w-[50px]">
              <p className="font-500 text-[18px] w-[25px] h-[25px] bg-secondary dark:bg-dsecondary rounded-full absolute text-center text-white right-[-10px]">
                {FilterTrash().length}
              </p>
              <svg width="100%" height="100%" viewBox="0 0 79 79" fill="none"xmlns="http://www.w3.org/2000/svg"> <path d="M77.537 15.361H34.4308L29.0135 7.23427C28.7414 6.82757 28.2849 6.58325 27.7963 6.58325H1.46296C0.655407 6.58325 0 7.2372 0 8.04621V16.824V22.6758V65.1062C0 69.1381 3.27704 72.4166 7.30604 72.4166H71.694C75.723 72.4166 79 69.1381 79 65.1062V22.6758V16.824C79 16.015 78.3446 15.361 77.537 15.361ZM76.0741 21.2129H2.92593V18.287H33.6481H76.0741V21.2129ZM2.92593 9.50918H27.0136L30.9153 15.361H2.92593V9.50918ZM76.0741 65.1062C76.0741 67.523 74.1093 69.4907 71.694 69.4907H7.30604C4.89069 69.4907 2.92593 67.523 2.92593 65.1062V24.1388H76.0741V65.1062Z" fill="#9E9E9E"/></svg>
            </div>
            <p className="font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[90%] overflow-hidden whitespace-nowrap text-ellipsis">
              Excluídos
            </p>
          </Link>
        </div>
      </div>
      {createFolder ? (
        <CreateFolder id_company={dataUser.id_company} enterprise={enterprise} id={id_user} user={user} setCreateFolder={setCreateFolder} setUser={setUser} setFoldersFilter={setFoldersFilter}/>
      ) : (
        <></>
      )}
      {folderConfig.status ? (
        <FolderConfig setFoldersFilter={setFoldersFilter} foldersFilter={foldersFilter} setUser={setUser} user={user} enterprise={enterprise} id={id_user} id_company={dataUser.id_company} setFolderConfig={setFolderConfig} folderConfig={folderConfig}/>
      ) : (
        <></>
      )}
      {modal.status ? (
        <Modals message={modal.message} subMessage1={modal.subMessage1} childModal={childModal} setModal={setModal}/>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ComponentFolder;
