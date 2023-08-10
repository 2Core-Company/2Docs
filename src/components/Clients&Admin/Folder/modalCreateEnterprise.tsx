import { useContext, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import { PlusIcon } from '@radix-ui/react-icons';
import { DataUser } from '../../../types/users';
import { v4 as uuidv4 } from 'uuid';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { toast } from 'react-toastify';
import { adminContext } from '@/src/app/Context/contextAdmin';

interface Props {
    user: DataUser
    setUser: React.Dispatch<React.SetStateAction<DataUser>>
}

function ModalCreateFolder({ user, setUser }: Props) {
    const [nameEnterprise, setNameEnterprise] = useState("")
    const messageToast = { pending: "Criando uma Empresa.", success: "Uma empresa foi criada com sucesso.", error: "Não foi possivel criar uma empresa." }
    const [modalCreateEnterprise, setModalCreateEnterprise] = useState(false)
    const { dataAdmin } = useContext(adminContext);

    async function CreateEnterprise() {
        const enterprises = user.enterprises

        enterprises.push({
            name: nameEnterprise,
            id: uuidv4(),
            folders: [
                { color: "#005694", name: "Cliente", isPrivate: false, onlyMonthDownload: false, singleDownload: false, timeFile: 3, id: uuidv4() },
                { color: "#C7A03C", name: "Favoritos", isPrivate: false, onlyMonthDownload: false, singleDownload: false, timeFile: 3, id: uuidv4() },
                { color: "#9E9E9E", name: "Lixeira", isPrivate: false, onlyMonthDownload: false, singleDownload: false, timeFile: 3, id: uuidv4() }
            ]
        })

        try {
            await updateDoc(doc(db, 'companies', user.id_company, "clients", user.id), {
                enterprises: enterprises
            })

            setUser({...user, enterprises:enterprises})
            setModalCreateEnterprise(false)
            setNameEnterprise("")
        } catch (e) {
            console.log(e)
            throw toast.update("Não foi possivél alterar o nome deste arquivo.")
        }
    }

    async function OnToast() {
        if(nameEnterprise.trim().length < 4){
            return toast.error('O nome da empresa precisa ter no minimo 4 caracteres.')
        }

        const result = user.enterprises.findIndex((enterprise) => enterprise.name === nameEnterprise)
        if (result >= 0) {
            return toast.error('Este usuário ja contém uma empresa com este nome.')
        }
        const response = await toast.promise(CreateEnterprise(), messageToast)
    }

    return (
        <Dialog.Root open={modalCreateEnterprise} onOpenChange={setModalCreateEnterprise} >
            <Dialog.Trigger disabled={dataAdmin.permission < 2} className='flex items-center text-emerald-500  hover:text-emerald-600 duration-100 border-b-[#686868] border-b py-[4px] px-[10px]'>
                <PlusIcon width={20} height={20} />
                Adicionar
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className='bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-20' />
                <Dialog.Content className='bg-primary data-[state=open]:animate-contentShow fixed top-[50%] rounded-[15px] left-[50%] w-[400px] max-lsm:w-[350px] overflow-hidden  translate-x-[-50%] translate-y-[-50%] focus:outline-none z-20 max-h-[95%] overflow-y-auto'>
                    <div className='bg-[rgb(138,129,184)] w-full h-[15px] rounded-t-[15px]' />
                    <div className='flex flex-col px-[20px]'>
                        <p className='text-[24px] max-lsm:text-[20px] mt-[10px] text-left'>Crie uma empresa</p>
                        <div className='mt-[15px] '>
                            <p className='self-start text-[18px] justify-self-start text-left'>Nome da empresa:</p>
                            <input required onChange={(text) => setNameEnterprise(text.target.value)} maxLength={25} className='mt-[5px] w-full text-[18px] bg-transparent border-[1px] border-black py-[6px] px-[10px] rounded-[6px] ' placeholder='Nome da empresa' />
                        </div>
                    </div>

                    <div className='font-[500] flex w-full justify-between bg-[#D9D9D9] border-t border-t-[#AAAAAA] self-end py-[10px] rounded-b-[15px] mt-[25px] px-[20px]'>
                        <Dialog.Close className='px-[13px] py-[6px] cursor-pointer text-[#5C5C5C] border-[1px] border-strong hover:bg-[#cecbcb] duration-100 rounded-[8px]'>
                            Cancelar
                        </Dialog.Close>
                        <button onClick={() => OnToast()} className={`px-[13px] py-[6px] cursor-pointer ${nameEnterprise.length > 3 ? "bg-[rgba(138,129,184,0.20)] text-[#3e3279] border-[#8a81b8] hover:bg-[rgba(138,129,184,0.40)]" : "bg-strong/30 border-strong text-[#777777]"} border duration-100 rounded-[8px]`}>
                            Criar
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default ModalCreateFolder