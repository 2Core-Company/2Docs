import {db, storage} from '../../../../firebase'
import { doc,deleteDoc, writeBatch} from "firebase/firestore";  
import { ref, deleteObject} from "firebase/storage";
import { Files } from '../../../types/files'

interface Props{
  files?:Files[], 
  selectFiles:Files[], 
  childToParentDelet?:Function
}

async function DeletFiles({files, selectFiles, childToParentDelet}:Props) {
  const batch = writeBatch(db);
  const promises:any = []
  try{
    if(selectFiles.length > 0) {
      for await (const file of selectFiles){
        const ref1 = doc(db, 'files', file.id_company, file.id_user, 'user', 'files', file.id)
        const desertRef = ref(storage, file.path);
        promises.push(deleteObject(desertRef))
        batch.delete(ref1)
        if(files && childToParentDelet){
          const index:number = files.findIndex(file => file.id === file.id)
          file.checked = false
          files.splice(index, 1);
        }
      }
      await Promise.all([promises, batch.commit()])

      if(childToParentDelet){
        childToParentDelet(files)
      }
    }
  } catch(e) {
    console.log(e)
  }
}

export default DeletFiles