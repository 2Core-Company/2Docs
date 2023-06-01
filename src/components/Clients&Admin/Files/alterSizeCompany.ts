import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../../firebase'

export default async function AlterSizeCompany({size, id_company}) {
    await (updateDoc(doc(db, 'companies', id_company), {size:size}))
}
