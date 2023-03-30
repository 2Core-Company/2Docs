import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify'
import { db } from '../../../../firebase';
import { Files } from '../../../types/interfaces'
import copy from "copy-to-clipboard"

interface Props{
    file:Files
}

async function ShareFile({file}:Props) {
    if(file.viwed){
        return toast.error("Você não pode compartilhar um arquivo que ja foi visualizado.")
    } else {
        const docRef = doc(db, "companies", file.id_company);
        const docSnap = await getDoc(docRef)
        const nameCompany = docSnap.data().name

        const url = window.location.origin
        const urlFile = `${url}/CompartilharArquivo?ic=${file.id_company}&&if=${file.id_file}&&n=${file.name}&&d=${file.created_date}&&nc=${nameCompany}`
        copy(urlFile)
        toast.success('Link copiado!')
    } 
}

export default ShareFile