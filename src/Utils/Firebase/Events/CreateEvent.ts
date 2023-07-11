import axios from 'axios'
import { doc, setDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { db } from '../../../../firebase'
import { Event } from '../../../types/event'

interface PropsCreateEvent {
    event:Event
    email:string
    id_company:string
}

export default async function createEvent({event, email, id_company}:PropsCreateEvent) {      
    const result = await toast.promise(CreatEventFireStore(), {pending:'Criando evento...', success:'Evento criado com sucesso!'})

    async function CreatEventFireStore(){
        try{            
            const response = await setDoc(doc(db, "companies", id_company, "events", event.id), event)
            SendEmail()
        } catch(e){
            console.log(e)
            throw Error
        }

    }

    async function SendEmail() {
        const data = {
            email: email,
            title: event.title,
            description: event.description,
            enterprise: event.nameEnterprise,
            dateStarted: event.dateStarted
        }

        const domain:string = new URL(window.location.href).origin
        
        try{
          const result = await axios.post(`${domain}/api/events/sendEmail`, data)  
          if(result.status === 200){
            toast.success('Enviamos um email para seu cliente, notificando sobre este evento.')
          }
        }catch(e){
            console.log(e)
            throw Error
        }
    }
}
