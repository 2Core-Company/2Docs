import {db, storage} from '../../../../firebase'
import { doc,deleteDoc} from "firebase/firestore";  
import { ref, deleteObject} from "firebase/storage";
import { Files } from '../../../types/interfaces'
import { AlterSizeCompany } from '../../../Utils/Firebase/AlterSizeCompany';

interface Props{
  files?:Files[], 
  selectFiles:Files[], 
  childToParentDelet?:Function
}

async function DeletFiles({files, selectFiles, childToParentDelet}:Props) {
  try{
    if(selectFiles.length > 0) {
      var totalSizeFiles = 0
      for await (const file of selectFiles){
        const desertRef = ref(storage, file.id_company + '/files/' + file.id_user + "/" + file.id_file);
        const result = await deleteObject(desertRef)
        const response = await deleteDoc(doc(db, 'files', file.id_company, "documents", file.id_file));
        if(files){
          const index:number = files.findIndex(file => file.id_file === file.id_file)
          files.splice(index, 1);
          childToParentDelet(files)
        }
        totalSizeFiles = totalSizeFiles + file.size
      }
      AlterSizeCompany({id_company:selectFiles[0].id_company, action:'subtraction', size:totalSizeFiles})
    }
  } catch(e) {
    console.log(e)
  }
}

export default DeletFiles