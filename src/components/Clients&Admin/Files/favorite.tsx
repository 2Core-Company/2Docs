import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/interfaces'

  function Favorite(props:{favoriteFile:any, files:Files[], from:string, childToParentDownload:Function }) {                                                                            
    const fileFavorite = props.favoriteFile
    const files =  props.files
    try{
        updateDoc(doc(db, 'files', fileFavorite.id_company, "Arquivos", fileFavorite.id_file), {
            favorite: true
        })
        const index = files.findIndex(file => file.id_file == fileFavorite.id_file)
        files[index].favorite = true
        props.childToParentDownload(files)
    } catch(e) {
    console.log(e)
    toast.error("Não foi possivél visualizar este arquivo.")
    }
}

export default Favorite