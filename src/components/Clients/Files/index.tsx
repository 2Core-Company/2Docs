'use client'
import { ChatBubbleIcon, DownloadIcon, EyeOpenIcon, MagnifyingGlassIcon, Pencil2Icon, Share1Icon, StarFilledIcon, StarIcon, TrashIcon, UploadIcon } from '@radix-ui/react-icons';
import Image from 'next/image'
import React, { useState, useContext, useEffect, useRef } from 'react'
import { FileIcon } from '@radix-ui/react-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import folderIcon from '../../../../public/icons/folder.svg'
import Link from 'next/link'
import DownloadsFile from '../../Clients&Admin/Files/downloadFiles';
import deleteFiles from '../../Clients&Admin/Files/deleteFiles';
import { Files } from '../../../types/files'
import { userContext } from '../../../app/Context/contextUser';
import { getFilesClient, getFilesToFavorites } from '../../../Utils/Firebase/Files/getFiles';
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
import { Folders } from '@/src/types/folders';

function Files() {
  //<--------------------------------- Params Vars --------------------------------->
  const params: any = useSearchParams();
  const id_folder: string = params.get("id_folder");
  const id_enterprise: string = params.get("id_enterprise");

  //<--------------------------------- Context Vars --------------------------------->
  const { dataUser } = useContext(userContext)
  const { dataCompany } = useContext(companyContext)
  const { setLoading } = useContext(loadingContext);

  //<--------------------------------- State vars --------------------------------->
  const [folder, setFolder] = useState<Folders>({name: '', color: '', isPrivate: false, singleDownload: false, onlyMonthDownload: false, timeFile: 3, id: ''});
  const [files, setFiles] = useState<Files[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Files[]>([]);
  const [dataPages, setDataPages] = useState<{ page: number, maxPages: number }>({ page: 1, maxPages: 1 });
  const [dropdownState, setDropdownState] = useState<boolean>(true);
  const [textSearch, setTextSearch] = useState<string>('');
  const [filter, setFilter] = useState<Filter>({name: 'asc', size: 'asc', date: 'asc', status: 'asc'});
  const [viewFile, setViewFile] = useState<{status: boolean, file?: Files}>({status: false});
  // const [moveFile, setMoveFile] = useState<{status: boolean, file?: Files}>({status: false});
  // const [copyFile, setCopyFile] = useState<{status: boolean, file?: Files}>({status: false});
  const [renameFile, setRenameFile] = useState<{status: boolean, file?: Files}>({status: false});
  const [modalMessage, setModalMessage] = useState<{status:boolean, action:'view' | 'edit', file?: Files}>({status:false, action:'view'});
  const [globalCheckbox, setGlobalCheckbox] = useState<{status: 'off' | 'on' | 'half'}>({status: 'off'});
  const fileInputRef = useRef<any>(null);

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

    fileInputRef.current.value = ''
    
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
  }, [dataUser]);

  useEffect(() => {
    if(textSearch != '') {
      const searchingNumberFiles = files.filter((file) => file.name.toUpperCase().includes(textSearch.toUpperCase()) ? true : false).length;

      setDataPages({
        page: dataPages.page <= Math.ceil(searchingNumberFiles / 10) ? dataPages.page : Math.ceil(searchingNumberFiles / 10),
        maxPages: Math.ceil(searchingNumberFiles / 10)
      });

      if(dataPages.page <= 0) {
        setDataPages({
          ...dataPages,
          page: 1
        })
      }
    } else {
      setDataPages({
        page: 1,
        maxPages: Math.ceil(files.length / 10)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textSearch]);

  async function getFiles() {
    const fetchFolder = await verifyFolder();
    if (fetchFolder && fetchFolder.name === 'Favoritos') {
      await getFilesToFavorites({ id_company: dataUser.id_company, id_user: dataUser.id, id_enterprise: id_enterprise, setFiles, setDataPages });
    } else {
      await getFilesClient({ id_user: dataUser.id, id_company: dataUser.id_company, id_enterprise: id_enterprise, id_folder: id_folder, setFiles, setDataPages })
    }
    setLoading(false)
  }

  async function verifyFolder() {
    let enterprise = dataUser.enterprises.find((data) => data.id === id_enterprise)
    let mockFolder = enterprise?.folders.find((folder) => folder.id === id_folder);

    if (mockFolder && mockFolder.isPrivate === true) {
      router.replace("/Dashboard/Clientes/Pastas");
    } else if(mockFolder) {
      setFolder(mockFolder);
    }

    return mockFolder;
  }

  // <--------------------------------- Select File --------------------------------->
  async function selectFile(index: number) {
    if (files.filter((file) => file.checked === true).length > 9 && files[index].checked === false) {
      throw toast.error("Você só pode selecionar 10 arquivos");
    } else {
      const allFiles = [...files];
      allFiles[index].checked = !allFiles[index].checked;

      if(allFiles[index].checked === false && globalCheckbox.status === 'on') {
        setGlobalCheckbox({status: 'half'});
      }

      const fileSelect = allFiles.filter((file) => file.checked === true);
      setSelectedFiles(fileSelect);

      const indexRange = {
        start: dataPages.page * 10 - 10,
        end: dataPages.page * 10 - 1
      }

      const filesOnPage = files.filter((file, index) => {
        if(index >= indexRange.start && index <= indexRange.end ) {
          return file;
        }
      })

      if(fileSelect.length === 0) {
        setGlobalCheckbox({status: 'off'});
      } else if(fileSelect.length === filesOnPage.length || fileSelect.length === 10) {
        setGlobalCheckbox({status: 'on'});
      }

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
      setGlobalCheckbox({status: 'off'});
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

  function unselectAllFiles() {
    setGlobalCheckbox({status: 'off'});
    const unselectFiles = files.map((file) => {
      file.checked = false;
      return file;
    })
    setFiles(unselectFiles);
    setSelectedFiles([]);
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
    fileInputRef.current.value = ''
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

  function handleGlobalCheckbox() {
    const indexRange = {
      start: dataPages.page * 10 - 10,
      end: dataPages.page * 10 - 1
    }

    if(globalCheckbox.status === 'off' || globalCheckbox.status === 'half') {
      let filesSelected: Files[] = [];
      const newFiles = files.filter((file) => textSearch == null || file.name?.toUpperCase().includes(textSearch.toUpperCase()) ? true : false).map((file: Files, index) => {
        if(index >= indexRange.start && index <= indexRange.end ) {
          file.checked = true;
          filesSelected.push(file);
        }
        return file;
      });
      setSelectedFiles(filesSelected);
      setGlobalCheckbox({status: 'on'});
      setFiles(newFiles);
    } else {
      const newFiles = files.filter((file) => textSearch == null || file.name?.toUpperCase().includes(textSearch.toUpperCase()) ? true : false).map((file: Files, index) => {
        if(index >= indexRange.start && index <= indexRange.end) {
          file.checked = false;
        }
        return file;
      });
      setSelectedFiles([]);
      setGlobalCheckbox({status: 'off'});
      setFiles(newFiles);
    }
  }

  return ( 
    <div className="bg-primary dark:bg-dprimary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black">
      <div className='w-full h-full mt-[42px]'>
        <p className=' font-poiretOne text-[40px] max-sm:text-[35px] dark:text-white'>Documentos</p>
        <div className='flex items-center overflow-hidden mb-[35px]'>
          <Link href={'/Dashboard/Clientes/Pastas'} className="flex cursor-pointer items-center mr-1">
            <Image width={21} height={21} src={folderIcon} alt="Imagem de uma pasta" className='mr-1' />
            <p className="cursor-pointer text-[18px] max-sm:mr-[0px] max-sm:text-[16px] whitespace-nowrap text-secondary">
              {"Pastas >"}
            </p>
          </Link>
          <FileIcon width={21} height={21} className={'text-secondary mr-1'} />
          <p className='text-[18px] flex text-secondary dark:text-dsecondary max-sm:text-[16px] whitespace-nowrap'>{folder.name}</p>
        </div>

        <div className={`${folder.name !== 'Cliente' && 'hidden'}`}>
          <label onDrop={handleDrop} onDragOver={handleDragOver} className='cursor-pointer hover:bg-[#e4e4e4] bg-primary border-dashed border-[3px] border-[#AAAAAA] rounded-[12px] w-full h-[250px] flex flex-col items-center justify-center'>
              <UploadIcon className='text-[#9E9E9E] w-[48px] h-[56px]'/>
              <p className='text-[20px] max-sm:text-[18px] text-center'>Arraste um arquivo ou faça um <span className='text-hilight underline'>upload</span></p>
              <input ref={fileInputRef} onChange={(e) => getInputFiles(e.target.files)} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
          </label>
        </div>

        {modalMessage.status && <Message admin={false} modalMessage={modalMessage} setModalMessage={setModalMessage} setFiles={setFiles}/>}
        {viewFile.status && <ViewFile admin={false} file={viewFile.file!} setFiles={setFiles} setViewFile={setViewFile}/>}
        {/* {moveFile.status && <MoveTo files={files} moveFile={moveFile} setMoveFile={setMoveFile} setFiles={setFiles}/>}
        {copyFile.status && <CopyTo admin={false} copyFile={copyFile} setCopyFile={setCopyFile} />} */}
        {renameFile.status && <Rename setFiles={setFiles} renameFile={renameFile} setRenameFile={setRenameFile}/>}
        <DocTable.Root>
          <DocTable.Header className={`${files.filter((file) => textSearch !== '' && file.name.toUpperCase().includes(textSearch.toUpperCase())).length === 0 && "border-b border-b-secondary"}`}>
            <DocTable.Count count={textSearch === '' ? files.length : files.filter((file) => textSearch !== '' && file.name.toUpperCase().includes(textSearch.toUpperCase())).length} />
            <DocTable.Search onChange={(text) => setTextSearch(text.target.value)} placeholder="Buscar" />
            <DocTable.GlobalActions setDropdownState={setDropdownState} dropdownState={dropdownState}>
              <DocTable.GlobalAction onClick={() => downloadFiles(selectedFiles)} dropdownState={dropdownState} className={`${selectedFiles.length > 0 ? "" : "cursor-not-allowed hover:brightness-100 text-[#AAAAAA] bg-[#D9D9D9] border-[2px] border-[#9E9E9E]"}`}>Download</DocTable.GlobalAction>
              {folder.name === 'Cliente' &&
                <DocTable.GlobalAction onClick={() => deleteFilesHandle(selectedFiles)} dropdownState={dropdownState} className={`${selectedFiles.length > 0 ? "bg-[#BE0000] border-[#970000]" : "cursor-not-allowed hover:brightness-100 text-[#AAAAAA] bg-[#D9D9D9] border-[2px] border-[#9E9E9E]"}`} >Deletar</DocTable.GlobalAction>
              }
            </DocTable.GlobalActions>
          </DocTable.Header>
          {files.filter((file) => textSearch != "" ?  file.name?.toUpperCase().includes(textSearch.toUpperCase()) : true).length > 0 ?
          <DocTable.Content>
            <DocTable.Heading className="grid-cols-[60px_1fr_120px_240px_140px_80px] max-lg:grid-cols-[60px_1fr_120px_140px_80px] max-md:grid-cols-[60px_1fr_140px_80px] max-sm:grid-cols-[60px_1fr_80px]">
              <DocTable.GlobalCheckbox onChange={() => handleGlobalCheckbox()} checked={globalCheckbox.status === 'on' ? true : false} handle={globalCheckbox.status === 'on' ? true : false} half={globalCheckbox.status === 'half' ? true : false}/>
              <DocTable.Filter label="Nome" arrow active={filter.name} onClick={() => changeFilter("name")}/>
              <DocTable.Filter label="Tamanho" arrow active={filter.size} colClassName="max-md:hidden" onClick={() => changeFilter("size")}/>
              <DocTable.Filter label="Data de Upload" arrow active={filter.date} colClassName="max-lg:hidden" onClick={() => changeFilter("date")}/>
              <DocTable.Filter label="Status" arrow active={filter.status!} colClassName="max-sm:hidden justify-center" onClick={() => changeFilter("status")}/>
              <DocTable.Filter label="Ações" colClassName="justify-center" className="cursor-default"/>
            </DocTable.Heading>
            <DocTable.Files>
              {files
              .filter((file) => textSearch != "" ? file.name?.toUpperCase().includes(textSearch.toUpperCase()) : true)
              .map((file: Files, index) => {
                if((dataPages.page * 10 - (11)) < index && index < dataPages.page * 10){
                return(
                  <DocTable.File key={index} className={`grid-cols-[60px_1fr_120px_240px_140px_80px] max-lg:grid-cols-[60px_1fr_120px_140px_80px] max-md:grid-cols-[60px_1fr_140px_80px] max-sm:grid-cols-[60px_1fr_80px] ${(index % 9 === 0 && index !== 0) && 'border-none'}`}>
                    <DocTable.FileCheckbox checked={file.checked} onClick={() => selectFile(index)} />
                    <DocTable.Data>
                      <DocTable.Icon>
                        <Image src={`/icons/${file.type}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={30} height={30} className="mr-[23px] w-[30px] h-[30px] max-lg:w-[25px] max-lg:h-[25px]" />
                      </DocTable.Icon>
                      <DocTable.Text className="text-[#000] font-[400] truncate max-2xl:w-[400px] max-xl:w-[220px] max-lsm:w-[150px]">{file.name}</DocTable.Text>
                    </DocTable.Data>
                    <DocTable.Data className="justify-center gap-1 hidden md:block">
                      <DocTable.Text>{FormatSizeFile(file.size)[0]}</DocTable.Text>
                      <DocTable.Label>{FormatSizeFile(file.size)[1]}</DocTable.Label>
                    </DocTable.Data>
                    <DocTable.Data className="hidden lg:block">
                      <DocTable.Text>{FormatDate(file.created_date)}</DocTable.Text>
                    </DocTable.Data>
                    <DocTable.Data className="hidden sm:block">
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
                        {/* {file.from === 'user' &&
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
                        </DocTable.OptionsItem> */}
                        {file.from === 'user' && 
                        <DocTable.OptionsItem onClick={() => setRenameFile({status: true, file: file})}>
                          <DocTable.OptionsItemIcon><Pencil2Icon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Renomear</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem>
                        }
                        {file.favorite ?
                        <DocTable.OptionsItem onClick={() => favoriteFile({file: file, setFiles: setFiles, folderName: folder.name})}>
                          <DocTable.OptionsItemIcon><StarIcon width={18} height={18} className="text-[#686868] group-hover:text-white"/></DocTable.OptionsItemIcon>
                          <DocTable.OptionsItemLabel>Desfavoritar</DocTable.OptionsItemLabel>
                        </DocTable.OptionsItem> :
                        <DocTable.OptionsItem onClick={() => favoriteFile({file: file, setFiles: setFiles, folderName: folder.name})}>
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
          <DocTable.Footer textSearch={textSearch} files={files} dataPages={dataPages} setDataPages={setDataPages} unselectFunction={() => unselectAllFiles()} />
        </DocTable.Root>
      </div>
    </div>
  )
}
export default Files;
