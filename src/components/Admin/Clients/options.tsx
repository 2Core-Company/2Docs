import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link'
import { Pencil1Icon, FileTextIcon, DrawingPinIcon, DrawingPinFilledIcon } from '@radix-ui/react-icons';
import { DataUser, Users, WindowsAction } from '../../../types/interfaces'
import Fix from './fix'
import UnFix from './unFix'
import { toast } from 'react-toastify';

interface Props{
    idUser:string
    user:DataUser,
    users:Users[],
    windowsAction:WindowsAction,
    setWindowsAction:Function,
    setUserEdit:Function,
    FilterFixed:Function
    setUsersFilter:Function
}

function OptionsFile(props:Props){
    const messageFix = {pending:"Fixando usuário...", success:"Usuário fixado com sucesso."}
  return (
    <>
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
              <Link href={{ pathname: '/Admin/Pastas', query:{id:props.idUser}}}  className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <FileTextIcon width={22} height={22} className='text-[250px]'/>
                Documentos
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300">
              <div onClick={() => (props.setUserEdit(props.user), props.setWindowsAction({...props.windowsAction, updateUser:true}))} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <Pencil1Icon width={22} height={22} className='text-[250px]'/>
                Editar
              </div>
            </DropdownMenu.Item>
            

            <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300">
                {props.user.fixed ? 
                    <div onClick={() => toast.promise(UnFix({user: props.user, users:props.users, FilterFixed:props.FilterFixed, setUsersFilter:props.setUsersFilter}),messageFix)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                        <DrawingPinFilledIcon width={22} height={22} className='text-[250px]'/>
                        Desfixar
                    </div>
                :
                    <div onClick={() => toast.promise(Fix({user: props.user, users:props.users, FilterFixed:props.FilterFixed, setUsersFilter:props.setUsersFilter}),messageFix)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                        <DrawingPinIcon width={22} height={22} className='text-[250px]'/>
                        Fixar
                    </div>
                }   
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};

export default OptionsFile;