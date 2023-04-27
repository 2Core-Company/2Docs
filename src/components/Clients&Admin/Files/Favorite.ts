import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/files'

    interface Props{
        favoriteFile:Files
        files:Files[]
        childToParentDownload:Function
    }

  function Favorite({favoriteFile, files, childToParentDownload}:Props) {                                                                       
    try{
        updateDoc(doc(db, 'files', favoriteFile.id_company, "documents", favoriteFile.id_file), {
            favorite: true
        })
        const index = files.findIndex(file => file.id_file == favoriteFile.id_file)
        files[index].favorite = true
        childToParentDownload(files)
    } catch(e) {
    console.log(e)
    toast.error("Não foi possivél visualizar este arquivo.")
    }
}

export default Favorite