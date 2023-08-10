import React, { Dispatch, SetStateAction, useState } from 'react'
import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { DataUser } from '../../../types/users'
import * as Dialog from '@radix-ui/react-dialog';
import { Pencil2Icon } from '@radix-ui/react-icons';

interface Props {
  user: DataUser,
  index: number
  modalRenameEnterprise:boolean
  setUser: Dispatch<SetStateAction<DataUser>>
  setModalRenameEnterprise:Dispatch<SetStateAction<boolean>>
}

function Rename({ user, index,  modalRenameEnterprise, setUser, setModalRenameEnterprise }: Props) {
  const [nameEnterprise, setNameEnterprise] = useState(user.enterprises[index].name)


  async function ChangeName() {
    const enterprises = [...user.enterprises]
    const index2 = enterprises.findIndex((enterprise) => enterprise.name === nameEnterprise)
    if (index2 > -1) {
      return toast.error('Uma empresa não pode ter o mesmo nome de outra empresa.-')
    }

    enterprises[index].name = nameEnterprise

    try {
      await updateDoc(doc(db, 'companies', user.id_company, "clients", user.id), {
        enterprises: enterprises
      })
      setUser({ ...user, enterprises: enterprises })
      setModalRenameEnterprise(false)
    } catch (e) {
      console.log(e)
      throw toast.error("Não foi possivél alterar o nome desta empresa.")
    }
  }

  async function OnToast() {
    if (nameEnterprise.trim().length < 4) {
      return toast.error('O nome da empresa precisa ter no minimo 4 caracteres.')
    }

    if (nameEnterprise === user.enterprises[index].name) {
      setModalRenameEnterprise(false)
    }
    const result = await toast.promise(ChangeName(), { pending: "Alterando nome da empresa.", success: "O nome da empresa foi alterado com sucesso." })
  }

  return (
    <Dialog.Root open={modalRenameEnterprise} onOpenChange={setModalRenameEnterprise}>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-20' />
        <Dialog.Content className='bg-primary data-[state=open]:animate-contentShow fixed top-[50%] rounded-[15px] left-[50%] w-[400px] max-lsm:w-[350px] overflow-hidden  translate-x-[-50%] translate-y-[-50%] focus:outline-none z-20 max-h-[95%] overflow-y-auto'>
          <div className='bg-[rgb(138,129,184)] w-full h-[15px] rounded-t-[15px]' />
          <div className='flex flex-col px-[20px]'>
            <p className='text-[24px] max-lsm:text-[20px] mt-[10px] text-left'>Altere o nome da sua empresa</p>
            <div className='mt-[15px] '>
              <p className='self-start text-[18px] justify-self-start text-left'>Nome da empresa:</p>
              <input value={nameEnterprise} required onChange={(text) => setNameEnterprise(text.target.value)} maxLength={25} className='mt-[5px] w-full text-[18px] bg-transparent border-[1px] border-black py-[6px] px-[10px] rounded-[6px] ' placeholder='Nome da empresa' />
            </div>
          </div>

          <div className='font-[500] flex w-full justify-between bg-[#D9D9D9] border-t border-t-[#AAAAAA] self-end py-[10px] rounded-b-[15px] mt-[25px] px-[20px]'>
            <Dialog.Close className='px-[13px] py-[6px] cursor-pointer text-[#5C5C5C] border-[1px] border-strong hover:bg-[#cecbcb] duration-100 rounded-[8px]'>
              Cancelar
            </Dialog.Close>
            <button onClick={() => OnToast()} className={`px-[13px] py-[6px] cursor-pointer ${nameEnterprise.length > 3 ? "bg-[rgba(138,129,184,0.20)] text-[#3e3279] border-[#8a81b8] hover:bg-[rgba(138,129,184,0.40)]" : "bg-strong/30 border-strong text-[#777777]"} border duration-100 rounded-[8px]`}>
              Renomear
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root >
  )
}

export default Rename


