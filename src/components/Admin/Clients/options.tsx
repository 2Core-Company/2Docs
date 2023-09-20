import React, { useContext, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link'
import { DrawingPinIcon, DrawingPinFilledIcon, TrashIcon, PersonIcon, FileIcon, Pencil2Icon, StopwatchIcon, CalendarIcon, UpdateIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import { DataUser, DataUserContext } from '../../../types/users'
import { Modal, WindowsAction } from '../../../types/others';
import Fix from './FixUser'
import UnFix from './UnFixUser'
import { toast } from 'react-toastify';
import DeletUser from './deletUser';
import ModalDelete from '../../../Utils/Other/modalDelete'
import ModalSetAdmin from './ModalSetAdmin';
import ModalEvent from '../Calendar/modalEvent';
import { DisableUser } from './DisableUser';
import axios from 'axios';
import { companyContext } from '@/src/app/Context/contextCompany';


interface Props {
  domain: string,
  idUser: string,
  user: DataUser,
  users: DataUser[],
  windowsAction: WindowsAction,
  setWindowsAction: Function,
  setUserEdit: Function,
  FilterFixed: Function,
  setUsers: Function,
  ResetConfig: Function,
  dataAdmin: DataUserContext
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

function Options({ loading, dataAdmin, domain, idUser, user, users, windowsAction, setWindowsAction, setUserEdit, FilterFixed, setUsers, setLoading, ResetConfig }: Props) {
  const messageFix = { pending: "Fixando usuário...", success: "Usuário fixado com sucesso." }
  const messageUnFix = { pending: "Desfixando usuário...", success: "Usuário fixado com sucesso." }
  const [modalEvent, setModalEvent] = useState<boolean>(false)
  const [modalAdminOptions, setModalAdminOptions] = useState<boolean>(false)
  const [modal, setModal] = useState<Modal>({ status: false, title: '', subject: '', target: '' })
  const toastDisable = { pending: "Trocando status do usuário.", success: "Status trocado com sucesso." };
  const toastResendEmail = { pending: "Enviando email...", success: "Reenviamos uma confirmação para este email, verifique a caixa de span!", error: 'Erro ao enviar a confirmação de email, crie este usuário novamente. Caso o erro persista, entre em contato com o suporte.' }
  const { dataCompany } = useContext(companyContext)

  //Confirmação de deletar usuário
  function ConfirmationDeleteUser() {
    setModal({ status: true, title: 'Deletar Usuário', subject: 'o usuário', target: 'Natã' })
  }

  //Resposta da confirmação
  const childModal = () => {
    toast.promise(DeletUser({ user, users, domain, ResetConfig }), { pending: "Deletando o usuário...", success: "O usuário foi deletado com sucesso.", error: "Não foi possivel deletar o usuário." });
    setModal({ status: false, title: '', subject: '', target: '' })
  }

  async function GetFunctionDisableUser() {
    setLoading(true)
    try {
      const result = await DisableUser({ users, user, id_company: dataAdmin.id_company, setUsers })
    } catch (e) {
      throw e
    } finally {
      setLoading(false)
    }
  }

  async function ActiveSendEmail() {
    try {
      const result = await axios.post('/api/users/confirmEmail', {
        email: user.email,
        company: dataCompany.name,
        id_user: user.id,
        id_company: dataCompany.id
      })
      if (result.data != 'success') {
        throw console.log(result)
      }
    } catch (e) {
      throw console.log(e)
    }
  }

  return (
    <>
      {modal.status && <ModalDelete modal={modal} childModal={childModal} setModal={setModal} />}
      {modalAdminOptions && <ModalSetAdmin setModalAdminOptions={setModalAdminOptions} user={user} dataAdmin={dataAdmin} setUsers={setUsers} users={users} />}
      {modalEvent && <ModalEvent emailUser={user.email} defaultValue={{ label: user.name, value: { id_user: user.id } }} action={'create'} modalEvent={modalEvent} setModalEvent={setModalEvent} />}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild className='flex justify-center items-center'>
          <button className="flex  cursor-pointer w-[20px] h-[20px] justify-between" aria-label="Customize options">
            <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full' />
            <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full' />
            <div className='w-[5px] h-[5px] bg-black dark:bg-white rounded-full' />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal >
          <DropdownMenu.Content align="end" alignOffset={-25} className="p-[3px] bg-primary dark:bg-dprimary text-[#686868] dark:text-white rounded-[6px] flex flex-col drop-shadow-[0_4px_8px_rgba(0,0,0,0.50)]" sideOffset={5}>
            <DropdownMenu.Item className="cursor-pointer rounded-[6px] hover:outline-none  hover:bg-emerald-500 hover:text-[#fff] duration-100">
              <Link href={{ pathname: '/Dashboard/Admin/Pastas', query: { id_user: idUser } }} className='cursor-pointer flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                <FileIcon width={18} height={18} />
                Documentos
              </Link>
            </DropdownMenu.Item>

            {dataAdmin?.permission === 3 &&
              <DropdownMenu.Item className="cursor-pointer rounded-[6px] hover:outline-none  hover:bg-emerald-500 hover:text-[#fff] duration-100">
                <div onClick={() => setModalAdminOptions(true)} className='cursor-pointer flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                  <PersonIcon width={18} height={18} />
                  Definir Admins
                </div>
              </DropdownMenu.Item>
            }

            <DropdownMenu.Item className={`cursor-pointer rounded-[6px] ${dataAdmin.permission < 2 ? 'hover:bg-none' : 'hover:bg-emerald-500 hover:text-[#fff] hover:outline-none'} duration-100`}>
              <button disabled={dataAdmin.permission < 2} onClick={() => (setUserEdit(user), setWindowsAction({ ...windowsAction, updateUser: true }))} className='rounded-[6px] w-full cursor-pointer flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                <Pencil2Icon width={18} height={18} />
                Editar
              </button>
            </DropdownMenu.Item>

            <DropdownMenu.Item className={`cursor-pointer rounded-[6px] ${dataAdmin.permission < 2 ? 'hover:bg-none' : 'hover:bg-emerald-500 hover:text-[#fff] hover:outline-none'} duration-100`}>
              <button disabled={dataAdmin.permission < 2} onClick={() => setModalEvent(true)} className='cursor-pointer rounded-[6px] w-full flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                <StopwatchIcon width={18} height={18} />
                Novo Evento
              </button>
            </DropdownMenu.Item>

            <DropdownMenu.Item className="cursor-pointer rounded-[6px] hover:outline-none  hover:bg-emerald-500 hover:text-[#fff] duration-100">
              <Link href={`/Dashboard/Admin/Calendario/${user.id}/${user.name}`} className='cursor-pointer flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                <CalendarIcon width={18} height={18} />
                Calendário
              </Link>
            </DropdownMenu.Item>


            <DropdownMenu.Item disabled={dataAdmin?.permission < 2 || loading ? true : false} onClick={() => toast.promise(GetFunctionDisableUser(), toastDisable)} className="cursor-pointer rounded-[6px] hover:outline-none  hover:bg-emerald-500 hover:text-[#fff] duration-100">
              <button className='cursor-pointer flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                <UpdateIcon width={18} height={18} />
                Trocar Status
              </button>
            </DropdownMenu.Item>

            <DropdownMenu.Item className={`cursor-pointer rounded-[6px] ${dataAdmin.permission < 2 ? 'hover:bg-none' : 'hover:bg-emerald-500 hover:text-[#fff] hover:outline-none'} duration-100`}>
              {user.fixed ?
                <button disabled={dataAdmin.permission < 2} onClick={() => toast.promise(UnFix({ user: user, users: users, FilterFixed: FilterFixed, setUsers: setUsers }), messageUnFix)} className='cursor-pointer rounded-[6px] w-full flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                  <DrawingPinFilledIcon width={20} height={20} />
                  Desfixar
                </button>
                :
                <button disabled={dataAdmin.permission < 2} onClick={() => toast.promise(Fix({ user: user, users: users, FilterFixed: FilterFixed, setUsers: setUsers }), messageFix)} className='cursor-pointer rounded-[6px] w-full flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                  <DrawingPinIcon width={20} height={20} />
                  Fixar
                </button>
              }
            </DropdownMenu.Item>

            {!user.verifiedEmail &&
              <DropdownMenu.Item className={`cursor-pointer rounded-[6px]  hover:bg-emerald-500 hover:text-[#fff] duration-100`}>
                <button onClick={() => toast.promise(ActiveSendEmail(), toastResendEmail)} className='cursor-pointer rounded-[6px] w-full flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                  <PaperPlaneIcon width={20} height={20} />
                  Reenviar email
                </button>
              </DropdownMenu.Item>
            }

            <DropdownMenu.Item className={`cursor-pointer rounded-[6px] ${dataAdmin.permission < 2 ? 'hover:bg-none' : 'hover:bg-[#BE0000] hover:text-[#fff] hover:outline-none'} duration-100`}>
              <button disabled={dataAdmin.permission < 3} onClick={() => ConfirmationDeleteUser()} className='cursor-pointer rounded-[6px] w-full flex items-center gap-x-[5px] px-[10px] py-[3px]'>
                <TrashIcon width={20} height={20} />
                Excluir usuário
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};

export default Options;