import React, { useState, useEffect } from 'react'
import iconAddFile from '../../../../public/icons/addFile.svg'
import ArrowFilter from '../../../../public/icons/arrowFilter.svg'
import iconSearchFile from '../../../../public/icons/searchFile.svg' 
import Image from 'next/image'
import DownloadsFile from './dowloadFiles'
import { Files } from '../../../types/files'
import { Filter } from '../../../types/others'
import OptionsFile  from './options'
import Message from './message'
import { FormatDate } from '../../../Utils/Other/FormatDate'
import { FilterAlphabetical, FilterSize, FilterDate, FilterStatus } from '../../../Utils/Other/Filters'
import * as HoverCard from "@radix-ui/react-hover-card";
import { toast } from 'react-toastify'
import { usePathname } from 'next/navigation'
import MessageIcon from "../../../../public/icons/message.svg";
import { PlusCircledIcon } from '@radix-ui/react-icons';

interface Props{
  dataPages:{page:number, maxPages:number}
  trash:boolean
  files:Files[]
  folderName:string
  id_folder:string
  from:string
  textSearch:string
  SelectFile:Function
  setFiles:Function
  ConfirmationDeleteFile:Function
  childToParentDownload:Function
  setDataPages:Function
}

export default function TableFiles({id_folder, dataPages, trash, textSearch, files, folderName, from, SelectFile, ConfirmationDeleteFile, childToParentDownload, setFiles, setDataPages}:Props) {
  const [filter, setFilter] = useState<Filter>({name: false, size:false, date:false, status:false})
  const [messageEmpty, setMessageEmpty] = useState<string>()
  const [modalMessage, setModalMessage] = useState<{status:boolean, permission:string, index:number}>({status:false, permission:'', index:0})
  const pathName = usePathname()

  useEffect(() => {
    if(pathName?.includes("Clientes") === true  && folderName === "Cliente" ){
      setMessageEmpty("Envie seu primeiro arquivo!")
    } else if(pathName?.includes("Admin") === true  && folderName != "Cliente") {
      setMessageEmpty("Envie seu primeiro arquivo!")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

   // <--------------------------------- Select Files --------------------------------->
  function SelectAllFiles(){
    var i = (dataPages.page - 1) * 10 
    for(i; dataPages.page * 10 > i && i > ((dataPages.page - 2) * 10) ; i++){
      if (files.filter((file) => file.checked === true).length > 9 && files[i].checked === false) {
        return toast.error("Você só pode selecionar 10 arquivos");
      }

      if(files[i]){
        SelectFile(i)
      } else{
        break
      }
    }
  }

   // <--------------------------------- Download Files --------------------------------->
  function DownloadFile(file){
    DownloadsFile({selectFiles:[file], files:files, from:from, childToParentDownload:childToParentDownload, id_folder: id_folder})
  }

  return (
    <>
      {files.filter((file) => textSearch != "" ?  file.name?.toUpperCase().includes(textSearch.toUpperCase()) : true).length > 0 ?
      
        <>
          {modalMessage.status ? <Message modalMessage={modalMessage} files={files} childToParentDownload={childToParentDownload}  setModalMessage={setModalMessage}/> : <></>}
          {/* <--------------------------------- HeadTable ---------------------------------> */}
          <div className="w-full mt-[10px] grid grid-cols-[20px__1fr_120px_200px_110px_70px] max-lg:grid-cols-[20px__1fr_120px_110px_70px] max-md:grid-cols-[20px__1fr_110px_70px] max-sm:grid-cols-[20px__1fr_70px] gap-x-[15px] text-[18px] font-[500] border-y-[1px] border-y-neutral-400  bg-neutral-300  items-center py-[5px]">
            <button aria-label="checkbox demonstrativo" onClick={() => SelectAllFiles()} className='w-[22px] h-[22px] cursor-pointer bg-white rounded-[4px] ml-[5px] border-[1px] border-black'/>
            
            <button id="filterName" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({name:!filter.name, status: false, date:false, size:false}), FilterAlphabetical({dataFilter:files, filter:filter, setReturn:setFiles}))} className='flex items-center cursor-pointer'>
              <p className="dark:text-white">Nome</p> 
              <Image alt="Imagem de uma flecha" className={`ml-[5px] ${filter.name ? "rotate-180" : ""}`}src={ArrowFilter}/>
            </button>

            <button id="filterSize" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({size:! filter.size, name:false, status: false, date:false}), FilterSize({dataFilter:files, filter:filter, setReturn:setFiles}))} className='flex items-center cursor-pointer max-md:hidden'>
              <p className="dark:text-white">Tamanho</p> 
              <Image alt="Imagem de uma flecha" className={`ml-[5px] ${filter.size ? "rotate-180" : ""}`}src={ArrowFilter}/>
            </button>

            <button id="filterData" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({date:! filter.date, status: false, name:false, size:false}), FilterDate({dataFilter:files, filter:filter, setReturn:setFiles}))} className='flex items-center cursor-pointer max-lg:hidden'>
              <p className='text-left dark:text-white'>Data de upload</p>
              <Image alt="Imagem de uma flecha" className={`ml-[5px] ${filter.date ? "rotate-180" : ""}`} src={ArrowFilter}/>
            </button>

            <button id="filterStatus" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({...filter, status:! filter.status, name: false,  size:false, date:false}), FilterStatus({dataFilter:files, filter:filter, setReturn:setFiles}))}  className='flex items-center cursor-pointer max-sm:hidden'>
              <p className="dark:text-white">Status</p>
              <Image alt="Imagem de uma flecha" className={`ml-[5px]  ${filter.status ? "rotate-180" : ""}`} src={ArrowFilter}/>
            </button>

            <p className='font-[400] dark:text-white'>Ações</p>
          </div>
              
          {/* <--------------------------------- BodyTable ---------------------------------> */}
          {files
          .filter((file) => textSearch != "" ?  file.name?.toUpperCase().includes(textSearch.toUpperCase()) : true)
          .map((file:Files, index) => {
            var checked = file.checked
            if((dataPages.page * 10 - (11)) < index && index < dataPages.page * 10){
              return (
                <div
                  key={index}
                  className="w-full grid grid-cols-[20px__1fr_120px_200px_110px_70px] max-lg:grid-cols-[20px__1fr_120px_110px_70px] max-md:grid-cols-[20px__1fr_110px_70px] max-sm:grid-cols-[20px__1fr_70px] px-[5px] gap-x-[15px] text-[16px] font-[500] border-b-[1px] border-b-neutral-400 items-center py-[5px] max-sm:gap-x-[10px]"
                >
                  <input
                    aria-label="Selecionar Arquivos"
                    type="checkbox"
                    checked={checked} onChange={(e) => (checked = e.target.value === "on" ? true : false)}
                    onClick={() => SelectFile(index)}
                    className="w-[20px] h-[20px] cursor-pointer"
                  />

                  <div className="flex items-center">
                    <Image
                      src={`/icons/${file.type}.svg`}
                      alt="Imagem simbolizando o tipo de arquivo"
                      width={40}
                      height={40}
                      className="text-[10px] mr-[10px] w-[30px] max-lg:w-[25px]  h-[30px] max-lg:h-[25px]"
                    />
                    <p className="overflow-hidden whitespace-nowrap text-ellipsis dark:text-white max-w-[700px] max-2xl:max-w-[450px] max-xl:max-w-[220px] max-lg:max-w-[280px] max-sm:max-w-[250px] max-lsm:max-w-[200px]">
                      {file.name}
                    </p>
                  </div>

                  <p className="overflow-hidden whitespace-nowrap text-ellipsis dark:text-white ml-[20px] max-md:hidden">
                    {file.size < 1000
                      ? file.size + " KB"
                      : Math.ceil(file.size / 1000) + " MB"}{" "}
                  </p>

                  <p className="font-[400] max-lg:hidden text-left dark:text-white">
                    {FormatDate(file.created_date.toString())}
                  </p>

                  {file.viewed ? (
                    <HoverCard.Root>
                      <HoverCard.Trigger asChild>
                        <div className="text-[16px] bg-greenV/20 border-greenV text-[#00920f] border-[1px] rounded-[5px] text-center max-sm:hidden cursor-default">
                          Visualizado
                        </div>
                      </HoverCard.Trigger>
                      <HoverCard.Portal>
                        <HoverCard.Content
                          className="text-black data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade w-[300px] rounded-md bg-white p-2 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:transition-all"
                          sideOffset={5}
                        >
                          <p className="text-[14px] text-center cursor-default">Visualizado em: {new Date(file.viewedDate).toLocaleDateString() + " " + new Date(file.viewedDate).toLocaleTimeString()}</p>
                          <HoverCard.Arrow className="fill-white" />
                        </HoverCard.Content>
                      </HoverCard.Portal>
                    </HoverCard.Root>
                  ) : (
                    <HoverCard.Root>
                      <HoverCard.Trigger asChild>
                        <div className="text-[16px] bg-hilight dark:bg-dhilight max-sm:text-[12px] border-terciary dark:border-dterciary text-secondary dark:text-dsecondary border-[1px] rounded-[5px] text-center max-sm:hidden cursor-default">
                          Visualizado
                        </div>
                      </HoverCard.Trigger>
                      <HoverCard.Portal>
                        <HoverCard.Content
                          className="text-black data-[side=bottom]:animate-slideUpAndFade data-[side=right]:animate-slideLeftAndFade data-[side=left]:animate-slideRightAndFade data-[side=top]:animate-slideDownAndFade w-[300px] rounded-md bg-white p-2 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[state=open]:transition-all"
                          sideOffset={5}
                        >
                          <p className="text-[14px] text-center cursor-default">Este arquivo ainda não foi visualizado</p>
                          <HoverCard.Arrow className="fill-white" />
                        </HoverCard.Content>
                      </HoverCard.Portal>
                    </HoverCard.Root>
                  )}

                  <div className="flex justify-center items-center gap-[10px]">

                  {pathName == '/Dashboard/Admin/Arquivos' && file.from === "admin" || pathName == '/Dashboard/Clientes/Arquivos' && file.from === "user" ?
                      <div onClick={() => setModalMessage({index:index, permission:"edit", status:true})} className='bg-[#15E08B] p-[3px] rounded-[8px] justify-center items-center flex cursor-pointer hover:scale-105 duration-200'>
                          {file?.message && file?.message?.length > 0 ?  <Image src={MessageIcon} width={22} height={22} alt="Chat"/> : <PlusCircledIcon width={22} height={22} className='text-white'/> }
                      </div>
                  : 
                      file?.message && file?.message?.length > 0 ?
                          <div onClick={() => setModalMessage({...modalMessage, permission:"viwed", status:true})} className='bg-[#15E08B] p-[2px] rounded-[8px] justify-center items-center flex cursor-pointer hover:scale-105 duration-200'>
                              <Image src={MessageIcon} width={22} height={22} alt="Chat"/>
                          </div>
                      : <></>
                  }

                    <OptionsFile
                      id_folder={file.id_folder}
                      index={index}
                      from={from}
                      file={file}
                      files={files}
                      DownloadFile={DownloadFile}
                      ConfirmationDeleteFile={ConfirmationDeleteFile}
                      trash={Boolean(trash)}
                      childToParentDownload={childToParentDownload}
                    />
                  </div>
                </div>
              );
            }
          })}
        </>

        : 
          <div className='w-full h-full flex justify-center items-center flex-col'>
            <Image src={files.length <= 0 ? iconAddFile : iconSearchFile} width={80} height={80}  alt="Imagem de 2 arquivos" priority className='w-[170px] h-[170px]'/>
            {trash ? 
              <p className='font-poiretOne text-[40px] max-sm:text-[30px] text-center dark:text-white'>Nada por aqui... <br/> {files.filter((file) => textSearch != "" ?  file.name?.toUpperCase().includes(textSearch.toUpperCase()) : true).length  <= 0 ? "Nenhum arquivo deletado encontrado." : "Nenhum resultado foi encontrado."} </p>
            :
              <p className='font-poiretOne text-[40px] max-sm:text-[30px] text-center dark:text-white'>Nada por aqui... <br/> {files.filter((file) => textSearch != "" ?  file.name?.toUpperCase().includes(textSearch.toUpperCase()) : true).length <= 0 ? messageEmpty : "Nenhum resultado foi encontrado."}</p>
            }
          </div>
        }

        {/* <--------------------------------- NavBar table ---------------------------------> */}
        {files.filter((file) => textSearch != "" ?  file.name?.toUpperCase().includes(textSearch.toUpperCase()) : true).length > 0 ?
          <div className='w-full px-[10px] flex justify-between h-[50px] mt-[10px]'>
              <div className='flex justify-between w-full h-[40px] max-sm:h-[30px] items-center'>
                  <button onClick={() => {dataPages.page > 1 ? setDataPages({...dataPages, page: dataPages.page - 1}) : ""}} className={`px-[8px] py-[3px] border-[2px] ${dataPages.page == 1 ? "bg-hilight dark:bg-dhilight border-terciary dark:border-dterciary text-terciary dark:text-dterciary" : "cursor-pointer bg-black dark:bg-white border-black dark:border-white text-white dark:text-black"}  rounded-[8px] text-[18px] max-md:text-[16px] max-lsm:text-[14px]`}>Anterior</button>
                    <p className="dark:text-white">{`Página ${dataPages.page} de ${dataPages.maxPages}`}</p>
                  <button onClick={() => {dataPages.page < dataPages.maxPages ? setDataPages({...dataPages, page: dataPages.page + 1}) : ""}} className={`px-[8px] py-[3px] border-[2px] ${files.length / 10 <= dataPages.page ? "bg-hilight dark:bg-dhilight border-terciary dark:border-dterciary text-terciary dark:text-dterciary" : "cursor-pointer bg-black dark:bg-white border-black dark:border-white text-white dark:text-black"} rounded-[8px] text-[18px] max-md:text-[16px] max-lsm:text-[14px]`}>Proximo</button>
              </div>
          </div>
        :<></>}
    </>
  )
}
