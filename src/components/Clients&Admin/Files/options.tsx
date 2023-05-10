import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DownloadIcon, EyeOpenIcon, TrashIcon} from '@radix-ui/react-icons';
import Image from 'next/image'
import Copy from '../../../../public/icons/copy.svg'
import Move from '../../../../public/icons/move.svg'
import RenameIcon from '../../../../public/icons/rename.svg'
import FavoriteIcon from '../../../../public/icons/favorite.svg'
import DesfavoriteIcon from '../../../../public/icons/desfavorite.svg'
import Share from '../../../../public/icons/share.svg'
import { Files } from '../../../types/files'
import MoveTo from './moveTo'
import CopyTo from './copyTo'
import Rename from './rename'
import { usePathname, useSearchParams } from 'next/navigation';
import ShareFile from './shareFile';
import ViewFile from './viewFile';
import Favorite from './Favorite';
import Desfavorite from './Desfavorite';


interface Props{
  file:Files, 
  files:Files[] 
  index:number
  trash:boolean
  from:string
  DownloadFile:Function, 
  ConfirmationDeleteFile:Function
  childToParentDownload:Function}

function OptionsFile({file, files, from,  index, trash, DownloadFile, ConfirmationDeleteFile, childToParentDownload}: Props){
  const [moveTo, setMoveTo] = useState(false)
  const [copyTo, setCopyTo] = useState(false)
  const [rename, setRename] = useState(false)
  const [viwedFile, setViwedFile] = useState<boolean>(false)
  const params:any = useSearchParams()
  const folderName:string = params.get("folder")


  return (
    <>
      {moveTo ? <MoveTo file={file} files={files} setMoveTo={setMoveTo} childToParentDownload={childToParentDownload}/> : <> </>}
      {copyTo ? <CopyTo file={file} setCopyTo={setCopyTo} /> : <> </>}
      {rename ? <Rename file={file} files={files} setRename={setRename} childToParentDownload={childToParentDownload}/> : <> </>}
      {viwedFile ? <ViewFile files={files} file={file} from={from} childToParentDownload={childToParentDownload} setViwedFile={setViwedFile}  /> : <></>}

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
              <div onClick={() => setViwedFile(true)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <EyeOpenIcon width={22} height={22} />
                Visualizar
              </div>
            </DropdownMenu.Item>

            <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300">
              <div onClick={() => DownloadFile(file)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <DownloadIcon width={22} height={22} />
                Download
              </div>
            </DropdownMenu.Item>

          {trash  || folderName === "Favoritos" || file.from === "user"  ? <></>
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
          {folderName === "Clientes" && file.from === "user" ||  from === 'admin' && file.from === "admin" ? 
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
              <div onClick={() => Desfavorite({desfavoriteFile:file, files:files, childToParentDownload:childToParentDownload, folderName:folderName})} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <Image src={DesfavoriteIcon} width={22} height={22} alt={"Copiar documentos"}/>
                Desfavoritar
              </div>
            :
              <div onClick={() => Favorite({favoriteFile:file, files:files, childToParentDownload:childToParentDownload})} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <Image src={FavoriteIcon} width={22} height={22} alt={"Copiar documentos"}/>
                Favoritar
              </div>
            }
          </DropdownMenu.Item>
 
          {file?.from === 'admin' &&  from === 'admin' ? 
            <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300">
              <div onClick={() => ShareFile({file:file})} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <Image src={Share} width={22} height={22} alt={"Copiar documentos"}/>
                Compartilhar
              </div>
            </DropdownMenu.Item>
          :<></>}

          {from === 'user' && file.from === "user"  ? 
            <DropdownMenu.Item className="cursor-pointer hover:outline-none rounded-b-[6px] hover:bg-red/30">
              <div onClick={() => ConfirmationDeleteFile(index)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
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