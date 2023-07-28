'use client'
import { ChatBubbleIcon, DownloadIcon, EyeOpenIcon, MagnifyingGlassIcon, Pencil2Icon, Share1Icon, StarFilledIcon, StarIcon, TrashIcon, UploadIcon } from '@radix-ui/react-icons';
import Image from 'next/image'
import React, { useState, useContext, useEffect } from 'react'
import { FileIcon } from '@radix-ui/react-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import folder from '../../../../public/icons/folder.svg'
import Link from 'next/link'
import DownloadsFile from '../../Clients&Admin/Files/downloadFiles';
import deleteFiles from '../../Clients&Admin/Files/deleteFiles';
import { Files } from '../../../types/files'
import { userContext } from '../../../app/Context/contextUser';
import { GetFilesClient, GetFilesToFavorites } from '../../../Utils/Firebase/Files/getFiles';
import { companyContext } from '../../../app/Context/contextCompany';
import { loadingContext } from '@/src/app/Context/contextLoading';
import downloadsFile from '../../Clients&Admin/Files/downloadFiles';
import { Filter } from '@/src/types/others';
import { VerifyFiles } from '@/src/Utils/Other/VerifyFiles';
import { UploadFiles } from '../../Clients&Admin/Files/UploadFiles';
import DocTable from '../../Clients&Admin/Files/DocTable';
import FormatSizeFile from '@/src/Utils/Other/FormatSizeFile';
import { FormatDate } from '@/src/Utils/Other/FormatDate';
import favoriteFile from '../../Clients&Admin/Files/favoriteFile';
import iconAddFile from '../../../../public/icons/addFile.svg';
import iconSearchFile from '../../../../public/icons/searchFile.svg';
import { FilterAlphabetical, FilterDate, FilterSize, FilterStatus } from '@/src/Utils/Other/Filters';
import Message from '../../Clients&Admin/Files/message';
import ViewFile from '../../Clients&Admin/Files/viewFile';
import MoveTo from '../../Admin/Files/moveTo';
import CopyTo from '../../Admin/Files/copyTo';
import Rename from '../../Clients&Admin/Files/rename';

