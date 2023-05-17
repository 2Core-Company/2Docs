'use client'
import IconFolder from '../../../../public/icons/folder.svg'
import Image from 'next/image'
import { DownloadIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import React, {useEffect, useContext, useState} from 'react'
import { userContext } from '../../../app/Context/contextUser';
import Link from 'next/link';
import DownloadsFile from '../../Clients&Admin/Files/dowloadFiles';
import { Files } from '../../../types/files'
import { Enterprise } from '../../../types/others'; 
import Enterprises from '../../Clients&Admin/Enterprise';
import { GetFilesOrderByDate } from '../../../Utils/Firebase/GetFiles';

  function ComponentFolder(){
    const {dataUser, setDataUser} = useContext(userContext)
    const [recentFiles, setRecentsFiles] = useState<Files[]>([])
    const [enterprise, setEnterprise] = useState<Enterprise>({name:"", id:"", folders:[]})
    const [files, setFiles] = useState<Files[]>([])
    const [textSearch, setTextSearch] = useState<string>('')
    
    useEffect(() =>{
      if(dataUser != undefined){
        var enterprise_id
        setEnterprise(dataUser.enterprises[0])
        enterprise_id = dataUser.enterprises[0].id
        GetFiles(enterprise_id)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dataUser])

    async function GetFiles(enterprise_id){
      GetFilesOrderByDate({id_company:dataUser.id_company,  id_user:dataUser.id, id_enterprise:enterprise_id, from:'admin', setRecentsFiles:setRecentsFiles});
    }

    return(
      <div className="bg-primary dark:bg-dprimary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black dark:text-white">
      {dataUser?.enterprises?.length > 0 && enterprise ? <Enterprises enterprises={dataUser.enterprises} enterprise={enterprise} user={dataUser} setUser={setDataUser} setEnterprise={setEnterprise} from={"user"}/> : <></>}
          <div className='w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>
          {recentFiles.length > 0 ? 
          <>
            <p className=' font-poiretOne text-[40px] max-sm:text-[35px]'>Uploads recentes</p>
            <div className='flex items-top'>
              <Image src={IconFolder} alt="Imagem de uma pasta"/> 
              <p className='text-[18px] flex mx-[5px] text-secondary dark:text-dsecondary'>Pastas</p> 
            </div>

            <div className='flex flex-wrap mt-[30px]'>
              {recentFiles.map((file) =>{
                let index = enterprise.folders.findIndex((folder) => folder.name == file.folder)

                if(file?.id_enterprise === enterprise.id && enterprise.folders[index]?.isPrivate === false){
                  return (
                    <div key={file.id_file} className='group w-[250px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] p-[10px] rounded-[8px] hover:scale-105 hover:shadow-[#dadada] dark:hover:shadow-[#414141] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.9)] relative'>
                      <button onClick={() => DownloadsFile({selectFiles:[file], files:files, from:"user", folderName: file.folder})}>
                        <DownloadIcon height={25} width={25} className="absolute top-[5px] right-[10px] group-hover:block cursor-pointer hidden" />
                      </button>
                      <Image src={`/icons/${file.type}.svg`} width={90} height={90}  className="max-lg:h-[70px] max-lg:w-[70px] max-sm:h-[60px] max-sm:w-[60px] max-lsm:h-[50px] max-lsm:w-[50px]" alt="Imagem de um arquivo"/>
                      <p className='font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[90%] overflow-hidden whitespace-nowrap text-ellipsis'>{file.name}</p>
                    </div>
                  )
                }
              })}
            </div>
          </>
            : <></>}
            <p  className=' font-poiretOne text-[40px] mt-[20px] max-sm:text-[35px]'>Pastas</p>
            <div className='w-[500px] max-md:w-[90%] flex justify-between'>
              <label className='flex w-[80%] justify-center items-center'>
                <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px]"/>
                <input onChange={(text) => setTextSearch(text.target.value)} type="text"  className='w-[90%] text-black dark:text-white bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px] border-b-black dark:border-b-white border-b-[2px] dark:placeholder:text-gray-500' placeholder='Buscar' ></input>
              </label>
            </div>

            <div className='flex flex-wrap mt-[10px]'>
              {enterprise?.folders?.filter((folder) => textSearch != "" ?  folder.name?.toUpperCase().includes(textSearch.toUpperCase()) : true).length > 0 ? 
                enterprise?.folders
                .filter((folder) => textSearch != "" ?  folder.name?.toUpperCase().includes(textSearch.toUpperCase()) : true)
                .map((folder) =>{
                if(folder.isPrivate === false || folder.name === 'Lixeira'){
                  const qtdFiles = folder.name === "Favoritos" ? files.filter(file => file.favorite === true && file.trash === false && file.id_enterprise === enterprise.id) : files.filter(file => file.folder === folder.name && file.trash === false && file.id_enterprise === enterprise.id)
                return (
                  <Link href={{pathname: "Dashboard/Clientes/Arquivos", query:{folder:folder.name, id_enterprise:enterprise.id}}} key={folder.name} className='cursor-pointer group mt-[30px] w-[250px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] p-[10px] rounded-[8px] hover:scale-105 hover:shadow-[#dadada] dark:hover:shadow-[#414141] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.9)]'>
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
