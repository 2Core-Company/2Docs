import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../../../firebase"

export async function UpdateStatusEvent({id_company, id_event}){
    await updateDoc(doc(db, 'companies', id_company, "events", id_event), {
        complete:true
    })    
}