function Files() {
  //<--------------------------------- Params Vars --------------------------------->
  const params: any = useSearchParams()
  const folderName: string = params.get("folderName");
  const id_folder: string = params.get("id_folder");
  const id_enterprise: string = params.get("id_enterprise");

  //<--------------------------------- Context Vars --------------------------------->
  const { dataUser } = useContext(userContext)
  const { dataCompany } = useContext(companyContext)
  const { setLoading } = useContext(loadingContext);

  //<--------------------------------- State vars --------------------------------->
  const [files, setFiles] = useState<Files[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Files[]>([]);
  const [dataPages, setDataPages] = useState<{ page: number, maxPages: number }>({ page: 1, maxPages: 1 });
  const [dropdownState, setDropdownState] = useState<boolean>(true);
  const [textSearch, setTextSearch] = useState<string>('');
  const [filter, setFilter] = useState<Filter>({name: 'asc', size: 'asc', date: 'asc', status: 'asc'});
  const [viewFile, setViewFile] = useState<{status: boolean, file?: Files}>({status: false});
  const [moveFile, setMoveFile] = useState<{status: boolean, file?: Files}>({status: false});
  const [copyFile, setCopyFile] = useState<{status: boolean, file?: Files}>({status: false});
  const [renameFile, setRenameFile] = useState<{status: boolean, file?: Files}>({status: false});
  const [modalMessage, setModalMessage] = useState<{status:boolean, action:'view' | 'edit', file?: Files}>({status:false, action:'view'});

  //<--------------------------------- Other vars --------------------------------->
  const router = useRouter();
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    const result = await VerifyFiles({files: Array.from(e.dataTransfer.files)})
    const newFiles = await UploadFiles({
      id_company: dataCompany.id,
      id_user: dataUser.id,
      id_enterprise: id_enterprise,
      id_folder: id_folder,
      files: result,
      from: 'user',
      maxSize: dataCompany.maxSize
    })
    if(newFiles && newFiles.files) {
      setFiles((files) => {
        const result = files.concat(newFiles.files);
        const maxPages = Math.ceil(result.length / 10)
        var page = dataPages.page
        if (maxPages < dataPages.page) {
          page = maxPages
        }
        setDropdownState(true)
        setDataPages({ maxPages: maxPages, page: page })
        return result
      })
    }
  };

  useEffect(() => {
    setLoading(true);
    getFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUser])

  async function getFiles() {
    const response = await verifyFolder();
    if (folderName === "Favoritos" && response.status === 200) {
      await GetFilesToFavorites({ id_company: dataUser.id_company, id_user: dataUser.id, id_enterprise: id_enterprise, setFiles, setDataPages });
    } else {
      await GetFilesClient({ id_user: dataUser.id, id_company: dataUser.id_company, id_enterprise: id_enterprise, id_folder: id_folder, setFiles, setDataPages })
    }
    setLoading(false)
  }

  async function verifyFolder() {
    let enterprise = dataUser.enterprises.find((data) => data.id === id_enterprise)
    let mockFolder = enterprise?.folders.find((folder) => folder.name === folderName);

    if (mockFolder?.isPrivate === true) {
      router.push("Dashboard/Clientes/Pastas");
      return {status: 401, message: "Cliente não autorizado a acessar essa pasta."}
    }

    return {status: 200, message: "Cliente autorizado a acessar essa pasta."};
  }

  // <--------------------------------- Select File --------------------------------->
  async function selectFile(index: number) {
    if (files.filter((file) => file.checked === true).length > 9 && files[index].checked === false) {
      throw toast.error("Você só pode selecionar 10 arquivos");
    } else {
      const allFiles = [...files];
      allFiles[index].checked = !allFiles[index].checked;
      const fileSelect = allFiles.filter((file) => file.checked === true);
      setSelectedFiles(fileSelect);
      setFiles(allFiles);
    }
  }


  async function deleteFilesHandle(selectedFiles: Files[]) {
    if (selectedFiles.length === 0) {
      throw toast.error("Selecione um arquivo para excluir.")
    }

    const toastMessage = { pending: `Deletando ${selectedFiles.length > 1 ? 'arquivos' : 'arquivo'}...`, success: `${selectedFiles.length > 1 ? 'Seus arquivos foram deletados' : 'Seu arquivo foi deletado'}.`, error: `Não foi possível deletar ${selectedFiles.length > 1 ? 'o arquivo' : 'os arquivos'}.` };
    const response = await toast.promise(deleteFiles({ files: files, selectedFiles: selectedFiles, id_company: dataCompany.id }), toastMessage);

    if(response) {
      const maxPages = Math.ceil(response.length / 10)
      var page = dataPages.page
      if (maxPages < dataPages.page) {
        page = maxPages
      }
      setFiles([...response])
      setDropdownState(true)
      setSelectedFiles([]);
      setDataPages({ maxPages: maxPages, page: page })
    }

  }

  async function downloadFiles(selectedFiles: Files[]) {
    if (selectedFiles.length === 0) {
      throw toast.error("Selecione um arquivo para baixar.")
    }

    const result = await downloadsFile({ selectFiles: selectedFiles, files: files, from: "user", id_folder: id_folder })

    if(result) {
      setFiles([...files]);
      setDropdownState(true);
      setSelectedFiles([]);
    }
  }

  function changeFilter(button: "name" | "size" | "date" | "status") {
    switch(button) {
      case "name":
        const result = FilterAlphabetical({ data: files, action: filter.name })
        setFilter({ name: filter.name === 'asc' ? 'desc' : 'asc', size: 'asc', date: 'asc', status: 'asc'});
        break;
      case "size":
        const result2 = FilterSize({ data: files, action: filter.size })
        setFilter({ name: 'asc', size: filter.size === 'asc' ? 'desc' : 'asc', date: 'asc', status: 'asc'});
        break;
      case "date":
        const result3 = FilterDate({ data: files, action: filter.date })
        setFilter({ name: 'asc', size: 'asc', date: filter.date === 'asc' ? 'desc' : 'asc', status: 'asc'});
        break;
      case "status":
        const result4 = FilterStatus({ data: files, action: filter.status! })
        setFilter({ name: 'asc', size: 'asc', date: 'asc', status: filter.status === 'asc' ? 'desc' : 'asc'});
        break;
    }
  }

  async function getInputFiles(files){
    const result = await VerifyFiles({files})
    const newFiles = await UploadFiles({
      id_company: dataCompany.id,
      id_user: dataUser.id,
      id_enterprise: id_enterprise,
      id_folder: id_folder,
      files: result,
      from: 'user',
      maxSize: dataCompany.maxSize
    })
    if(newFiles && newFiles.files) {
      setFiles((files) => {
        const result = files.concat(newFiles.files);
        const maxPages = Math.ceil(result.length / 10)
        var page = dataPages.page
        if (maxPages < dataPages.page) {
          page = maxPages
        }
        setDropdownState(true)
        setDataPages({ maxPages: maxPages, page: page })
        return result
      })
    }
  }

  return (
    //     <p className=' font-poiretOne text-[40px] max-sm:text-[35px]'>Documentos</p>
    //     <div className='flex items-top overflow-hidden items-center'>
    //       <Image src={folder} alt="Imagem de uma pasta" className='min-w-[19px] min-h-[19px]' />
    //       <Link href={{ pathname: "Dashboard/Clientes/Pastas", query: { id_enterprise: id_enterprise } }} className='text-[18px] flex mx-[5px] text-secondary whitespace-nowrap'>{"Pastas  >"}</Link>
    //       <FileIcon className={'min-w-[19px] min-h-[19px] text-secondary'} />
    //       <p className='text-[18px] flex mx-[5px] text-secondary whitespace-nowrap'>{folderName}</p>
    //     </div>
    //     <div className=' w-full relative border-[2px] border-terciary dark:border-dterciary mt-[30px] max-md:mt-[15px] rounded-[8px]'>
    //       <div className='mt-[10px] flex justify-between mx-[20px] max-sm:mx-[5px]'>
    //         <div className='flex items-center bg-transparent'>
    //           <p className='mr-[20px] max-sm:mr-[5px] text-[20px] font-[500] max-md:text-[18px] max-sm:text-[16px] max-lsm:text-[14px]'>{files.length} <span className='text-black dark:text-white'>Documentos</span></p>
    //           <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px]" />
    //           <input type="text" onChange={(Text) => setTextSearch(Text.target.value)} className='w-[300px] text-black max-lg:w-[250px] max-md:w-[200px] max-sm:w-[120px] max-lsm:w-[100px] bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px] dark:placeholder:text-gray-500' placeholder='Buscar' ></input>
    //         </div>
    //         <div className={`flex gap-[10px] max-lg:flex-col max-lg:absolute max-lg:right-[0] ${menu ? "" : "max-lg:bg-white/30 dark:max-lg:bg-black/30 backdrop-blur"} max-lg:top-[0] max-lg:px-[5px] max-lg:pb-[5px]`}>
    //           <button id="MenuTable" aria-label="Botão menu da tabela" onClick={() => setMenu(!menu)} className={`flex-col self-center hidden max-lg:flex ${menu ? "mt-[10px]" : "mt-[20px]"}  mb-[10px]`}>
    //             <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black dark:bg-white transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "rotate-45"}`} />
    //             <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black dark:bg-white my-[8px] max-lsm:my-[5px] transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "hidden"}`} />
    //             <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black dark:bg-white transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "rotate-[135deg] mt-[-3px]"}`} />
    //           </button>
    //           <button onClick={() => downloadFiles(selectedFiles)} className={` border-[2px] ${selectedFiles.length > 0 ? "bg-blue/40 border-blue text-white" : "bg-hilight border-terciary text-strong"} p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>Download</button>
    //           <UploadFile folderName={folderName} id_folder={id_folder} files={files} childToParentDownload={childToParentDownload} id_enterprise={id_enterprise} permission={dataUser?.permission} id_user={dataUser?.id} id_company={dataUser?.id_company} menu={menu} from={"user"} />
    //         </div>
    //       </div>
    //       {/*<-------------- Table of Files --------------> */}
    //       <TableFiles id_folder={id_folder} dataPages={dataPages} files={files} DeleteFile={deleteFiles} childToParentDownload={childToParentDownload} SelectFile={selectFile} folderName={folderName} trash={false} from={"user"} setFiles={setFiles} textSearch={textSearch} setDataPages={setDataPages} />
    //     </div>
    //   </div>
    // </div>

    <div className="bg-primary dark:bg-dprimary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black">
      <div className='w-full h-full mt-[42px]'>
        <p className=' font-poiretOne text-[40px] max-sm:text-[35px] dark:text-white'>Documentos</p>
        <div className='flex items-center overflow-hidden mb-[35px]'>
          <Link href={'/Dashboard/Clientes/Pastas'} className="flex cursor-pointer items-center mr-1">
            <Image width={21} height={21} src={folder} alt="Imagem de uma pasta" className='mr-1' />
            <p className="cursor-pointer text-[18px] max-sm:mr-[0px] max-sm:text-[16px] whitespace-nowrap text-secondary">
              {"Pastas >"}
            </p>
          </Link>
          <FileIcon width={21} height={21} className={'text-secondary mr-1'} />
          <p className='text-[18px] flex text-secondary dark:text-dsecondary max-sm:text-[16px] whitespace-nowrap'>{folderName}</p>
        </div>

        <div>
          <label onDrop={handleDrop} onDragOver={handleDragOver} className='cursor-pointer hover:bg-[#e4e4e4] bg-primary border-dashed border-[3px] border-[#AAAAAA] rounded-[12px] w-full max-sm:w-[410px] max-lsm:w-[340px] h-[250px] drop-shadow-[0_0  _10px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center'>
              <UploadIcon className='text-[#9E9E9E] w-[48px] h-[56px]'/>
              <p className='text-[20px] max-sm:text-[18px] text-center'>Arraste um arquivo ou faça um <span className='text-hilight underline'>upload</span></p>
              <input onChange={(e) => getInputFiles(e.target.files)} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
          </label>
        </div>

        {modalMessage.status && <Message admin={false} modalMessage={modalMessage} setModalMessage={setModalMessage} setFiles={setFiles}/>}
        {viewFile.status && <ViewFile admin={false} file={viewFile.file!} setFiles={setFiles} setViewFile={setViewFile}/>}
        {moveFile.status && <MoveTo files={files} moveFile={moveFile} setMoveFile={setMoveFile} setFiles={setFiles}/>}
        {copyFile.status && <CopyTo admin={false} copyFile={copyFile} setCopyFile={setCopyFile} />}
        {renameFile.status && <Rename setFiles={setFiles} renameFile={renameFile} setRenameFile={setRenameFile}/>}
        <DocTable.Root>
          <DocTable.Header className={`${files.filter((file) => textSearch !== '' && file.name.toUpperCase().includes(textSearch.toUpperCase())).length === 0 && "border-b border-b-secondary"}`}>
            <DocTable.Count count={textSearch === '' ? files.length : files.filter((file) => textSearch !== '' && file.name.toUpperCase().includes(textSearch.toUpperCase())).length} />
            <DocTable.Search onChange={(text) => setTextSearch(text.target.value)} placeholder="Buscar" />
            <DocTable.GlobalActions setDropdownState={setDropdownState} dropdownState={dropdownState}>
              <DocTable.GlobalAction onClick={() => downloadFiles(selectedFiles)} dropdownState={dropdownState} className={`${selectedFiles.length > 0 ? "" : "cursor-not-allowed hover:brightness-100 text-[#AAAAAA] bg-[#D9D9D9] border-[2px] border-[#9E9E9E]"}`}>Download</DocTable.GlobalAction>
              {/* <DocTable.GlobalAction onClick={() => deleteFiles(selectFiles)} dropdownState={dropdownState} className={`${selectFiles.length > 0 ? "bg-[#BE0000] border-[#970000]" : "cursor-not-allowed hover:brightness-100 text-[#AAAAAA] bg-[#D9D9D9] border-[2px] border-[#9E9E9E]"}`} >Deletar</DocTable.GlobalAction> */}
            </DocTable.GlobalActions>
          </DocTable.Header>
          {files.filter((file) => textSearch != "" ?  file.name?.toUpperCase().includes(textSearch.toUpperCase()) : true).length > 0 ?
          <DocTable.Content>
            <DocTable.Heading className="grid-cols-[60px_1fr_120px_200px_140px_150px] max-lg:grid-cols-[60px_1fr_120px_140px_150px] max-md:grid-cols-[60px_1fr_140px_150px] max-sm:grid-cols-[60px_1fr_150px]">
              <DocTable.GlobalCheckbox />
              <DocTable.Filter label="Nome" arrow active={filter.name} onClick={() => changeFilter("name")}/>
              <DocTable.Filter label="Tamanho" arrow active={filter.size} className="max-md:hidden justify-center" onClick={() => changeFilter("size")}/>
              <DocTable.Filter label="Data de Upload" arrow active={filter.date} className="max-lg:hidden" onClick={() => changeFilter("date")}/>
              <DocTable.Filter label="Status" arrow active={filter.status!} className="max-sm:hidden justify-center" onClick={() => changeFilter("status")}/>
              <DocTable.Filter label="Ações" className="cursor-default justify-center"/>
            </DocTable.Heading>
            <DocTable.Files>
              {files
              .filter((file) => textSearch != "" ? file.name?.toUpperCase().includes(textSearch.toUpperCase()) : true)
              .map((file: Files, index) => {
                if((dataPages.page * 10 - (11)) < index && index < dataPages.page * 10){
                return(
                  <DocTable.File key={index} className={`grid-cols-[60px__1fr_120px_200px_140px_150px] max-lg:grid-cols-[60px__1fr_120px_140px_150px] max-md:grid-cols-[60px__1fr_140px_150px] max-sm:grid-cols-[60px__1fr_150px] ${(index % 9 === 0 && index !== 0) && 'border-none'}`}>
                    <DocTable.FileCheckbox checked={file.checked} onClick={() => selectFile(index)} />
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
                        <DocTable.Message notification={file.messageNotif} from={file.from} admin={false} onClick={() => setModalMessage({status: true, action: 'view', file: file})} iconClassName="cursor-pointer"/> :
                        <></>
                      }
                      <DocTable.Options>
                        <DocTable.OptionsItem dropdownClassName="rounded-t-[6px]" onClick={() => setViewFile({status: true, file: file})}>
                          <DocTable.OptionsItemIcon><EyeOpenIcon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Visualizar</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        <DocTable.OptionsItem onClick={() => downloadFiles([file])}>
                          <DocTable.OptionsItemIcon><DownloadIcon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Baixar</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        {file.from === 'user' &&
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
                        }
                        <DocTable.OptionsItem onClick={() => setCopyFile({status: true, file: file})}>
                          <DocTable.OptionsItemIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 15 15" fill="none" className="stroke-[#686868] group-hover:stroke-white">
                              <path d="M1.875 10V2.5C1.875 1.80964 2.43464 1.25 3.125 1.25H9.375M5.625 13.75H11.25C11.9404 13.75 12.5 13.1904 12.5 12.5V5C12.5 4.30964 11.9404 3.75 11.25 3.75H5.625C4.93464 3.75 4.375 4.30964 4.375 5V12.5C4.375 13.1904 4.93464 13.75 5.625 13.75Z" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Copiar</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        {file.from === 'user' && 
                        <DocTable.OptionsItem onClick={() => setRenameFile({status: true, file: file})}>
                          <DocTable.OptionsItemIcon><Pencil2Icon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Renomear</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        }
                        {file.from === 'user' && file.favorite ?
                        <DocTable.OptionsItem onClick={() => favoriteFile({file: file, setFiles: setFiles, folderName: folderName})}>
                          <DocTable.OptionsItemIcon><StarIcon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Desfavoritar</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem> : file.from === 'user' &&
                        <DocTable.OptionsItem onClick={() => favoriteFile({file: file, setFiles: setFiles, folderName: folderName})}>
                          <DocTable.OptionsItemIcon><StarFilledIcon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Favoritar</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        }
                        {file.from === 'user' &&
                        <DocTable.OptionsItem onClick={() => setModalMessage({status: true, action: "edit", file: file})}>
                          <DocTable.OptionsItemIcon><ChatBubbleIcon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Definir observação</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        }
                        {file.from === 'user' &&
                        <DocTable.OptionsItem onClick={() => deleteFilesHandle([file])} dropdownClassName="rounded-b-[6px] hover:bg-[#BE0000]">
                          <DocTable.OptionsItemIcon><TrashIcon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Excluir</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        }
                      </DocTable.Options>
                    </DocTable.FileActions>
                  </DocTable.File>
                )}
              })}
            </DocTable.Files>
          </DocTable.Content> : 
          <div className='w-full h-[500px] flex justify-center items-center flex-col'>
            <Image src={files.length <= 0 ? iconAddFile : iconSearchFile} width={180} height={180}  alt="Imagem de 2 arquivos" priority className='w-[180px] h-[180px]'/>
            <p className='font-poiretOne text-[#686868] text-[40px] max-sm:text-[30px]'>{textSearch.length <= 0 ? 'Nenhum arquivo foi encontrado' : 'Nenhum resultado foi encontrado'}</p>
          </div>
          }
          <DocTable.Footer textSearch={textSearch} files={files} dataPages={dataPages} setDataPages={setDataPages} />
        </DocTable.Root>
      </div>
    </div>
  )
}
export default Files;
