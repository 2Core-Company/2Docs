import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { Files } from '../../../types/files'
import { toast } from 'react-toastify';

interface Props{
    favoriteFile:Files
    files:Files[]
}

async function Favorite({favoriteFile, files}:Props) {                                                                      
    try{
        await updateDoc(doc(db, 'files', favoriteFile.id_company, favoriteFile.id_user, 'user', 'files', favoriteFile.id), {
            favorite: true
        })
        const index = files.findIndex(file => file.id == favoriteFile.id)
        files[index].favorite = true
        childToParentDownload(files)
    } catch(e) {
        console.log(e)
        toast.error("Não foi possivél favoritar este arquivo.")
    }
}

export default Favorite