import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../../../firebase"

interface UpdateLastModify {
    id_company:string
    id_event:string
    date:number
}

export async function UpdateLastModify({id_company, id_event, date}:UpdateLastModify){
    await updateDoc(doc(db, 'companies', id_company, "events", id_event), {
        lastModify:date
    })    
}