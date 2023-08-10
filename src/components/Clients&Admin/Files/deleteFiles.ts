import {db, storage} from '../../../../firebase'
import { doc, writeBatch} from "firebase/firestore";  
import { ref, deleteObject} from "firebase/storage";
import { Files } from '../../../types/files'
import updateSizeCompany from '../../../Utils/Firebase/Company/UpdateSizeCompany';

interface Props{
  files?:Files[]
  selectedFiles:Files[]
  id_company:string 
}

async function deleteFiles({ files, selectedFiles, id_company }:Props) {
  const batch = writeBatch(db);
  const promises:any = []
  var size = 0
  try{
    if(selectedFiles.length > 0) {
      for await (const file of selectedFiles){
        const ref1 = doc(db, 'files', file.id_company, file.id_user, 'user', 'files', file.id)
        const desertRef = ref(storage, file.path);
        promises.push(deleteObject(desertRef))
        batch.delete(ref1)
        if(files){
          const index:number = files.findIndex((dataFile) => dataFile.id === file.id)
          files.splice(index, 1);
        }
        size += file.size
      }

      await updateSizeCompany({id_company:id_company, size, action:'subtraction'})

      await Promise.all([promises, batch.commit()])
      return files
    }
  } catch(e) {
    console.log(e)
  }
}


export default deleteFiles