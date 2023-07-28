import React, { useContext, useState } from 'react';
import * as Menubar from '@radix-ui/react-menubar';
import { CheckCircledIcon, DotsVerticalIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import ModalEvent from '../../Admin/Calendar/modalEvent';
import { Event } from '../../../types/event';
import ConcluedEvent from '../../../Utils/Firebase/Events/ConcluedEvent'
import { companyContext } from '../../../app/Context/contextCompany';
import { toast } from 'react-toastify';
import { UpdatePendencies } from '../../../Utils/Firebase/Users/UpdatePendencies';
import { Modal } from '../../../types/others';
import ModalDelete from '../../../Utils/Other/modalDelete';
import DeletEvent from '../../../Utils/Firebase/Events/DeletEvent';
import DeletFiles from '../Files/deleteFiles';
import { Files } from '../../../types/files';
import { useRouter } from 'next/navigation';

interface Props {
    files:Files[]
    event: Event
    childModalEvent: Function
    childConcluedEvent: Function
}

function OptionsEvent({ files, event, childModalEvent, childConcluedEvent }: Props) {
    const [modalEvent, setModalEvent] = useState(false)
    const { dataCompany } = useContext(companyContext)
    const toastMessage = {pending:'Completando evento...', success:'Evento completo.'}
    const dataModal = {title:'Deletar Evento', subject:'evento'}
    const [modal, setModal] = useState<Modal>({status:false, title:'', subject:'', target:''})
    const router = useRouter()

    async function ChildModalDelet(){
        const result = await DeletEvent({id_company:dataCompany.id, id_event:event.id})

        if(files){
            const response = await DeletFiles({id_company:dataCompany.id, selectFiles:files})
        }

        if(!event.complete){
            const result = await UpdatePendencies({id_company:dataCompany.id, id_user:event.id_user, action:'subtraction'})
        }
        setModal({status:false, title:'', subject:'', target:''})
        router.replace(`/Dashboard/Admin/Calendario/${event.id_user}/${event.userName}`)
    }


    async function CompleteEvent() {
        if (event.complete) {
            return toast.info('Este evento ja foi concluido!')
        }

        const result1 = toast.promise(async () => {
            const result = await ConcluedEvent({ id_company: dataCompany.id, id_event: event.id })
            const response = await UpdatePendencies({id_company:dataCompany.id, id_user:event.id_user, action:'subtraction'})
        }, toastMessage)

        childConcluedEvent()
    }

    return (
        <Menubar.Root>
            {modal.status && <ModalDelete modal={modal} setModal={setModal} childModal={ChildModalDelet}/>}
            {modalEvent && <ModalEvent defaultValue={{label:event.userName, value:{id_user:event.id_user}}} event={event}  action='edit' modalEvent={modalEvent} setModalEvent={setModalEvent} childModalEvent={childModalEvent} />}
            <Menubar.Menu>
                <Menubar.Trigger className='outline-none'>
                    <DotsVerticalIcon width={25} height={25} className='text-black' />
                </Menubar.Trigger>
                <Menubar.Portal>
                    <Menubar.Content className="flex flex-col  text-[#9E9E9E] rounded px-[2px] py-[5px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.violet7)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade" sideOffset={5}>
                        <Menubar.Item onClick={() => setModalEvent(true)} className='cursor-pointer outline-none flex items-center gap-x-[5px] hover:text-white hover:bg-emerald-500 px-[7px] py-[2px] rounded-[4px]'>
                            <Pencil2Icon width={20} height={20} />
                            <p>Editar Evento</p>
                        </Menubar.Item >

                        <Menubar.Item onClick={() => setModal({status:true, ...dataModal, target:event.title})} className='cursor-pointer outline-none flex items-center gap-x-[5px] hover:text-white hover:bg-[#BE0000] px-[7px] py-[2px] rounded-[4px]'>
                            <TrashIcon width={20} height={20} />
                            <p>Apagar Evento</p>
                        </Menubar.Item >

                        <Menubar.Item onClick={async () => await CompleteEvent()} className='cursor-pointer outline-none flex items-center gap-x-[5px] hover:text-white hover:bg-emerald-500 px-[7px] py-[2px] rounded-[4px]'>
                            <CheckCircledIcon width={20} height={20} />
                            <p>Fechar Evento</p>
                        </Menubar.Item >

                        <Menubar.Arrow className="fill-white" />
                    </Menubar.Content>
                </Menubar.Portal>
            </Menubar.Menu>
        </Menubar.Root>
    )
}

export default OptionsEvent