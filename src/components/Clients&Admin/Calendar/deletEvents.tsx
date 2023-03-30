import { deleteDoc, doc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { db, storage } from '../../../../firebase'
import { Event, Modal, Files } from '../../../types/interfaces'
import { AlterSizeCompany } from '../../../Utils/Firebase/AlterSizeCompany'
import Modals from '../Modals'


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
    const [modal, setModal] = useState<Modal>({status: false, message: "", subMessage1: "", subMessage2:""})
    const messageModal = {status: true, message: "Tem certeza que deseja excluir este evento?", subMessage1: "Sera deletado os arquivos armazenados nele.", subMessage2: "Não sera possivel recupera-los."}

    const childModal = () => {
        setModal({status: false, message: "", subMessage1: ""})
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
            for(let i = 0; i < files.length; i++){
                const desertRef = ref(storage, files[i].id_company + '/files/' + files[i].id_user + "/" + files[i].id_file);
                const result = await deleteObject(desertRef)
            }
        }catch(e){
            console.log(e)
            throw Error
        }
    }

    async function DeletFilesFireStore() {
        try{
            var totalSize = 0
            for await(const file of files){
                const response = await deleteDoc(doc(db, 'files', file.id_company, "documents", file.id_file))
                totalSize = totalSize + file.size
            }
            console.log(files)
            console.log(totalSize)
            AlterSizeCompany({id_company: id_company, action:'subtraction', size:totalSize})
        }catch(e){
            console.log(e)
            throw Error
        }
    }
    
  return (
    <>
        {modal.status ? <Modals setModal={setModal} message={modal.message} subMessage1={modal.subMessage1} subMessage2={modal.subMessage2} childModal={childModal}/> : <></>}
        <div className='border-red border-[2px] self-center rounded-[4px] mt-[15px] hover:scale-105'>
            <button onClick={() => setModal(messageModal) } className="cursor-pointer text-red bg-red/20  self-center text-[20px] max-lsm:text-[18px] px-[8px] py-[2]">Deletar</button>
        </div>
    </>
  )
}

export default DeletEvents