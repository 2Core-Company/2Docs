"use client";
import IconFolder from "../../../../public/icons/folder.svg";
import Image from "next/image";
import { TrashIcon, DownloadIcon, MagnifyingGlassIcon, LockClosedIcon, LockOpen1Icon, PersonIcon, GearIcon} from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useContext, useState } from "react";
import { adminContext } from "../../../app/Context/contextAdmin";
import {getDoc, doc, updateDoc, query, collection, where, orderBy, getDocs, limit} from "firebase/firestore";
import { db } from "../../../../firebase";
import CreateFolder from "./createFolder";
import DeleteFolder from "./DeletFolder";
import FolderConfig from "./folderConfig";
import Link from "next/link";
import DownloadsFile from "../../Clients&Admin/Files/dowloadFiles";
import ModalDelete from "../../../Utils/Other/modalDelete";
import { toast } from "react-toastify";
import { DataUser } from "../../../types/users";
import { Files } from "../../../types/files";
import { FolderCfg } from "../../../types/folders";
import { Modal, Enterprise } from "../../../types/others";
import Enterprises from "../../Clients&Admin/Enterprise";
import { useRouter } from "next/navigation";
import { GetRecentFilesOfEnterprise} from "../../../Utils/Firebase/Files/GetFiles";

function ComponentFolder() {
  const params:any = useSearchParams();
  const id_user: string = params.get("id_user");
  const id_enterprise: string = params.get("id_enterprise");
  const { dataAdmin } = useContext(adminContext);
  const [recentFiles, setRecentFiles] = useState<Files[]>([]);
  const [createFolder, setCreateFolder] = useState<boolean>(false);
  const [folderConfig, setFolderConfig] = useState<FolderCfg>({status: false, name: "", color: "", isPrivate: false, singleDownload: false, onlyMonthDownload: false, timeFile: 3});
  const [user, setUser] = useState<DataUser>({id:"", name: "", email:"", phone:"",verifiedEmail:true, id_company:"", permission:0, photo_url:'', created_date:0, pendencies:0, enterprises:[], admins: []});
  const [modal, setModal] = useState<Modal>({status: false, title:'', subject:'', target:''});
  const [id_feletFolder, setId_deletFolder] = useState<string>("");
  const [enterprise, setEnterprise] = useState<Enterprise>({ id:"", name:"", folders:[]});
  const [textSearch, setTextSearch] = useState<string>("")
  const toastDeletFolder = {pending: "Deletando pasta.",success: "Pasta deletada.",error: "Não foi possível deletar esta pasta."}
  const router = useRouter()
  const messageModal = {status: true, title: "Deletar Pasta", subject:'a pasta'}

  useEffect(() => {
    if (enterprise.id != "") {
      GetRecentFilesOfEnterprise({id_company:dataAdmin.id_company, id_user, id_enterprise, from:'user', setRecentFiles})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterprise]);

  useEffect(() => {
    if (dataAdmin != undefined) {
      GetUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataAdmin]);

  //Puxando informações dos usuários
  async function GetUser() {
    const docRef = doc(db, "companies", dataAdmin.id_company, "clients", id_user);
    const docSnap = await getDoc(docRef);
      setUser({
        id: docSnap.data()?.id, 
        email: docSnap.data()?.email,
        id_company: docSnap.data()?.id_company,
        name: docSnap.data()?.name,
        verifiedEmail:docSnap.data()?.verifiedEmail,
        permission: docSnap.data()?.permission,
        photo_url: docSnap.data()?.photo_url,
        enterprises: docSnap.data()?.enterprises,
        admins: docSnap.data()?.admins,
        created_date:docSnap.data()?.created_date,
        pendencies: docSnap.data()?.pendencies
      });
      const enterprise = docSnap.data()?.enterprises.find((enterprise) => enterprise.id === id_enterprise)
      if(enterprise){
        setEnterprise(enterprise);
      } else {
        setEnterprise(docSnap.data()?.enterprises[0]);
      }

      if(docSnap.data()?.admins.length !== 0 && docSnap.data()?.admins.findIndex((id) => id === dataAdmin.id) === -1 && dataAdmin.permission < 3) {
        router.replace('/Dashboard/Admin/')
      }
  }

  //Confirmação de deletar pasta
  function ConfirmationDeleteFolder({name, id_folder}: {name:string, id_folder:string}) {
    setId_deletFolder(id_folder);
    setModal({...messageModal, target:name});
  }

  const childModal = async () => {
    setModal({status: false, title:'', subject:'', target:''});
    toast.promise(DeleteFolder({user, id_folder:id_feletFolder, setUser, enterprise, id_company:dataAdmin.id_company}), toastDeletFolder)
  };


  async function PrivateFolderChange(privateState: boolean, index: number) {
    enterprise.folders[index].isPrivate = !privateState;
    const index2 = user.enterprises.findIndex((data) => enterprise.id === data.id)
    user.enterprises[index2] = enterprise
    try{
      toast.promise(
        updateDoc(
          doc(db, "companies", dataAdmin.id_company, "clients", user.id),
          {
            enterprises: user.enterprises,
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
    setUser({...user, enterprises: user.enterprises})
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
            <PersonIcon height={25} width={25}  className='text-neutral-400'/>
            <p className="cursor-pointer text-[18px] flex mr-[15px] text-neutral-400 dark:text-dsecondary">
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
        {recentFiles.length > 0 ? (
          <>
            <p className=" font-poiretOne text-[40px] max-sm:text-[35px]">
              Uploads recentes
            </p>
            <div className="flex flex-wrap mt-[30px]">
              {recentFiles.map((file) => {
                return (
                  <div key={file.id}className="group  w-[250px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] p-[10px] rounded-[8px] hover:scale-105 hover:shadow-[#dadada] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.9)] dark:hover:shadow-[#414141] relative">
                    <button onClick={() => DownloadsFile({selectFiles: [file], from: "admin", id_folder: file.id_folder})}>
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
            <input onChange={(text) => setTextSearch(text.target.value)} type="text" placeholder="Buscar" className="w-[90%] text-black dark:text-white bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px] border-b-black dark:border-b-white border-b-[2px]"/>
          </label>
          <button onClick={() => setCreateFolder(true)} className={`bg-black dark:bg-white cursor-pointer text-white dark:text-black p-[5px] flex justify-center items-center rounded-[8px] text-[17px] max-sm:text-[14px] max-lsm:text-[12px]`}>
            + Criar
          </button>
        </div>

        <div className="flex flex-wrap mt-[10px]  max-lg:gap-x-[15px]">
          {enterprise?.folders?.filter((folder) => textSearch != "" ?  folder.name?.toUpperCase().includes(textSearch.toUpperCase()) : true).length > 0 ? (
            enterprise.folders
            .filter((folder) => textSearch != "" ?  folder.name?.toUpperCase().includes(textSearch.toUpperCase()) : true)
            .map((folder, index) => {
              if(folder.name === 'Lixeira'){return}
              return (
                <div key={folder.name} className="group mt-[30px] w-[250px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] p-[10px] rounded-[8px] hover:scale-105  hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.1)] max-lg:shadow-[0_5px_10px_5px_rgba(0,0,0,0.1)] relative">
                  {folder.name === "Cliente" || folder.name === "Favoritos" || folder.name === 'Lixeira' ? (
                    <></>
                  ) : (
                    <div>
                      {folder.isPrivate === true ? (
                        <LockClosedIcon height={24} width={24} onClick={() => {PrivateFolderChange(folder.isPrivate, index);}} className="max-lg:w-[16px] max-lg:h-[16px] absolute top-[5px] right-[40px] max-lg:right-[20px] lg:group-hover:block cursor-pointer hidden max-lg:block"/>
                      ) : (
                        <LockOpen1Icon height={24} width={24} onClick={() => {PrivateFolderChange(folder.isPrivate, index);}} className="max-lg:w-[16px] max-lg:h-[16px] absolute top-[5px] right-[40px] max-lg:right-[20px] lg:group-hover:block cursor-pointer hidden max-lg:block"/>
                      )}
                      <TrashIcon height={25} width={25} onClick={() => ConfirmationDeleteFolder({name:folder.name, id_folder:folder.id})} className="max-lg:w-[16px] max-lg:h-[16px] absolute top-[5px] right-[10px] max-lg:right-[3px] lg:group-hover:block cursor-pointer hidden max-lg:block"/>
                      <GearIcon height={25} width={25} onClick={() => setFolderConfig({status: true, name: folder.name, color: folder.color, isPrivate: folder.isPrivate, singleDownload: folder.singleDownload, onlyMonthDownload: folder.onlyMonthDownload, timeFile: folder.timeFile})} className="max-lg:w-[16px] max-lg:h-[16px] absolute bottom-[5px] max-lg:bottom-[3px] right-[10px] max-lg:right-[3px] lg:group-hover:block cursor-pointer hidden max-lg:block" />
                    </div>
                  )}
                  
                  <Link href={{pathname: "/Dashboard/Admin/Arquivos", query: { folderName: folder.name, id_folder:folder.id, id_user:id_user, id_enterprise:enterprise.id}}}>
                    <div className="relative w-[90px] h-[90px] max-lg:h-[70px] max-lg:w-[70px] max-sm:h-[60px] max-sm:w-[60px] max-lsm:h-[50px] max-lsm:w-[50px]">
                      <svg width="100%" height="100%" viewBox="0 0 79 79" fill="none"xmlns="http://www.w3.org/2000/svg"> <path d="M77.537 15.361H34.4308L29.0135 7.23427C28.7414 6.82757 28.2849 6.58325 27.7963 6.58325H1.46296C0.655407 6.58325 0 7.2372 0 8.04621V16.824V22.6758V65.1062C0 69.1381 3.27704 72.4166 7.30604 72.4166H71.694C75.723 72.4166 79 69.1381 79 65.1062V22.6758V16.824C79 16.015 78.3446 15.361 77.537 15.361ZM76.0741 21.2129H2.92593V18.287H33.6481H76.0741V21.2129ZM2.92593 9.50918H27.0136L30.9153 15.361H2.92593V9.50918ZM76.0741 65.1062C76.0741 67.523 74.1093 69.4907 71.694 69.4907H7.30604C4.89069 69.4907 2.92593 67.523 2.92593 65.1062V24.1388H76.0741V65.1062Z" fill={folder.color}/></svg>
                    </div>
                    <p className="font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[80%]  overflow-hidden whitespace-nowrap text-ellipsis">
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
        <div className="w-[250px] p-[10px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] rounded-[8px] hover:scale-105 dark:hover:shadow-[#414141] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.1)] max-lg:shadow-[0_5px_10px_5px_rgba(0,0,0,0.1)]">
          <Link href={{ pathname: "Dashboard/Admin/Arquivos", query: { trash: true, id_user: id_user, id_enterprise: enterprise?.id },}}>
            <div className="relative w-[90px] h-[90px] max-lg:h-[70px] max-lg:w-[70px] max-sm:h-[60px] max-sm:w-[60px] max-lsm:h-[50px] max-lsm:w-[50px]">
              <svg width="100%" height="100%" viewBox="0 0 79 79" fill="none"xmlns="http://www.w3.org/2000/svg"> <path d="M77.537 15.361H34.4308L29.0135 7.23427C28.7414 6.82757 28.2849 6.58325 27.7963 6.58325H1.46296C0.655407 6.58325 0 7.2372 0 8.04621V16.824V22.6758V65.1062C0 69.1381 3.27704 72.4166 7.30604 72.4166H71.694C75.723 72.4166 79 69.1381 79 65.1062V22.6758V16.824C79 16.015 78.3446 15.361 77.537 15.361ZM76.0741 21.2129H2.92593V18.287H33.6481H76.0741V21.2129ZM2.92593 9.50918H27.0136L30.9153 15.361H2.92593V9.50918ZM76.0741 65.1062C76.0741 67.523 74.1093 69.4907 71.694 69.4907H7.30604C4.89069 69.4907 2.92593 67.523 2.92593 65.1062V24.1388H76.0741V65.1062Z" fill="#9E9E9E"/></svg>
            </div>
            <p className="font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[90%] overflow-hidden whitespace-nowrap text-ellipsis">
              Lixeira
            </p>
          </Link>
        </div>
      </div>
      {createFolder ? (
        <CreateFolder id_company={dataAdmin.id_company} enterprise={enterprise} id={id_user} user={user} setCreateFolder={setCreateFolder} setUser={setUser} />
      ) : (
        <></>
      )}
      {folderConfig.status ? (
        <FolderConfig  user={user} enterprise={enterprise} id={id_user} id_company={dataAdmin.id_company} setFolderConfig={setFolderConfig} folderConfig={folderConfig} setUser={setUser} setEnterprise={setEnterprise}/>
      ) : (
        <></>
      )}
      {modal.status ? (
        <ModalDelete modal={modal} setModal={setModal} childModal={childModal}/>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ComponentFolder;
