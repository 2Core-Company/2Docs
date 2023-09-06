import axios from 'axios'
import { doc, setDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { db } from '../../../../firebase'
import { Event } from '../../../types/event'

interface PropsCreateEvent {
    event: Event
    email: string
    id_company: string
    url:string
}

export default async function createEvent({ event, email, id_company, url }: PropsCreateEvent) {
    try {
        const response = await setDoc(doc(db, "companies", id_company, "events", event.id), event)
        const result = await SendEmail()
    } catch (e) {
        console.log(e)
        throw Error
    }

    async function SendEmail() {
        const data = {
            email,
            title: event.title,
            description: event.description,
            enterprise: event.nameEnterprise,
            dateStarted: event.dateStarted,
            url
        }

        const domain: string = new URL(window.location.href).origin

        try {
            const result = await axios.post(`${domain}/api/events/notifyEvent`, data)

            if (result?.data === 'success') {
                toast.success('Enviamos um email para seu cliente, notificando sobre este evento.')
            } else {
                toast.info('Não foi possivelenviar um email para o cliente notificando a criação deste evento')
            }
        } catch (e) {
            console.log(e)
            throw Error
        }
    }
}