import {db, storage} from '../../../../firebase'
import { doc,deleteDoc} from "firebase/firestore";  
import { ref, deleteObject} from "firebase/storage";
import { Files } from '../../../types/interfaces'

async function deletFiles(props:{files:Files[], selectFiles:Files[], ResetConfig:Function},) {
    const filesHere = props.files
    const selectFiles = props.selectFiles
    try{
      if(selectFiles.length > 0) {
        for(let i = 0; i < selectFiles.length; i++){
          const desertRef = ref(storage, 'files/' + selectFiles[i].id_file);
          const result = await deleteObject(desertRef)
          const response = await deleteDoc(doc(db, "files", selectFiles[i].id_file));
          const index:number = filesHere.findIndex(file => file.id_file === selectFiles[i].id_file)
          filesHere.splice(index, 1);
        }
        props.ResetConfig(filesHere)
      }
    } catch(e) {
      console.log(e)
    }
}

export default deletFiles