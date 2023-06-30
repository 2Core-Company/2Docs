import { deleteDoc, doc, writeBatch } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { db, storage } from '../../../../firebase'
import {  Files } from '../../../types/files'
import { Event } from '../../../types/event'
import { Modal } from '../../../types/others'
import ModalDelete from '../../../Utils/Other/modalDelete'
import updateSizeCompany from '../../../Utils/Firebase/Company/UpdateSizeCompany'


interface Props{
    eventSelected:Event
    eventsThatDay:Event[]
    files:Files[]
    events:Event[]
    id_company:string
    setEventSelected:Function
    setEventsThatDay:Function
}

function DeletEvents({eventSelected, eventsThatDay, files, events, id_company, setEventSelected,  setEventsThatDay}:Props) {
    const messageToast = {pending:'Deletando evento....', success:'Evento deletado com sucesso.', error:'Não foi possivel deletar este evento.'}
    const [modal, setModal] = useState<Modal>({status: false, title:'', subject:'', target:''})
    const messageModal = {status: true, title: "Deletar Evento", subject:'o evento', target:eventSelected.title}
    
    const childModal = () => {
        setModal({status: false, title:'', subject:'', target:''})
        toast.promise(DeletEvent, messageToast)
    }

    async function DeletEvent() {
        await Promise.all([
            deleteDoc(doc(db, "companies", id_company, 'events', eventSelected.id)),
            DeletFilesStorage(),
            DeletFilesFireStore()  
        ])
        const index1 = events.findIndex(event => event.id == eventSelected.id)
        const index2 = eventsThatDay.findIndex(event => event.id == eventSelected.id)
        events.splice(index1, 1)
        eventsThatDay.splice(index2, 1)

        if(eventsThatDay.length > 0){
            setEventSelected()
        } else {
            setEventsThatDay()
        }
    }

    async function DeletFilesStorage() {
        try{
            const promises:any = []
            for(const file of files){
                const desertRef = ref(storage, file.path);
                promises.push(deleteObject(desertRef))
            }
            await Promise.all(promises)
        }catch(e){
            console.log(e)
            throw Error
        }
    }

    async function DeletFilesFireStore() {
        const batch = writeBatch(db);
        var size = 0
        try{
            for await(const file of files){
                batch.delete(doc(db, 'files', file.id_company, file.id_user, 'user', 'files', file.id))
                size +=file.size
            }

            await updateSizeCompany({id_company, size, action:'subtraction'})
            
            await batch.commit()
        }catch(e){
            console.log(e)
            throw Error
        }
    }
    
  return (
    <>
        {modal.status ? <ModalDelete modal={modal} setModal={setModal} childModal={childModal}/> : <></>}
        <div className='border-red border-[2px] self-center rounded-[4px] mt-[15px] hover:scale-105'>
            <button onClick={() => setModal(messageModal) } className="cursor-pointer text-red bg-red/20  self-center text-[20px] max-lsm:text-[18px] px-[8px] py-[2]">Deletar</button>
        </div>
    </>
  )
}

export default DeletEvents