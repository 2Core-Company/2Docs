'use client'
import { FileIcon, PersonIcon, EyeOpenIcon, DownloadIcon, Pencil2Icon, StarFilledIcon, Share1Icon, ChatBubbleIcon, TrashIcon } from '@radix-ui/react-icons';
import Image from 'next/image'
import React, { useState, useContext, useEffect } from 'react'
import { loadingContext } from '../../../app/Context/contextLoading';
import UploadFile from '../../Clients&Admin/Files/uploadFile'
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import folder from '../../../../public/icons/folder.svg'
import Link from 'next/link'
import DisableFiles from './DisableFiles'
import EnableFiles from './enableFiles'
import TableFiles from '../../Clients&Admin/Files/tableFiles'
import DownloadsFile from '../../Clients&Admin/Files/dowloadFiles';
import { adminContext } from '../../../app/Context/contextAdmin';
import { Files } from '../../../types/files';
import { GetFilesToTrash, GetFilesToFavorites, GetFilesAdmin } from '../../../Utils/Firebase/Files/GetFiles';
import { useRouter } from 'next/navigation';
import { companyContext } from '../../../app/Context/contextCompany';
import DeletFiles from '../../Clients&Admin/Files/DeletFiles'
import DocTable from '../../Clients&Admin/Files/DocTable';
import { Filter } from '../../../types/others'
import FormatSizeFile from '@/src/Utils/Other/FormatSizeFile';
import { FormatDate } from '@/src/Utils/Other/FormatDate';
import ViewFile from '@/src/components/Clients&Admin/Files/viewFile';
import Message from '@/src/components/Clients&Admin/Files/message';
import MoveTo from './moveTo';


