import React, { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link'
import { DrawingPinIcon, DrawingPinFilledIcon, TrashIcon, PersonIcon, FileIcon, Pencil2Icon, StopwatchIcon, CalendarIcon } from '@radix-ui/react-icons';
import { DataUser, DataUserContext } from '../../../types/users'
import { Modal, WindowsAction } from '../../../types/others';
import Fix from './FixUser'
import UnFix from './UnFixUser'
import { toast } from 'react-toastify';
import DeletUser from './deletUser';
import ModalDelete from '../../../Utils/Other/modalDelete'
import ModalSetAdmin from './ModalSetAdmin';
import ModalEvent from '../Calendar/modalEvent';


interface Props{
  domain:string,
  idUser:string,
  user:DataUser,
  users:DataUser[],
  windowsAction:WindowsAction,
  setWindowsAction:Function,
  setUserEdit:Function,
  FilterFixed:Function,
  setUsers:Function,
  ResetConfig:Function,
  dataAdmin: DataUserContext
}

function Options({dataAdmin, domain, idUser, user, users, windowsAction, setWindowsAction, setUserEdit, FilterFixed, setUsers, ResetConfig}: Props){
  const messageFix = {pending:"Fixando usuário...", success:"Usuário fixado com sucesso."}
  const messageUnFix = {pending:"Desfixando usuário...", success:"Usuário fixado com sucesso."}
  const [ modalEvent, setModalEvent ] = useState<boolean>(false)
  const [ modalAdminOptions, setModalAdminOptions ] = useState<boolean>(false)
  const [ modal, setModal ] = useState<Modal>({status: false, title:'', subject:'', target:''})
  
  //Confirmação de deletar usuário
  function ConfirmationDeleteUser(){
    setModal({status:true, title:'Deletar Usuário', subject:'o usuário', target:'Natã'})
  }
  
  //Resposta da confirmação
  const childModal = () => {
    toast.promise(DeletUser({user, users, domain, ResetConfig}), {pending:"Deletando o usuário...", success:"O usuário foi deletado com sucesso.", error:"Não foi possivel deletar o usuário."});
    setModal({status: false, title:'', subject:'', target:''})
  }

  return (
    <>
      {modal.status && <ModalDelete modal={modal} childModal={childModal} setModal={setModal}/> }
      {modalAdminOptions &&  <ModalSetAdmin setModalAdminOptions={setModalAdminOptions} user={user} dataAdmin={dataAdmin} setUsers={setUsers} users={users} />}
      {modalEvent && <ModalEvent defaultValue={{label:user.name, value:{id_user:user.id}}} action={'create'} modalEvent={modalEvent} setModalEvent={setModalEvent} />}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild className='flex justify-center items-center'>
          <button className="flex  cursor-pointer w-[20px] h-[20px] justify-between" aria-label="Customize options">
            <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full' />
            <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full' />
            <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full' />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal >
          <DropdownMenu.Content align="end" alignOffset={-25}  className="p-[3px] bg-primary dark:bg-dprimary text-[#686868] dark:text-white rounded-[6px] flex flex-col drop-shadow-[0_4px_8px_rgba(0,0,0,0.50)]" sideOffset={5}>
            <DropdownMenu.Item  className="cursor-pointer rounded-[6px] hover:outline-none  hover:bg-emerald-500 hover:text-[#fff] duration-100">
              <Link href={{ pathname: '/Dashboard/Admin/Pastas', query:{id_user:idUser}}} className='cursor-pointer flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                <FileIcon width={18} height={18} />
                Documentos
              </Link>
            </DropdownMenu.Item>

            {dataAdmin.permission === 3 ? 
            <DropdownMenu.Item  className="cursor-pointer rounded-[6px] hover:outline-none  hover:bg-emerald-500 hover:text-[#fff] duration-100">
              <div onClick={() => setModalAdminOptions(true)} className='cursor-pointer flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                <PersonIcon width={18} height={18} />
                Definir Admins
              </div>
            </DropdownMenu.Item> :
            <></>
            }

            <DropdownMenu.Item  className="cursor-pointer rounded-[6px] hover:outline-none  hover:bg-emerald-500 hover:text-[#fff] duration-100">
              <div onClick={() => (setUserEdit(user), setWindowsAction({...windowsAction, updateUser:true}))} className='cursor-pointer flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                <Pencil2Icon width={18} height={18}/>
                Editar
              </div>
            </DropdownMenu.Item>

            <DropdownMenu.Item  className="cursor-pointer rounded-[6px] hover:outline-none  hover:bg-emerald-500 hover:text-[#fff] duration-100">
              <div onClick={() => setModalEvent(true)} className='cursor-pointer flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                <StopwatchIcon width={18} height={18}/>
                Agendar
              </div>
            </DropdownMenu.Item>

            <DropdownMenu.Item  className="cursor-pointer rounded-[6px] hover:outline-none  hover:bg-emerald-500 hover:text-[#fff] duration-100">
              <Link href={`/Dashboard/Admin/Calendario/${user.id}/${user.name}`} className='cursor-pointer flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                <CalendarIcon width={18} height={18} />
                Calendário
              </Link>
            </DropdownMenu.Item>
            
            <DropdownMenu.Item  className="cursor-pointer rounded-[6px] hover:outline-none  hover:bg-emerald-500 hover:text-[#fff] duration-100">
              {user.fixed ? 
                <div onClick={() => toast.promise(UnFix({user: user, users:users, FilterFixed:FilterFixed, setUsers:setUsers}), messageUnFix)} className='cursor-pointer flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                  <DrawingPinFilledIcon width={20} height={20}/>
                  Desfixar
                </div>
              :
                <div onClick={() => toast.promise(Fix({user: user, users:users, FilterFixed:FilterFixed, setUsers:setUsers}), messageFix)} className='cursor-pointer flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                  <DrawingPinIcon width={20} height={20}/>
                  Fixar
                </div>
              }   
            </DropdownMenu.Item>

            <DropdownMenu.Item  className="cursor-pointer rounded-[6px] hover:outline-none  hover:bg-[#BE0000] hover:text-[#fff] duration-100">
              <div onClick={() => ConfirmationDeleteUser()} className='cursor-pointer flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                <TrashIcon width={20} height={20}/>
                Excluir usuário
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};

export default Options;