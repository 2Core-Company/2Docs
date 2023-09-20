import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import React from 'react'

async function getCompany({id_company}:{id_company:string}) {
    const docRef = doc(db, "companies", id_company);
    const docSnap = await getDoc(docRef);
    return docSnap
}

export default getCompany