function Files() {
  const { dataAdmin } = useContext(adminContext)
  const { dataCompany, setDataCompany } = useContext(companyContext)
  const router = useRouter()
  const { setLoading } = useContext(loadingContext)
  const [files, setFiles] = useState<Files[]>([])
  const [selectFiles, setSelectFiles] = useState<Files[]>([])
  const [dataPages, setDataPages] = useState<{ page: number, maxPages: number }>({ page: 1, maxPages: 1 })
  const [dropdownState, setDropdownState] = useState<boolean>(true)
  const [textSearch, setTextSearch] = useState<string>('')
  const params: any = useSearchParams()
  const trash: boolean = Boolean(params.get("trash"))
  const folderName: string = params.get("folderName")
  const id_user: string = params.get("id_user")
  const id_enterprise: string = params.get("id_enterprise")
  const id_folder: string = params.get("id_folder")
  const toastDownload = { pending: "Fazendo download dos arquivos.", success: "Download feito com sucesso", error: "Não foi possivel fazer o download." }
  const [filter, setFilter] = useState<Filter>({name: false, size: false, date: false, status: false})
  const [viewFile, setViewFile] = useState<{status: boolean, file?: Files}>({status: false})
  const [moveFile, setMoveFile] = useState<{status: boolean, file?: Files}>({status: false});
  const [modalMessage, setModalMessage] = useState<{status:boolean, action:'view' | 'edit', file?: Files}>({status:false, action:'view'})
  const admin = dataAdmin.id === '' ? false : true

  // <--------------------------------- GetFiles --------------------------------->  
  useEffect(() => {
    if (dataAdmin != undefined) {
      setLoading(true)
      GetFiles()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataAdmin])

  async function GetFiles() {
    if (trash) {
      await GetFilesToTrash({ id_company: dataAdmin.id_company, id_user: id_user, id_enterprise: id_enterprise, setFiles: setFiles, setDataPages: setDataPages })
    } else if (folderName === "Favoritos") {
      await GetFilesToFavorites({ id_company: dataAdmin.id_company, id_user: id_user, id_enterprise: id_enterprise, setFiles: setFiles, setDataPages: setDataPages })
    } else {
      await GetFilesAdmin({ id_company: dataAdmin.id_company, id_user: id_user, id_enterprise: id_enterprise, id_folder: id_folder, setFiles: setFiles, setDataPages: setDataPages })
    }
    setLoading(false)
  }

  console.log(files)
  console.log(admin)

  // <--------------------------------- Select Files --------------------------------->
  async function SelectFile(index: number) {
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

  async function DeleteFiles() {
    let result;

    if (selectFiles.length <= 0) {
      return toast.error("Selecione um arquivo para deletar.")
    }
      if (trash) {
        result = await toast.promise(DeletFiles({ files, selectFiles, dataCompany }), { pending: "Deletando arquivos...", success: "Seus arquivos foram deletados.", error: "Não foi possivel deletar os arquivos." })
      } 
      else {
        result = await toast.promise(DisableFiles({ files, selectFiles }), { pending: "Deletando arquivos...", success: "Seus arquivos foram movidos para a lixeira.", error: "Não foi possivel deletar os arquivos." })
      }

    if(result) {
      const maxPages = Math.ceil(result.length / 10)
      var page = dataPages.page
      if (maxPages < dataPages.page) {
        page = maxPages
      }
      setFiles([...result])
      setDropdownState(true)
      setSelectFiles([])
      setDataPages({ maxPages: maxPages, page: page })
    }
  }

  function changeFilter(button: "name" | "size" | "date" | "status") {
    switch(button) {
      case "name":
        setFilter({name: !filter.name, size: false, date: false, status: false});
        break;
      case "size":
        setFilter({name: false, size: !filter.size, date: false, status: false});
        break;
      case "date":
        setFilter({name: false, size: false, date: !filter.date, status: false});
        break;
      case "status":
        setFilter({name: false, size: false, date: false, status: !filter.status});
        break;
    }
  }

  // <--------------------------------- Download File --------------------------------->
  async function DownloadFiles() {
    if (selectFiles.length === 0) {
      throw toast.error("Selecione um arquivo para baixar.")
    }

    const result = await toast.promise(DownloadsFile({ selectFiles: selectFiles, files: files, from: "admin", id_folder: id_folder }), toastDownload)

    if(result) {
      const maxPages = Math.ceil(result.length / 10)
      var page = dataPages.page
      if (maxPages < dataPages.page) {
        page = maxPages
      }
      setFiles([...result])
      setDropdownState(true)
      setSelectFiles([])
      setDataPages({ maxPages: maxPages, page: page })
    }
  }

  return (
    <div className="bg-primary dark:bg-dprimary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black">
      <div className='w-full h-full mt-[42px]'>
        <p className=' font-poiretOne text-[40px] max-sm:text-[35px] dark:text-white'>{trash ? "Deletados" : "Documentos"}</p>
        <div className='flex items-center overflow-hidden'>
          <div onClick={() => router.push('/Dashboard/Admin/Clientes')} className="flex cursor-pointer items-center">
            <PersonIcon height={25} width={25} className='text-secondary' />
            <p className="cursor-pointer text-[18px] flex mr-[15px] max-sm:mr-[0px] max-sm:text-[16px] whitespace-nowrap text-secondary dark:text-dsecondary">
              {"Usuários >"}
            </p>
          </div>
          <Image className='min-w-[19px] min-h-[19px]' src={folder} alt="Imagem de uma pasta" />
          <Link href={{ pathname: "/Dashboard/Admin/Pastas", query: { id_user: id_user, id_enterprise: id_enterprise } }} className='text-[18px] flex mx-[5px] text-secondary dark:text-dsecondary max-sm:text-[16px] whitespace-nowrap'>{"Pastas  >"}</Link>
          <FileIcon className={'min-w-[19px] min-h-[19px] text-secondary'} />
          <p className='text-[18px] flex mx-[5px] text-secondary dark:text-dsecondary max-sm:text-[16px] whitespace-nowrap'>{trash ? "Lixeira" : folderName}</p>
        </div>

        {modalMessage.status && <Message admin={admin} modalMessage={modalMessage} setModalMessage={setModalMessage} setFiles={setFiles}/>}
        {viewFile.status && <ViewFile file={viewFile.file!} setFiles={setFiles} setViewFile={setViewFile} admin={admin}/>}
        {moveFile.status ? <MoveTo files={files} moveFile={moveFile} setMoveFile={setMoveFile} setFiles={setFiles}/> : <></>}
        <DocTable.Root>
          <DocTable.Header>
            <DocTable.Count count={files.length} />
            <DocTable.Search placeholder="Buscar" />
            <DocTable.GlobalActions setDropdownState={setDropdownState} dropdownState={dropdownState}>
              <DocTable.GlobalAction dropdownState={dropdownState} className={`${selectFiles.length > 0 ? "" : "cursor-not-allowed hover:brightness-100 text-[#AAAAAA] bg-[#D9D9D9] border-[2px] border-[#9E9E9E]"}`} >Download</DocTable.GlobalAction>
              <DocTable.GlobalAction dropdownState={dropdownState} className={`${selectFiles.length > 0 ? "bg-[#BE0000] border-[#970000]" : "cursor-not-allowed hover:brightness-100 text-[#AAAAAA] bg-[#D9D9D9] border-[2px] border-[#9E9E9E]"}`} >Deletar</DocTable.GlobalAction>
            </DocTable.GlobalActions>
          </DocTable.Header>
          <DocTable.Content>
            <DocTable.Heading className="grid-cols-[60px_1fr_120px_200px_140px_150px] max-lg:grid-cols-[60px_1fr_120px_140px_150px] max-md:grid-cols-[60px_1fr_140px_150px] max-sm:grid-cols-[60px_1fr_150px]">
              <DocTable.GlobalCheckbox />
              <DocTable.Filter label="Nome" arrow active={filter.name} onClick={() => changeFilter("name")}/>
              <DocTable.Filter label="Tamanho" arrow active={filter.size} className="max-md:hidden justify-center" onClick={() => changeFilter("size")}/>
              <DocTable.Filter label="Data de Upload" arrow active={filter.date} className={"max-lg:hidden"} onClick={() => changeFilter("date")}/>
              <DocTable.Filter label="Status" arrow active={filter.status} className={"max-sm:hidden"} onClick={() => changeFilter("status")}/>
              <DocTable.Filter label="Ações" className="cursor-default justify-center"/>
            </DocTable.Heading>
            <DocTable.Files>
              {files
              .filter((file) => true)
              .map((file: Files, index) => {
                return(
                  <DocTable.File key={index} className="grid-cols-[60px__1fr_120px_200px_140px_150px] max-lg:grid-cols-[60px__1fr_120px_140px_150px] max-md:grid-cols-[60px__1fr_140px_150px] max-sm:grid-cols-[60px__1fr_150px]">
                    <DocTable.FileCheckbox/>
                    <DocTable.Data>
                      <DocTable.Icon>
                        <Image src={`/icons/${file.type}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={30} height={30} className="mr-[23px] w-[30px] h-[30px] max-lg:w-[25px] max-lg:h-[25px]" />
                      </DocTable.Icon>
                      <DocTable.Text className="text-[#000] font-[400]">{file.name}</DocTable.Text>
                    </DocTable.Data>
                    <DocTable.Data className="justify-center gap-1">
                      <DocTable.Text>{FormatSizeFile(file.size)[0]}</DocTable.Text>
                      <DocTable.Label>{FormatSizeFile(file.size)[1]}</DocTable.Label>
                    </DocTable.Data>
                    <DocTable.Data>
                      <DocTable.Text>{FormatDate(file.created_date)}</DocTable.Text>
                    </DocTable.Data>
                    <DocTable.Data>
                      <DocTable.Viewed viewedDate={file.viewedDate}/>
                    </DocTable.Data>
                    <DocTable.FileActions>
                      { file?.message && file?.message?.length > 0 ?
                        <DocTable.Message notification={file.messageNotif} from={file.from} admin={admin} onClick={() => setModalMessage({status: true, action: 'view', file: file})} iconClassName="cursor-pointer"/> :
                        <></>
                      }
                      <DocTable.Options>
                        <DocTable.OptionsItem dropdownClassName="rounded-t-[6px]" onClick={() => setViewFile({status: true, file: file})}>
                          <DocTable.OptionsItemIcon><EyeOpenIcon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Visualizar</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        <DocTable.OptionsItem>
                          <DocTable.OptionsItemIcon><DownloadIcon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Baixar</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        <DocTable.OptionsItem onClick={() => setMoveFile({status: true, file: file})}>
                          <DocTable.OptionsItemIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 15 15" fill="none" className="stroke-[#686868] group-hover:stroke-white">
                              <path d="M2 12V3C2 2.44772 2.44772 2 3 2H5.46482C5.79917 2 6.1114 2.1671 6.29687 2.4453L7.70313 4.5547C7.8886 4.8329 8.20083 5 8.53518 5H12C12.5523 5 13 5.44772 13 6V12C13 12.5523 12.5523 13 12 13H3C2.44772 13 2 12.5523 2 12Z"/>
                              <path d="M2 9H7"/>
                              <path d="M7.08025 9.00008L6.08025 10.0001L6.0791 9.9989L5.08099 11.0002" stroke-linecap="round"/>
                              <path d="M7.08025 8.99992L6.08025 7.99992L6.0791 8.0011L5.08099 6.99982" stroke-linecap="round"/>
                            </svg>
                          </DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Mover</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        <DocTable.OptionsItem>
                          <DocTable.OptionsItemIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 15 15" fill="none" className="stroke-[#686868] group-hover:stroke-white">
                              <path d="M1.875 10V2.5C1.875 1.80964 2.43464 1.25 3.125 1.25H9.375M5.625 13.75H11.25C11.9404 13.75 12.5 13.1904 12.5 12.5V5C12.5 4.30964 11.9404 3.75 11.25 3.75H5.625C4.93464 3.75 4.375 4.30964 4.375 5V12.5C4.375 13.1904 4.93464 13.75 5.625 13.75Z" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Copiar</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        <DocTable.OptionsItem>
                          <DocTable.OptionsItemIcon><Pencil2Icon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Renomear</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        <DocTable.OptionsItem>
                          <DocTable.OptionsItemIcon><StarFilledIcon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Favoritar</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        <DocTable.OptionsItem>
                          <DocTable.OptionsItemIcon><Share1Icon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Compartilhar</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        {admin && 
                        <DocTable.OptionsItem onClick={() => setModalMessage({status: true, action: "edit", file: file})}>
                          <DocTable.OptionsItemIcon><ChatBubbleIcon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Definir observação</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        }
                        {(admin && file.from === 'admin' || admin === false && file.from === 'user') &&
                        <DocTable.OptionsItem dropdownClassName="rounded-b-[6px] hover:bg-[#BE0000]">
                          <DocTable.OptionsItemIcon><TrashIcon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Excluir</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        }
                      </DocTable.Options>
                    </DocTable.FileActions>
                  </DocTable.File>
                )
              })}
            </DocTable.Files>
          </DocTable.Content>
          <DocTable.Footer />
        </DocTable.Root>

        <div className='min-h-[400px] w-full relative border-[2px] border-terciary dark:border-dterciary mt-[30px] max-md:mt-[15px] rounded-[8px]'>
          <div className='mt-[10px] flex justify-between mx-[20px] max-sm:mx-[5px]'>
            <div className='flex items-center bg-transparent'>
              <p className='mr-[20px] max-sm:mr-[5px] text-[20px] font-[500] max-md:text-[18px] max-sm:text-[16px] max-lsm:text-[14px] dark:text-white'>{files.length} <span className='text-black dark:text-white'>Documentos</span></p>
              {/* <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px] dark:text-white" /> */}
              <input type="text" placeholder='Buscar' onChange={(Text) => setTextSearch(Text.target.value)} className='w-[300px] text-black dark:text-white max-lg:w-[250px] max-md:w-[200px] max-sm:w-[120px] max-lsm:w-[100px] bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px] dark:placeholder:text-gray-500' />
            </div>
            <div className={`cursor-pointer flex gap-[10px] max-lg:flex-col max-lg:absolute max-lg:right-[0] ${dropdownState ? "" : "max-lg:bg-white/30 dark:max-lg:bg-black/30 backdrop-blur"} max-lg:top-[0] max-lg:px-[5px] max-lg:pb-[5px]`}>
              <button id="MenuTable" aria-label="Botão menu da tabela" onClick={() => setDropdownState(!dropdownState)} className={`flex-col self-center hidden max-lg:flex ${dropdownState ? "mt-[10px]" : "mt-[20px]"}  mb-[10px]`}>
              <div className={`rounded-[10px] w-[30px] max-sm:w-[25px] h-[3px] bg-black dark:bg-white transition duration-500 max-sm:duration-400  ease-in-out ${dropdownState ? "" : "rotate-45"}`} />
              <div className={`rounded-[10px] w-[30px] max-sm:w-[25px] h-[3px] bg-black dark:bg-white my-[5px] ${dropdownState ? "" : "hidden"}`} />
              <div className={`rounded-[10px] w-[30px] max-sm:w-[25px] h-[3px] bg-black dark:bg-white transition duration-500 max-sm:duration-400  ease-in-out ${dropdownState ? "" : "rotate-[135deg] mt-[-3px]"}`} />
            </button>

              {
                trash ? <></> : <button onClick={() => DownloadFiles()} className={`hover:brightness-[.85] cursor-pointer border-[2px] ${selectFiles.length > 0 ? "bg-blue/40 border-blue text-white" : "bg-hilight dark:bg-black/20 border-terciary dark:border-dterciary text-strong dark:text-dstrong"} p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${dropdownState ? "max-lg:hidden" : ""}`}>Download</button>
              }

              <button onClick={() => DeleteFiles()} className={`hover:brightness-[.85] text-center border-[2px] p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] cursor-pointer  ${selectFiles.length > 0 ? "bg-red/40 border-red text-white" : "bg-hilight dark:bg-black/20 border-terciary dark:border-dterciary  text-strong dark:text-dstrong"} ${dropdownState ? "max-lg:hidden" : ""}`}>
                Deletar
              </button>

              {trash
              ? <EnableFiles files={files} menu={dropdownState} setMenu={setDropdownState} setFiles={setFiles} selectFiles={selectFiles} />
                :
                folderName != 'Favoritos' && folderName != 'Cliente' ? <></> : <></>
              }
            </div>
          </div>
          {/*<-------------- Table of Files --------------> */}
          <TableFiles id_folder={id_folder} files={files} dataPages={dataPages} SelectFile={SelectFile} trash={trash} folderName={folderName} from="admin" textSearch={textSearch} setFiles={setFiles} setDataPages={setDataPages} />
        </div>
      </div>
    </div>
  )
}
export default Files;
