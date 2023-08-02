import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../../../firebase"

interface UpdateStatusDelivered {
    id_company:string
    id_event:string
    status:boolean
}

export async function UpdateStatusDelivered({id_company, id_event, status}:UpdateStatusDelivered){
    try{
        await updateDoc(doc(db, 'companies', id_company, "events", id_event), {
            delivered:status
        })    
    } catch (e){
        console.log(e)
    }
}