import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DownloadIcon, EyeOpenIcon, TrashIcon} from '@radix-ui/react-icons';
import Image from 'next/image'
import Copy from '../../../../public/icons/copy.svg'
import Move from '../../../../public/icons/move.svg'
import RenameIcon from '../../../../public/icons/rename.svg'
import Favorite from '../../../../public/icons/favorite.svg'
import Desfavorite from '../../../../public/icons/desfavorite.svg'
import Share from '../../../../public/icons/share.svg'
import { Files } from '../../../types/interfaces'
import MoveTo from './moveTo'
import CopyTo from './copyTo'
import Rename from './rename'
import { useSearchParams } from 'next/navigation';
import ShareFile from './shareFile';


interface Props{
  file:Files, 
  files:Files[] 
  viwedFile:any, 
  index:number
  trash:boolean
  setViwedFile: Function, 
  DownloadFile:Function, 
  DeletFiles:Function,
  FavoriteFile:Function
  DesfavoriteFile:Function
  childToParentDownload:Function}

function OptionsFile({file, files, viwedFile, index, trash, setViwedFile, DownloadFile, DeletFiles, FavoriteFile, DesfavoriteFile, childToParentDownload}: Props){
  const url = window.location.href
  const [moveTo, setMoveTo] = useState(false)
  const [copyTo, setCopyTo] = useState(false)
  const [rename, setRename] = useState(false)
  const params = useSearchParams()
  const folderName:string = params.get("folder")

  return (
    <>
      {moveTo ? <MoveTo file={file} files={files} setMoveTo={setMoveTo} childToParentDownload={childToParentDownload}/> : <> </>}
      {copyTo ? <CopyTo file={file} setCopyTo={setCopyTo} /> : <> </>}
      {rename ? <Rename file={file} files={files} setRename={setRename} childToParentDownload={childToParentDownload}/> : <> </>}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex gap-[3px] cursor-pointer" aria-label="Customize options">
            <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full'></div>
            <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full'></div>
            <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full'></div>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal >
          <DropdownMenu.Content align="end" alignOffset={-25}  className="bg-primary text-black text-[18px] rounded-[6px] flex flex-col gap-[5px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.50)]" sideOffset={5}>
            <DropdownMenu.Item  className="cursor-pointer rounded-t-[6px] hover:outline-none  hover:bg-neutral-300">
              <div onClick={() => setViwedFile({...viwedFile, viwed:true, url:file.url, file:file})} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <EyeOpenIcon width={22} height={22} className='text-[250px]'/>
                Visualizar
              </div>
            </DropdownMenu.Item>

            <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300">
              <div onClick={() => DownloadFile(file)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <DownloadIcon width={22} height={22} className='text-[250px]'/>
                Download
              </div>
            </DropdownMenu.Item>

          {trash || url.includes("/Admin") && file.from === "user" || folderName === "Favoritos" ? <></>
          :
            <>
              <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300 dark:hover:bg-dsecondary/30">
                <div onClick={() => setMoveTo(true)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                  <Image className="dark:invert-0" src={Move} width={22} height={22}  alt={"Copiar documentos"} />
                  Mover
                </div>
              </DropdownMenu.Item>

              <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300 dark:hover:bg-dsecondary/30">
                <div onClick={() => setCopyTo(true)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                  <Image className="dark:invert-0" src={Copy} width={22} height={22} alt={"Copiar documentos"}/>
                  Copiar
                </div>
              </DropdownMenu.Item>
            </>
          }
          {folderName === "Clientes" && file.from === "user" ||  url.includes("/Admin") && file.from === "admin" ? 
            <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300">
              <div onClick={() => setRename(true)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <Image className="dark:invert-0" src={RenameIcon} width={22} height={22} alt={"Copiar documentos"}/>
                Renomear
              </div>
            </DropdownMenu.Item>
            :
            <></>
          }
          <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300">
            {file?.favorite ? 
              <div onClick={() => DesfavoriteFile(file)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <Image src={Desfavorite} width={22} height={22} alt={"Copiar documentos"}/>
                Desfavoritar
              </div>
            :
              <div onClick={() => FavoriteFile(file)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <Image src={Favorite} width={22} height={22} alt={"Copiar documentos"}/>
                Favoritar
              </div>
            }
          </DropdownMenu.Item>
 
          {file?.from === 'admin' &&  url.includes("/Admin") ? 
          <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300">
              <div onClick={() => ShareFile({file:file})} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <Image src={Share} width={22} height={22} alt={"Copiar documentos"}/>
                Compartilhar
              </div>
          </DropdownMenu.Item>
          :<></>}
          
          {url.includes("/Clientes") && file.from === "user" ||  url.includes("/Admin") ? 
            <DropdownMenu.Item className="cursor-pointer hover:outline-none rounded-b-[6px] hover:bg-red/30">
              <div onClick={() => DeletFiles(index)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <TrashIcon width={22} height={22} className='text-[250px]'/>
                Excluir
              </div>
            </DropdownMenu.Item>
          : <></>}

          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};

export default OptionsFile;