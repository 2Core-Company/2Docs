import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';

interface PropsGetEnterprises {
    id_company:string
    id_user:string
}

export async function GetEnterprises({id_company, id_user}:PropsGetEnterprises) {
    const docRef = doc(db, "companies", id_company, "clients", id_user);
    const docSnap = await getDoc(docRef);
    return docSnap.data()?.enterprises
}
