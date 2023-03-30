import React, { useState, useEffect } from 'react'
import iconAddFile from '../../../../public/icons/addFile.svg'
import ArrowFilter from '../../../../public/icons/arrowFilter.svg'
import iconSearchFile from '../../../../public/icons/searchFile.svg' 
import Image from 'next/image'
import DownloadsFile from './dowloadFiles'
import { Filter, Files} from '../../../types/interfaces'
import OptionsFile  from './options'
import Message from './message'
import { FormatDate } from '../../../Utils/Other/FormatDate'
import { FilterAlphabetical, FilterSize, FilterDate, FilterStatus } from '../../../Utils/Other/Filters'

interface Props{
  filesFilter:Files[]
  pages:number
  trash:boolean
  files:Files[]
  folderName:string
  from:string
  SelectFile:Function
  setFilesFilter:Function
  ConfirmationDeleteFile?:Function
  childToParentDownload:Function
}

export default function TableFiles({ pages, trash, filesFilter, files, folderName, from, setFilesFilter, SelectFile, ConfirmationDeleteFile, childToParentDownload}:Props) {
  const [filter, setFilter] = useState<Filter>({name: false, size:false, date:false, status:false})
  const [showItens, setShowItens] = useState({min:-1, max:10})
  const url = window.location.href
  const [messageEmpty, setMessageEmpty] = useState<string>()

  useEffect(() => {
    if(url.includes("Clientes") === true  && folderName === "Cliente" ){
      setMessageEmpty("Envie seu primeiro arquivo!")
    } else if(url.includes("Admin") === true  && folderName != "Cliente") {
      setMessageEmpty("Envie seu primeiro arquivo!")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

   // <--------------------------------- Select Files --------------------------------->
  function SelectAllFiles(){
    var i = showItens.max - 10
    for(i; showItens.max > i; i++){
      if(filesFilter[i]){
        SelectFile(i)
      } else{
        break
      }
    }
  }

   // <--------------------------------- Download Files --------------------------------->
  function DownloadFile(file){
    DownloadsFile({filesDownloaded:[file], files:files, from:from, childToParentDownload:childToParentDownload})
  }


  return (
    <>
      {filesFilter.length > 0 ?
        <>
          {/* <--------------------------------- HeadTable ---------------------------------> */}
          <div className="w-full mt-[10px] grid grid-cols-[20px__1fr_120px_200px_110px_70px] max-lg:grid-cols-[20px__1fr_120px_110px_70px] max-md:grid-cols-[20px__1fr_110px_70px] max-sm:grid-cols-[20px__1fr_70px] gap-x-[15px] text-[18px] font-[500] border-y-[1px] border-y-neutral-400  bg-neutral-300  items-center py-[5px]">
            <button aria-label="checkbox demonstrativo" onClick={() => SelectAllFiles()} className='w-[22px] h-[22px] cursor-pointer bg-white rounded-[4px] ml-[5px] border-[1px] border-black'/>
            
            <button id="filterName" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({name:!filter.name, status: false, date:false, size:false}), FilterAlphabetical({dataFilter:filesFilter, filter:filter, setReturn:setFilesFilter}))} className='flex items-center cursor-pointer'>
              <p className="dark:text-white">Nome</p> 
              <Image alt="Imagem de uma flecha" className={`ml-[5px] ${filter.name ? "rotate-180" : ""}`}src={ArrowFilter}/>
            </button>

            <button id="filterSize" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({size:! filter.size, name:false, status: false, date:false}), FilterSize({dataFilter:filesFilter, filter:filter, setReturn:setFilesFilter}))} className='flex items-center cursor-pointer max-md:hidden'>
              <p className="dark:text-white">Tamanho</p> 
              <Image alt="Imagem de uma flecha" className={`ml-[5px] ${filter.size ? "rotate-180" : ""}`}src={ArrowFilter}/>
            </button>

            <button id="filterData" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({date:! filter.date, status: false, name:false, size:false}), FilterDate({dataFilter:filesFilter, filter:filter, setReturn:setFilesFilter}))} className='flex items-center cursor-pointer max-lg:hidden'>
              <p className='text-left dark:text-white'>Data de upload</p>
              <Image alt="Imagem de uma flecha" className={`ml-[5px] ${filter.date ? "rotate-180" : ""}`} src={ArrowFilter}/>
            </button>

            <button id="filterStatus" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({...filter, status:! filter.status, name: false,  size:false, date:false}), FilterStatus({dataFilter:filesFilter, filter:filter, setReturn:setFilesFilter}))}  className='flex items-center cursor-pointer max-sm:hidden'>
              <p className="dark:text-white">Status</p>
              <Image alt="Imagem de uma flecha" className={`ml-[5px]  ${filter.status ? "rotate-180" : ""}`} src={ArrowFilter}/>
            </button>

            <p className='font-[400] dark:text-white'>Ações</p>
          </div>
              
          {/* <--------------------------------- BodyTable ---------------------------------> */}
          {filesFilter.map((file, index) =>{
            var checked = file.checked
            if( showItens.min < index && index < showItens.max){
              return(
                <div key={index}  className="w-full grid grid-cols-[20px__1fr_120px_200px_110px_70px] max-lg:grid-cols-[20px__1fr_120px_110px_70px] max-md:grid-cols-[20px__1fr_110px_70px] max-sm:grid-cols-[20px__1fr_70px] px-[5px] gap-x-[15px] text-[16px] font-[500] border-b-[1px] border-b-neutral-400 items-center py-[5px]">
                  <input aria-label="Selecionar Arquivos" type="checkbox" checked={checked} onChange={(e) => (checked = e.target.value === "on" ? true : false)} onClick={() => SelectFile(index)} className='w-[20px] h-[20px]'/>
                  
                  <div className='flex items-center'>
                    <Image src={`/icons/${file.type}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={40} height={40}  className='text-[10px] mr-[10px] w-[30px] max-lg:w-[25px]  h-[30px] max-lg:h-[25px]'/>
                    <p className='overflow-hidden whitespace-nowrap text-ellipsis dark:text-white max-w-[700px] max-2xl:max-w-[450px] max-xl:max-w-[220px] max-lg:max-w-[280px] max-sm:max-w-[250px] max-lsm:max-w-[250px]'>{file.name}</p>
                  </div>

                  <p className='overflow-hidden whitespace-nowrap text-ellipsis dark:text-white ml-[20px] max-md:hidden'>{file.size < 1000 ? file.size + " KB"  : Math.ceil(file.size / 1000) + " MB"} </p>

                  <p className='font-[400] max-lg:hidden text-left dark:text-white'>{FormatDate(file.created_date)}</p>

                  {file.viwed  ? 
                    <div className='text-[16px] bg-greenV/20 border-greenV text-[#00920f] border-[1px] rounded-[5px] text-center max-sm:hidden'>
                      Visualizado
                    </div>
                  :
                    <div className='text-[16px] bg-hilight dark:bg-dhilight max-sm:text-[12px] border-terciary dark:border-dterciary text-secondary dark:text-dsecondary border-[1px] rounded-[5px] text-center max-sm:hidden'>
                      Visualizado
                    </div>
                  }

                  <div className='flex justify-center items-center gap-[10px]'>
                    <Message file={file} childToParentDownload={childToParentDownload} files={files}/>
                    <OptionsFile index={index} from={from} file={file} files={files} DownloadFile={DownloadFile} ConfirmationDeleteFile={ConfirmationDeleteFile}  trash={Boolean(trash)} childToParentDownload={childToParentDownload}/>
                  </div>
                </div>
              )
            }
          })}
        </>

        : 
          <div className='w-full h-full flex justify-center items-center flex-col'>
            <Image src={files.length <= 0 ? iconAddFile : iconSearchFile} width={80} height={80}  alt="Imagem de 2 arquivos" priority className='w-[170px] h-[170px]'/>
            {trash ? 
              <p className='font-poiretOne text-[40px] max-sm:text-[30px] text-center dark:text-white'>Nada por aqui... <br/> {filesFilter.length <= 0 ? "Nenhum arquivo deletado encontrado." : "Nenhum resultado foi encontrado."} </p>
            :
              <p className='font-poiretOne text-[40px] max-sm:text-[30px] text-center dark:text-white'>Nada por aqui... <br/> {filesFilter.length <= 0 ? messageEmpty : "Nenhum resultado foi encontrado."}</p>
            }
          </div>
        }

        {/* <--------------------------------- NavBar table ---------------------------------> */}
        {filesFilter.length > 0 ?
          <div className='w-full px-[10px] flex justify-between h-[50px] mt-[10px]'>
              <div className='flex justify-between w-full h-[40px] max-sm:h-[30px]'>
                  <button onClick={() => {showItens.max / 10 != 1 ? setShowItens({...showItens, min: showItens.min - 10, max: showItens.max - 10}) : ""}} className={` border-[2px] ${showItens.max / 10 == 1 ? "bg-hilight dark:bg-dhilight border-terciary dark:border-dterciary text-terciary dark:text-dterciary" : "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black"} p-[4px] max-sm:p-[2px] rounded-[8px] text-[18px] max-md:text-[16px] max-lsm:text-[14px]`}>Anterior</button>
                    <p className="dark:text-white">{`Página ${showItens.max / 10} de ${pages}`}</p>
                  <button onClick={() => {showItens.max / 10 != pages ? setShowItens({...showItens, min: showItens.min + 10, max: showItens.max + 10}) : ""}} className={` border-[2px] ${showItens.max / 10 == pages ? "bg-hilight dark:bg-dhilight border-terciary dark:border-dterciary text-terciary dark:text-dterciary" : "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black"} p-[4px] max-sm:p-[2px] rounded-[8px] text-[18px] max-md:text-[16px] max-lsm:text-[14px]`}>Proximo</button>
              </div>
          </div>
        :<></>}
    </>
  )
}
