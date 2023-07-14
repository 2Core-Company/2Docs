import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../../../firebase"

interface UpdateStatusComplete {
    id_company:string
    id_event:string
    status:boolean
}

export async function UpdateStatusComplete({id_company, id_event, status}:UpdateStatusComplete){
    try {
        await updateDoc(doc(db, 'companies', id_company, "events", id_event), {
            complete:status
        })   
    } catch (e) {
        console.log(e)
    }
}