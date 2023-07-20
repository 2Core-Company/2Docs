import { deleteDoc, doc } from 'firebase/firestore'
import React from 'react'
import { db } from '../../../../firebase'

export default async function DeletEvent({id_company, id_event}) {
    try{
        const response = await deleteDoc(doc(db, "companies", id_company, "events", id_event))
    } catch (e){
        console.log(e)
        throw e
    }

}
