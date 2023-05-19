import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/files'

interface Props{
    desfavoriteFile:Files
    files:Files[]
    folderName:string
    childToParentDownload:Function
  }

  async function Desfavorite({desfavoriteFile, files, childToParentDownload, folderName}: Props) {                                                                                   
    try{
        await updateDoc(doc(db, 'files', desfavoriteFile.id_company, desfavoriteFile.id_user, desfavoriteFile.id), {
            favorite: false
        })
        const index = files.findIndex(file => file.id == desfavoriteFile.id)
        if(folderName === "Favoritos"){
            files.splice(index, 1);
        } else {
            files[index].favorite = false
        }
        childToParentDownload(files)
    } catch(e) {
    console.log(e)
    toast.error("Não foi possivél visualizar este arquivo.")
    }
}

export default Desfavorite