import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/interfaces'

  function Desfavorite(props:{desfavoriteFile:any, files:Files[], from:string, childToParentDownload:Function }) { 
    const fileDesfavorite = props.desfavoriteFile                                                                                    
    const files =  props.files
    try{
        updateDoc(doc(db, 'files', fileDesfavorite .id_company, "Arquivos", fileDesfavorite.id_file), {
            favorite: false
        })
        const index = files.findIndex(file => file.id_file == fileDesfavorite.id_file)
        files[index].favorite = false
        console.log(files)
        props.childToParentDownload(files)
    } catch(e) {
    console.log(e)
    toast.error("Não foi possivél visualizar este arquivo.")
    }
}

export default Desfavorite