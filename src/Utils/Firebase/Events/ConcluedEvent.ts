import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../../../firebase"

interface UpdateEvent {
    id_company:string
    id_event:string
}

async function ConcluedEvent({id_company, id_event}:UpdateEvent) {
    try{
        const result = await updateDoc(doc(db, 'companies', id_company, "events", id_event), {
            complete:true
        })   
    } catch (e) {
        console.log(e)
    }
}

export default ConcluedEvent