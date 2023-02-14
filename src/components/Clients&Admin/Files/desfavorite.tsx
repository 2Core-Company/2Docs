import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/interfaces'

interface Props{
    desfavoriteFile:Files
    files:Files[]
    folderName:string
    childToParentDownload:Function
  }

  function Desfavorite({desfavoriteFile, files, childToParentDownload, folderName}: Props) {                                                                                   
    try{
        updateDoc(doc(db, 'files', desfavoriteFile.id_company, "Arquivos", desfavoriteFile.id_file), {
            favorite: false
        })
        const index = files.findIndex(file => file.id_file == desfavoriteFile.id_file)
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