import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DownloadIcon, EyeOpenIcon, TrashIcon} from '@radix-ui/react-icons';
import Image from 'next/image'
import Copy from '../../../../public/icons/copy.svg'
import Move from '../../../../public/icons/move.svg'
import RenameIcon from '../../../../public/icons/rename.svg'
import Favorite from '../../../../public/icons/favorite.svg'
import Desfavorite from '../../../../public/icons/desfavorite.svg'
import { Files } from '../../../types/interfaces'
import MoveTo from './moveTo'
import CopyTo from './copyTo'
import Rename from './rename'
import { useSearchParams } from 'next/navigation';

interface Props{
  file:Files, 
  files:Files[]
  from:string, 
  viwedFile:any, 
  index:number
  trash:boolean
  setViwedFile: Function, 
  DownloadFile:Function, 
  DeletFiles:Function,
  FavoriteFile:Function
  DesfavoriteFile:Function
  childToParentDownload:Function}

function OptionsFile(props:Props){
  const url = window.location.href
  const [moveTo, setMoveTo] = useState(false)
  const [copyTo, setCopyTo] = useState(false)
  const [rename, setRename] = useState(false)
  const params = useSearchParams()
  const folderName:string = params.get("folder")
  return (
    <>
      {moveTo ? <MoveTo file={props.file} files={props.files} setMoveTo={setMoveTo} childToParentDownload={props.childToParentDownload}/> : <> </>}
      {copyTo ? <CopyTo file={props.file} setCopyTo={setCopyTo} /> : <> </>}
      {rename ? <Rename file={props.file} files={props.files} setRename={setRename} childToParentDownload={props.childToParentDownload}/> : <> </>}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex gap-[3px]" aria-label="Customise options">
            <div className='w-[5px] h-[5px] bg-black rounded-full'></div>
            <div className='w-[5px] h-[5px] bg-black rounded-full'></div>
            <div className='w-[5px] h-[5px] bg-black rounded-full'></div>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal >
          <DropdownMenu.Content align="end" alignOffset={-25}  className="bg-primary text-black text-[18px] rounded-[6px] flex flex-col gap-[5px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.50)]" sideOffset={5}>
            <DropdownMenu.Item  className="cursor-pointer rounded-t-[6px] hover:outline-none  hover:bg-neutral-300">
              <div onClick={() => props.setViwedFile({...props.viwedFile, viwed:true, url:props.file.url, file:props.file})} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <EyeOpenIcon width={22} height={22} className='text-[250px]'/>
                Visualizar
              </div>
            </DropdownMenu.Item>

            <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300">
              <div onClick={() => props.DownloadFile(props.file)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <DownloadIcon width={22} height={22} className='text-[250px]'/>
                Download
              </div>
            </DropdownMenu.Item>

          {props.trash || url.includes("/Admin") && props.file.from === "user" || folderName === "Favoritos" ? <></>
          :
            <>
              <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300">
                <div onClick={() => setMoveTo(true)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                  <Image src={Move} width={22} height={22}  alt={"Copiar documentos"} />
                  Mover
                </div>
              </DropdownMenu.Item>

              <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300">
                <div onClick={() => setCopyTo(true)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                  <Image src={Copy} width={22} height={22} alt={"Copiar documentos"}/>
                  Copiar
                </div>
              </DropdownMenu.Item>
            </>
          }
          {folderName === "Clientes" && props.file.from === "user" ||  url.includes("/Admin") && props.file.from === "admin" ? 
            <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300">
              <div onClick={() => setRename(true)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <Image src={RenameIcon} width={22} height={22} alt={"Copiar documentos"}/>
                Renomear
              </div>
            </DropdownMenu.Item>
            :
            <></>
          }
          <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300">
            {props.file?.favorite ? 
              <div onClick={() => props.DesfavoriteFile(props.file)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <Image src={Desfavorite} width={22} height={22} alt={"Copiar documentos"}/>
                Desfavoritar
              </div>
            :
              <div onClick={() => props.FavoriteFile(props.file)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <Image src={Favorite} width={22} height={22} alt={"Copiar documentos"}/>
                Favoritar
              </div>
            }
          </DropdownMenu.Item>

          {url.includes("/Clientes") && props.file.from === "user" ||  url.includes("/Admin") ? 
            <DropdownMenu.Item className="cursor-pointer hover:outline-none rounded-b-[6px] hover:bg-red/30">
              <div onClick={() => props.DeletFiles(props.index)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
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