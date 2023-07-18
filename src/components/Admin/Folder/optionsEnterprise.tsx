import { DotsVerticalIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import * as Menubar from '@radix-ui/react-menubar';
import { useState } from 'react';
import { DataUser } from '../../../types/users';
import ModalRenameEnterprise from './modalRenameEnterprise';

interface Props {
    user:DataUser
    index:number
    setUser:React.Dispatch<React.SetStateAction<DataUser>>
}

function OptionsEnterprise({user, index, setUser}:Props) {
    const [modalRenameEnterprise, setModalRenameEnterprise] = useState(false)
    return (
        <Menubar.Root>
            {modalRenameEnterprise && <ModalRenameEnterprise user={user} index={index} modalRenameEnterprise={modalRenameEnterprise} setUser={setUser} setModalRenameEnterprise={setModalRenameEnterprise} />}
            <Menubar.Menu>
                <Menubar.Trigger>
                    <DotsVerticalIcon height={20} width={20} />
                </Menubar.Trigger>
                <Menubar.Portal>
                    <Menubar.Content className='bg-[#fff] text-[#686868] drop-shadow-[0_5px_5px_rgba(0,0,0,0.20)] rounded-[6px] p-[3px]'>
                        <Menubar.Item onClick={() => setModalRenameEnterprise(true)} className='cursor-pointer outline-none hover:bg-emerald-500 hover:text-[#fff] duration-100 rounded-[6px] flex items-center px-[10px] py-[3px]'>
                            <Pencil2Icon width={20} height={20} />
                            <p className='ml-[5px]'>Renomear</p>
                        </Menubar.Item>

                        <Menubar.Item className='cursor-pointer outline-none hover:bg-[#BE0000] hover:text-[#fff] duration-100 rounded-[6px] flex items-center px-[10px] py-[3px]'>
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