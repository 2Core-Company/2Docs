import { DotsVerticalIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import * as Menubar from '@radix-ui/react-menubar';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { loadingContext } from '../../../app/Context/contextLoading';
import { Enterprise, Modal } from '../../../types/others';
import { DataUser } from '../../../types/users';
import ModalDelete from '../../../Utils/Other/modalDelete';
import { deleteEnterprise } from './DeleteEnterprise';
import ModalRenameEnterprise from './modalRenameEnterprise';

interface Props {
    user:DataUser
    enterprise:Enterprise
    index:number
    setUser:React.Dispatch<React.SetStateAction<DataUser>>
    setEnterprise:React.Dispatch<React.SetStateAction<Enterprise>>
}

function OptionsEnterprise({user, enterprise, index, setUser, setEnterprise}:Props) {
    const { loading, setLoading } = useContext(loadingContext)
    const [modalRenameEnterprise, setModalRenameEnterprise] = useState(false)
    const [modalDelete, setModalDelete] = useState<Modal>({ status: false, title: '', subject: '', target: '' })
    const dataModalActive:Modal = {status:true, title:'Deletar Empresa', subject:'a empresa', target:enterprise.name}
    
    async function childModalDelete() {
        setModalDelete({ status: false, title: '', subject: '', target: '' })
        setLoading(true)
        const result = await toast.promise(deleteEnterprise({user, enterprise, setUser, setEnterprise }), { pending: "Deletando empresa...", success: "Empresa deletada com sucesso." })
        setLoading(false)
    }
    return (
        <Menubar.Root>
            {modalDelete.status && <ModalDelete modal={modalDelete} setModal={setModalDelete} childModal={childModalDelete} />}
            {modalRenameEnterprise && <ModalRenameEnterprise user={user} index={index} modalRenameEnterprise={modalRenameEnterprise} setUser={setUser} setModalRenameEnterprise={setModalRenameEnterprise} />}
            <Menubar.Menu>
                <Menubar.Trigger disabled={loading} className='outline-none cursor-pointer h-[20px] flex items-center'>
                    <DotsVerticalIcon height={20} width={20} />
                </Menubar.Trigger>
                <Menubar.Portal>
                    <Menubar.Content className='bg-[#fff] text-[#686868] drop-shadow-[0_5px_5px_rgba(0,0,0,0.20)] rounded-[6px] p-[3px]'>
                        <Menubar.Item onClick={() => setModalRenameEnterprise(true)} className='cursor-pointer outline-none hover:bg-emerald-500 hover:text-[#fff] duration-100 rounded-[6px] flex items-center px-[10px] py-[3px]'>
                            <Pencil2Icon width={20} height={20} />
                            <p className='ml-[5px]'>Renomear</p>
                        </Menubar.Item>

                        <Menubar.Item onClick={() => setModalDelete(dataModalActive)} className='cursor-pointer outline-none hover:bg-[#BE0000] hover:text-[#fff] duration-100 rounded-[6px] flex items-center px-[10px] py-[3px]'>
                            <TrashIcon width={20} height={20} />
                            <p className='ml-[5px]'>Excluir</p>
                        </Menubar.Item>

                        <Menubar.Arrow fill={'#EBEBEB'} />
                    </Menubar.Content>
                </Menubar.Portal>
            </Menubar.Menu>
        </Menubar.Root>
    )
}

export default OptionsEnterprise
