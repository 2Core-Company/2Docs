import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link'
import { Pencil1Icon, FileTextIcon, DrawingPinIcon, DrawingPinFilledIcon, TrashIcon } from '@radix-ui/react-icons';
import { DataUser } from '../../../types/users'
import { Modal, WindowsAction } from '../../../types/others';
import Fix from './FixUser'
import UnFix from './UnFixUser'
import { toast } from 'react-toastify';
import ModalEvent from '../../Clients&Admin/Calendar/modalEvent'
import Calendar from '../../../../public/icons/calendar.svg'
import Image from 'next/image';
import DeletUser from './deletUser';
import ModalDelete from '../../../Utils/Other/ModalDelete'

interface Props{
  idUser:string
  user:DataUser,
  users:DataUser[],
  windowsAction:WindowsAction,
  setWindowsAction:Function,
  setUserEdit:Function,
  FilterFixed:Function
  setUsers:Function
  ResetConfig:Function
}

function Options({idUser, user, users, windowsAction, setWindowsAction, setUserEdit, FilterFixed, setUsers, ResetConfig}: Props){
  const messageFix = {pending:"Fixando usuário...", success:"Usuário fixado com sucesso."}
  const messageUnFix = {pending:"Desfixando usuário...", success:"Usuário fixado com sucesso."}
  const [modalEvent, setModalEvent] = useState<boolean>(false)
  const [modal, setModal] = useState<Modal>({status: false, message: "", subMessage1: "", subMessage2: ""})
  

    //Confirmação de deletar usuário
    function ConfirmationDeleteUser(){
      setModal({...modal, status:true, message: `Tem certeza que deseja excluir o usuário: ${user.name}`, subMessage1: "Será permanente.", subMessage2:"Os documentos serão apagados também."})
    }
  
    //Resposta da confirmação
    const childModal = () => {
      toast.promise(DeletUser({user:user, users:users, ResetConfig:ResetConfig}), {pending:"Deletando o usuário...", success:"O usuário foi deletado com sucesso.", error:"Não foi possivel deletar o usuário."});
      setModal({status: false, message: "", subMessage1: "", subMessage2: ""})
    }

  return (
    <>
      {modal.status ? <ModalDelete confirmation={true} setModal={setModal} message={modal.message} subMessage1={modal.subMessage1} subMessage2={modal.subMessage2} childModal={childModal}/> : <></>}
      {modalEvent ? <ModalEvent id={user.id} email={user.email} enterprises={user.enterprises} userName={user.name} setModalEvent={setModalEvent}/> : <></>}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild className='flex justify-center items-center'>
          <button className="flex  cursor-pointer w-[20px] h-[20px] justify-between" aria-label="Customise options">
            <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full' />
            <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full' />
            <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full' />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal >
          <DropdownMenu.Content align="end" alignOffset={-25}  className="bg-primary dark:bg-dprimary text-black dark:text-white text-[18px] rounded-[6px] flex flex-col gap-[5px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.50)]" sideOffset={5}>
            <DropdownMenu.Item  className="cursor-pointer rounded-t-[6px] hover:outline-none  hover:bg-neutral-300 dark:hover:bg-gray-300/20">
              <Link href={{ pathname: '/Dashboard/Admin/Pastas', query:{id_user:idUser, id_enterprise:user.enterprises[0].id}}}  className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
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
                <div onClick={() => toast.promise(UnFix({user: user, users:users, FilterFixed:FilterFixed, setUsers:setUsers}), messageUnFix)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                  <DrawingPinFilledIcon width={22} height={22} className='text-[250px]'/>
                  Desfixar
                </div>
              :
                <div onClick={() => toast.promise(Fix({user: user, users:users, FilterFixed:FilterFixed, setUsers:setUsers}), messageFix)} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                  <DrawingPinIcon width={22} height={22} className='text-[250px]'/>
                  Fixar
                </div>
              }   
            </DropdownMenu.Item>

            <DropdownMenu.Item className="cursor-pointer hover:outline-none hover:bg-red/30 dark:hover:bg-gray-300/20">
              <div onClick={() => ConfirmationDeleteUser()} className='cursor-pointer flex items-center gap-[10px] px-[10px] py-[3px]'>
                <TrashIcon width={22} height={22} className='text-[250px]'/>
                Excluir
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
        {/*  */}
      </DropdownMenu.Root>
    </>
  );
};

export default Options;