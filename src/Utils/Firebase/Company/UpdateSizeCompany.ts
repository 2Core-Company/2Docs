import { ref, runTransaction } from "firebase/database";
import { database } from '../../../../firebase'

interface Props{
    id_company:string
    size:number
    action:string
}

export default async function updateSizeCompany({id_company, size, action}:Props) {
    const postRef = ref(database, `/usage/${id_company}`);

    await runTransaction(postRef, (company) => {
        if (company) {
            if (company.size || company.size === 0){
                if(action === 'sum'){
                    const totalSize = company.size + size
                    company.size = totalSize
                } else if (action === 'subtraction') {
                    const totalSize = company.size - size 
                    company.size = totalSize
                }
            } 
        }
        return company;
    });

    return {message:'Updade size company done with success', status:200}

  }

  