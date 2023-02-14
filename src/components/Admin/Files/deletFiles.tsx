import {db, storage} from '../../../../firebase'
import { doc,deleteDoc} from "firebase/firestore";  
import { ref, deleteObject} from "firebase/storage";
import { Files } from '../../../types/interfaces'

interface Props{
  files:Files[], 
  selectFiles:Files[], 
  childToParentDelet:Function
}

async function deletFiles({files, selectFiles, childToParentDelet}:Props) {
    try{
      if(selectFiles.length > 0) {
        for(let i = 0; i < selectFiles.length; i++){
          const desertRef = ref(storage, selectFiles[i].id_company + '/files/' + selectFiles[i].id_user + "/" + selectFiles[i].id_file);
          const result = await deleteObject(desertRef)
          const response = await deleteDoc(doc(db, 'files', selectFiles[i].id_company, "Arquivos", selectFiles[i].id_file));
          const index:number = files.findIndex(file => file.id_file === selectFiles[i].id_file)
          files.splice(index, 1);
        }
        childToParentDelet(files)
      }
    } catch(e) {
      console.log(e)
    }
}

export default deletFiles