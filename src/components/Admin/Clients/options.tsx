import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link'
import { Pencil1Icon, FileTextIcon, DrawingPinIcon, DrawingPinFilledIcon } from '@radix-ui/react-icons';
import { DataUser, Users, WindowsAction } from '../../../types/interfaces'
import Fix from './fix'
import UnFix from './unFix'
import { toast } from 'react-toastify';
import ModalEvent from '../../Clients&Admin/Calendar/modalEvent'
import Calendar from '../../../../public/icons/calendar.svg'
import Image from 'next/image';

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

function Options({idUser, user, users, windowsAction, setWindowsAction, setUserEdit, FilterFixed, setUsersFilter}: Props){
    const messageFix = {pending:"Fixando usuário...", success:"Usuário fixado com sucesso."}
    const [modalEvent, setModalEvent] = useState<boolean>(false)

  return (
    <>
      {modalEvent ? <ModalEvent id={user.id} email={user.email} enterprises={user.enterprises} userName={user.name} setModalEvent={setModalEvent}/> : <></>}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild className='flex justify-center items-center'>
          <button className="flex  cursor-pointer w-[20px] h-[20px] justify-between" aria-label="Customise options">
            <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full'></div>
            <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full'></div>
            <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full'></div>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal >
          <DropdownMenu.Content align="end" alignOffset={-25}  className="bg-primary dark:bg-dprimary text-black dark:text-white text-[18px] rounded-[6px] flex flex-col gap-[5px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.50)]" sideOffset={5}>
            <DropdownMenu.Item  className="cursor-pointer rounded-t-[6px] hover:outline-none  hover:bg-neutral-300 dark:hover:bg-gray-300/20">
              <Link href={{ pathname: '/Admin/Pastas', query:{id:idUser}}}  className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <FileTextIcon width={22} height={22} className='text-[250px]'/>
                Documentos
              </Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300 dark:hover:bg-gray-300/20">
              <div onClick={() => (setUserEdit(user), setWindowsAction({...windowsAction, updateUser:true}))} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <Pencil1Icon width={22} height={22} className='text-[250px]'/>
                Editar
              </div>
            </DropdownMenu.Item>

            <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300 dark:hover:bg-gray-300/20">
              <div onClick={() => setModalEvent(true)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <Image src={Calendar} alt="Calendário" width={22} height={22} />
                Agendar
              </div>
            </DropdownMenu.Item>
            
            <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-neutral-300 dark:hover:bg-gray-300/20">
                {user.fixed ? 
                  <div onClick={() => toast.promise(UnFix({user: user, users:users, FilterFixed:FilterFixed, setUsersFilter:setUsersFilter}),messageFix)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                    <DrawingPinFilledIcon width={22} height={22} className='text-[250px]'/>
                    Desfixar
                  </div>
                :
                  <div onClick={() => toast.promise(Fix({user: user, users:users, FilterFixed:FilterFixed, setUsersFilter:setUsersFilter}),messageFix)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
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

export default Options;