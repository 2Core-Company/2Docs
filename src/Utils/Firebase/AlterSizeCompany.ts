import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";


interface Props{
    id_company:string
    action:string
    size:number
}

export async function AlterSizeCompany({id_company, action, size}:Props){
    const docRef = doc(db, "companies", id_company);
    const docSnap = await getDoc(docRef);
    var dataCompany
    var totalSize

    if (docSnap.exists()) {
        dataCompany = docSnap.data()
    }

    if(action === 'sum'){
        totalSize = dataCompany.size + (size / 1000)
    }

    if(action === 'subtraction'){
        totalSize = parseInt(dataCompany.size) - size
    }

    const a = await (updateDoc(doc(db, 'companies', id_company), {
        size:totalSize
    }))
    
}