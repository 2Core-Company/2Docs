import React, { useState, useEffect } from 'react'
import iconAddFile from '../../../../public/icons/addFile.svg'
import ArrowFilter from '../../../../public/icons/arrowFilter.svg'
import iconSearchFile from '../../../../public/icons/searchFile.svg' 
import Image from 'next/image'
import DownloadsFile from './dowloadFiles'
import { Filter, Files,  OptionsFiles} from '../../../types/interfaces'
import OptionsFile  from './options'
import ViewFile from '../../Clients&Admin/Files/viewFile';
import Favorite from './favorite'
import Desfavorite from './desfavorite'
import Message from './message'

interface Props{
  filesFilter:Files[]
  pages:number
  trash:boolean
  files:Files[]
  folderName:string
  searchFile:string
  from:string
  ConfirmationDeleteFile:Function
  SelectFile:Function
  setFilesFilter:Function
  childToParentDownload:Function
}


export default function TableFiles({setFilesFilter ,SelectFile, ConfirmationDeleteFile, pages, trash, filesFilter, files, folderName, searchFile, from, childToParentDownload}:Props) {
  const [filter, setFilter] = useState<Filter>({name: false, size:false, date:false, status:false})
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Augusto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  const [showItens, setShowItens] = useState({min:-1, max:10})
  const url = window.location.href
  const [messageEmpty, setMessageEmpty] = useState<string>()
  const [viwedFile, setViwedFile] = useState<OptionsFiles>({viwed:false, url:""})

  useEffect(() => {
    if(url.includes("Clientes") === true  && folderName === "Cliente" ){
      setMessageEmpty("Envie seu primeiro arquivo!")
    } else if(url.includes("Admin") === true  && folderName != "Cliente") {
      setMessageEmpty("Envie seu primeiro arquivo!")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // <--------------------------------- Filters Files --------------------------------->
  function filterName(){
    var files = searchFile.length == 0 ? [...files ]: [...filesFilter]
    files.sort(function (x, y){
      let a = x.name.toUpperCase()
      let b = y.name.toUpperCase()
      if(filter.name){
        return a == b ? 0 : a < b ? 1 : -1
      } else {
        return a == b ? 0 : a > b ? 1 : -1
      }  
    })
    setFilesFilter(files)
  }

  function filterSize(){
    var files = searchFile.length == 0 ? [...files ]: [...filesFilter]
    files.sort(function (x, y){
      let a = x.size
      let b = y.size
      if(filter.size){
        return a == b ? 0 : a < b ? 1 : -1
      } else {
        return a == b ? 0 : a > b ? 1 : -1
      }  
    })
    setFilesFilter(files)
  }

  function filterStatus(){
    var files = searchFile.length == 0 ? [...files ]: [...filesFilter]
    files.sort(function (x, y){
      let a = x.viwed
      let b = y.viwed
      if(filter.status){
        return a == b ? 0 : a < b ? 1 : -1
      } else {
        return a == b ? 0 : a > b ? 1 : -1
      }  
    })
    setFilesFilter(files)
  }

  function filterDate(){
    const filesDate = [...filesFilter]
    filesDate.sort((a,b) => { 
      a.created_date = new Date(a.created_date)
      b.created_date = new Date(b.created_date)
      if(filter.date){
       return (b.created_date.getTime() - a.created_date.getTime())
      } else {
       return (a.created_date.getTime() - b.created_date.getTime())
      }
    });
    for (var i = 0; i < filesDate.length; i++) {
      filesDate[i].created_date = filesDate[i].created_date + ""
    }
    setFilesFilter(filesDate)
  }

  // <--------------------------------- Formate Date Files --------------------------------->
  function formatDate(date:string){
    if(date.length > 12){
      var newDate = new Date(date)
      if(window.screen.width > 1250){
        var month = newDate.getMonth()
        return date.substr(8, 2) + " de " + months[month] + " de " + date.substr(11, 4)
      } else {
        return newDate.toLocaleDateString()
      }
    } 
  }

   // <--------------------------------- Select Files --------------------------------->
  function selectAllFiles(){
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

  // <--------------------------------- Delet Files --------------------------------->
  async function DeletFiles(index:number){
    ConfirmationDeleteFile(index)
  }

  // <--------------------------------- Favorite Files --------------------------------->
  function FavoriteFile(file){
    Favorite({favoriteFile:file, files:files, childToParentDownload:childToParentDownload})
  }

  // <--------------------------------- Desfavorite Files --------------------------------->
  function DesfavoriteFile(file){
    Desfavorite({desfavoriteFile:file, files:files, childToParentDownload:childToParentDownload, folderName:folderName})
  }


  return (
    <>
    {viwedFile.viwed ? <ViewFile setViwedFile={setViwedFile} viwedFile={viwedFile} files={files} from={from} childToParentDownload={childToParentDownload} /> : <></>}
    
    {filesFilter.length > 0 ?
        <table className='w-full mt-[10px] bg-transparent'>
          {/* <--------------------------------- HeadTable ---------------------------------> */}
          <thead>
            <tr className='bg-[#DDDDDD] dark:bg-[#fff]/5 border-b-[2px] border-t-[2px] border-terciary dark:border-dterciary text-[20px] max-lg:text-[18px] max-md:text-[17px]'>
              <th className='py-[10px]'><button aria-label="checkbox demonstrativo" onClick={() => selectAllFiles()} className='w-[22px] h-[22px] cursor-pointer bg-white rounded-[4px] ml-[5px] border-[1px] border-black'/></th>
              
              <th className='font-[400] text-left pl-[20px] max-lg:pl-[10px]'>
                <button id="filterName" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({...filter, name:! filter.name, status: false, date:false, size:false}), filterName())} className='flex items-center cursor-pointer'>
                  <p className="dark:text-white">Nome</p> 
                  <Image alt="Imagem de uma flecha" className={`ml-[5px] ${filter.name ? "rotate-180" : ""}`}src={ArrowFilter}/>
                </button>
              </th>

              <th className='font-[400] text-left pl-[20px] max-md:hidden'>
                <button id="filterSize" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({...filter, size:! filter.size, name:false, status: false, date:false}), filterSize())} className='flex items-center cursor-pointer'>
                  <p className="dark:text-white">Tamanho</p> 
                  <Image alt="Imagem de uma flecha" className={`ml-[5px] ${filter.size ? "rotate-180" : ""}`}src={ArrowFilter}/>
                </button>
              </th>

              <th className='font-[400] max-lg:hidden'>
                <button id="filterData" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({...filter, date:! filter.date, status: false, name:false, size:false}), filterDate())} className='flex items-center cursor-pointer'>
                  <p className='text-left dark:text-white'>Data de upload</p>
                  <Image alt="Imagem de uma flecha" className={`ml-[5px] ${filter.date ? "rotate-180" : ""}`} src={ArrowFilter}/>
                </button>
              </th>

              <th className='font-[400]'>
              <button id="filterStatus" title="Botão do filtro" aria-labelledby="labeldiv" onClick={() => (setFilter({...filter, status:! filter.status, name: false,  size:false, date:false}), filterStatus())}  className='flex items-center cursor-pointer'>
                  <p className="dark:text-white">Status</p>
                  <Image alt="Imagem de uma flecha" className={`ml-[5px]  ${filter.status ? "rotate-180" : ""}`} src={ArrowFilter}/>
                </button>
              </th>

              <th className='font-[400] dark:text-white'>Ações</th>

            </tr>
          </thead>
              {/* <--------------------------------- BodyTable ---------------------------------> */}
            <tbody>
                {filesFilter.map((file, index) =>{
                    var checked = file.checked
                    if( showItens.min < index && index < showItens.max){
                    return(
                    <tr key={file.id_file} className={`border-b-[1px] border-terciary dark:border-dterciary text-[18px] max-lg:text-[16px] ${file.favorite ? "bg-neutral-300 dark:bg-neutral-300/10" : ""}`} >
                      <th className='h-[50px] max-sm:h-[40px]'>
                        <input aria-label="Selecionar Usuário" type="checkbox" checked={checked} onChange={(e) => checked = e.target.value === "on" ?  true : false}  onClick={() => SelectFile(index)} className='w-[20px] max-sm:w-[15px] max-sm:h-[15px]  h-[20px] ml-[5px]'/>
                      </th>

                      <th className='font-[400] flex ml-[20px] max-lg:ml-[10px] items-center h-[50px] max-sm:h-[40px]'>
                        <Image src={`/icons/${file.type}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={40} height={40}  className='text-[10px] mt-[3px] mr-[10px] w-[30px] max-lg:w-[25px]  h-[30px] max-lg:h-[25px]'/>
                        <p className='overflow-hidden whitespace-nowrap text-ellipsis dark:text-white max-w-[180px] max-lg:max-w-[130px] max-lsm:max-w-[80px]'>{file.name}</p>
                      </th>

                      <th className='font-[400] text-left pl-[20px] max-md:hidden w-50'>
                        <p className='overflow-hidden whitespace-nowrap text-ellipsis dark:text-white'>{file.size < 1000 ? file.size + " KB"  : Math.ceil(file.size / 1000) + " MB"} </p>
                      </th>

                      <th className='font-[400] max-lg:hidden text-left dark:text-white'>{formatDate(file.created_date)}</th>

                      <th className='font-[400] w-[80px] pr-[10px] max-sm:pr-[0px] max-sm:w-[70px] text-[18px] max-sm:text-[14px] '>
                        {file.viwed  ? 
                          <div className='bg-greenV/20 border-greenV text-[#00920f] border-[1px] rounded-full px-[4px]'>
                            Visualizado
                          </div>
                        :
                          <div className='bg-hilight dark:bg-dhilight max-sm:text-[12px] border-terciary dark:border-dterciary text-secondary dark:text-dsecondary border-[1px]  px-[4px] rounded-full'>
                            Visualizado
                          </div>
                        }
                      </th>

                      <th className='font-[400]  w-[90px] max-lg:w-[80px] px-[5px]'>
                          <div className='flex justify-center items-center gap-[10px]'>
                              <Message file={file} childToParentDownload={childToParentDownload} files={files}/>
                              <OptionsFile index={index} file={file} files={files} setViwedFile={setViwedFile} viwedFile={viwedFile} DownloadFile={DownloadFile}  DeletFiles={DeletFiles} trash={Boolean(trash)} FavoriteFile={FavoriteFile} DesfavoriteFile={DesfavoriteFile} childToParentDownload={childToParentDownload}/>
                          </div>
                      </th>
                    </tr>
                )}})}
            </tbody>
        </table>
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
