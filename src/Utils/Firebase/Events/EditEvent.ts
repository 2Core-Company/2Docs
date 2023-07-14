import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../../../firebase"
import { Event } from "../../../types/event"

interface UpdateEvent {
    id_company:string
    event:Event
}

async function EditEvent({id_company, event}:UpdateEvent) {
    try{
        const result = await updateDoc(doc(db, 'companies', id_company, "events", event.id), {
            id_folder:event.id_folder,
            id_enterprise:event.id_enterprise,
            nameEnterprise:event.nameEnterprise,
            title:event.title,
            description:event.description,
            dateStarted:event.dateStarted,
            dateEnd:event.dateEnd,
            definedDate:event.definedDate,
            repeatMonths:event.repeatMonths,
            limitedDelivery:event.limitedDelivery
        })   
    } catch (e) {
        console.log(e)
    }
 
}

export default EditEvent