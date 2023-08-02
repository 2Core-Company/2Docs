import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../../../firebase'
import { Notification } from '../../../types/notification'

interface Props{
    notification:Notification
    id_company:string
    addressee:string
}

export default async function createNotification({notification, id_company, addressee}:Props) {
    // CreatNotificationFireStore()
    
    // async function CreatNotificationFireStore(){
    //     try{            
    //         const response = await setDoc(doc(db, "notifications", id_company, addressee, notification.id),notification)
    //     } catch(e){
    //         console.log(e)
    //         throw Error
    //     }

    // }
}

