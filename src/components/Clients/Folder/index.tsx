'use client'
import IconFolder from '../../../../public/icons/folder.svg'
import Image from 'next/image'
import { DownloadIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import React, {useEffect, useContext, useState} from 'react'
import AppContext from '../../Clients&Admin/AppContext';
import Link from 'next/link';
import DownloadsFile from '../../Clients&Admin/Files/dowloadFiles';
import { Enterprise, Files, Folders } from '../../../types/interfaces' 
import {db} from '../../../../firebase'
import { where, collection, query, getDocs} from "firebase/firestore"; 
import Enterprises from '../../Clients&Admin/Enterprise';
import { useSearchParams } from 'next/navigation';

  function ComponentFolder(){
    const context = useContext(AppContext)
    const params = useSearchParams()
    const [recentsFile, setRecentsFile] = useState<Files[]>([])
    const [foldersFilter, setFoldersFilter] = useState<Folders[]>([])
    const [searchFolders, setSearchFolders] = useState<string>("")
    const id_enterprise:string  = params.get("id_enterprise")
    const [enterprise, setEnterprise] = useState<Enterprise>()
    const [files, setFiles] = useState([])
    
    useEffect(() =>{
      if(context.dataUser != undefined){
        var enterprise_id
        if(id_enterprise){
          console.log(id_enterprise)
          const index = context.dataUser.enterprises.findIndex(enterprise => enterprise.id == id_enterprise)
          console.log(context.dataUser.enterprises)
          setEnterprise(context.dataUser.enterprises[index])
          enterprise_id = context.dataUser.enterprises[index].id
        } else {
          setEnterprise(context.dataUser.enterprises[0])
          enterprise_id = context.dataUser.enterprises[0].id
        }
        setFoldersFilter(context.dataUser.folders)
        GetFiles()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[context.dataUser])

    async function GetFiles(){
      var getFiles = []
      var q = query(collection(db, "files", context.dataUser.id_company, "Arquivos"), where("id_user", "==",  context.dataUser.id));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        getFiles.push(doc.data())
      });
      setFiles(getFiles)
    }

    useEffect(() =>{
      const filesHere = [...files].filter(file => file.trash === false && file.from === "admin")
      const recents = []
      filesHere.sort((a, b) =>{ 
        a.created_date = new Date(a.created_date)
        b.created_date = new Date(b.created_date)
        return (a.created_date.getTime() - b.created_date.getTime())
      });
      for (var i = 0; 3 > i && i < (filesHere.length); i++) {
        recents.push(filesHere[i])
      }
      setRecentsFile(recents)
    },[files])

    useEffect(() => {
      if(searchFolders != null && context.dataUser != undefined){
        const searchFoldersFilter = []
        for (var i = 0; i < context.dataUser.folders.length; i++) {
          if(context.dataUser.folders[i].name.toLowerCase().includes(searchFolders.toLowerCase().trim())){
            searchFoldersFilter.push(context.dataUser.folders[i])
          }
        }
        setFoldersFilter(searchFoldersFilter)
      }
    },[searchFolders, context.dataUser])

    function childToParentDownload(files){
      setFiles(files)
    }

    return(
      <div className="bg-primary dark:bg-dprimary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black dark:text-white">
      {context?.dataUser?.enterprises[0] && enterprise ? <Enterprises enterprises={context.dataUser.enterprises} enterprise={enterprise} user={context.dataUser} setUser={context.setDataUser} setEnterprise={setEnterprise} from={"user"}/> : <></>}
          <div className='w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>
          {recentsFile.length > 0 ? 
          <>
            <p className=' font-poiretOne text-[40px] max-sm:text-[35px]'>Uploads recentes</p>
            <div className='flex items-top'>
              <Image src={IconFolder} alt="Imagem de uma pasta"/> 
              <p className='text-[18px] flex mx-[5px] text-secondary dark:text-dsecondary'>Pastas</p> 
            </div>

            <div className='flex flex-wrap mt-[30px]'>
              {recentsFile.map((file) =>{
                if(file.id_enterprise === enterprise.id){
                return (
                  <div key={file.id_file} className='group w-[250px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] p-[10px] rounded-[8px] hover:scale-105 hover:shadow-[#dadada] dark:hover:shadow-[#414141] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.9)] relative'>
                    <button onClick={() => DownloadsFile({filesDownloaded:[file], files:files, from:"user", childToParentDownload:childToParentDownload})}>
                      <DownloadIcon height={25} width={25} className="absolute top-[5px] right-[10px] group-hover:block cursor-pointer hidden" />
                    </button>
                    <Image src={`/icons/${file.type}.svg`} width={90} height={90}  className="max-lg:h-[70px] max-lg:w-[70px] max-sm:h-[60px] max-sm:w-[60px] max-lsm:h-[50px] max-lsm:w-[50px]" alt="Imagem de um arquivo"/>
                    <p className='font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[90%] overflow-hidden whitespace-nowrap text-ellipsis'>{file.name}</p>
                  </div>
                )
              }})}
            </div>
          </>
            : <></>}
            <p  className=' font-poiretOne text-[40px] mt-[20px] max-sm:text-[35px]'>Pastas</p>
            <div className='w-[500px] max-md:w-[90%] flex justify-between'>
              <label className='flex w-[80%] justify-center items-center'>
                <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px]"/>
                <input onChange={(text) => setSearchFolders(text.target.value)} type="text"  className='w-[90%] text-black dark:text-white bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px] border-b-black dark:border-b-white border-b-[2px] dark:placeholder:text-gray-500' placeholder='Buscar' ></input>
              </label>
            </div>

            <div className='flex flex-wrap mt-[10px]'>
              {foldersFilter.length > 0 ? 
                foldersFilter.map((folder) =>{
                if(folder.id_enterprise == enterprise?.id || folder.name === "Favoritos" || folder.name === "Cliente"){
                  const qtdFiles = folder.name === "Favoritos" ? files.filter(file => file.favorite === true && file.trash === false && file.id_enterprise === enterprise.id) : files.filter(file => file.folder === folder.name && file.trash === false && file.id_enterprise === enterprise.id)
                return (
                  <Link href={{pathname: "/Clientes/Arquivos", query:{folder:folder.name, id_enterprise:enterprise.id}}} key={folder.name} className='cursor-pointer group mt-[30px] w-[250px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] p-[10px] rounded-[8px] hover:scale-105 hover:shadow-[#dadada] dark:hover:shadow-[#414141] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.9)]'>
                    <div className='relative w-[90px] h-[90px] max-lg:h-[70px] max-lg:w-[70px] max-sm:h-[60px] max-sm:w-[60px] max-lsm:h-[50px] max-lsm:w-[50px]'>
                      <p className='font-500 text-[18px] w-[25px] h-[25px] bg-secondary dark:bg-dsecondary rounded-full absolute text-center text-[#fff] right-[-10px]'>{qtdFiles.length}</p>
                      <svg width="100%" height="100%" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path  d="M77.537 15.361H34.4308L29.0135 7.23427C28.7414 6.82757 28.2849 6.58325 27.7963 6.58325H1.46296C0.655407 6.58325 0 7.2372 0 8.04621V16.824V22.6758V65.1062C0 69.1381 3.27704 72.4166 7.30604 72.4166H71.694C75.723 72.4166 79 69.1381 79 65.1062V22.6758V16.824C79 16.015 78.3446 15.361 77.537 15.361ZM76.0741 21.2129H2.92593V18.287H33.6481H76.0741V21.2129ZM2.92593 9.50918H27.0136L30.9153 15.361H2.92593V9.50918ZM76.0741 65.1062C76.0741 67.523 74.1093 69.4907 71.694 69.4907H7.30604C4.89069 69.4907 2.92593 67.523 2.92593 65.1062V24.1388H76.0741V65.1062Z" fill={folder.color}/>
                      </svg>
                    </div>
                    <p className='font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[90%] overflow-hidden whitespace-nowrap text-ellipsis'>{folder.name === "Cliente" ? "Meus" : folder.name}</p>
                  </Link>
                )}})
              : <></>}
            </div>
          </div>
      </div>
    )
  }
export default ComponentFolder;
