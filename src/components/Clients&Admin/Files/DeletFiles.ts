import {db, storage} from '../../../../firebase'
import { doc, writeBatch} from "firebase/firestore";  
import { ref, deleteObject} from "firebase/storage";
import { Files } from '../../../types/files'
import { DataCompanyContext } from '../../../types/dataCompany';
import updateSizeCompany from '../../../Utils/Firebase/Company/UpdateSizeCompany';

interface Props{
  files?:Files[]
  selectFiles:Files[]
  dataCompany:DataCompanyContext
  childToParentDelet?:Function
}

async function deletFiles({files, selectFiles, dataCompany, childToParentDelet}:Props) {
  const batch = writeBatch(db);
  const promises:any = []
  var size = 0
  try{
    if(selectFiles.length > 0) {
      for await (const file of selectFiles){
        const ref1 = doc(db, 'files', file.id_company, file.id_user, 'user', 'files', file.id)
        const desertRef = ref(storage, file.path);
        promises.push(deleteObject(desertRef))
        batch.delete(ref1)
        if(files && childToParentDelet){
          const index:number = files.findIndex(file => file.id === file.id)
          files.splice(index, 1);
        }
        size += file.size
      }

      await updateSizeCompany({id_company:dataCompany.id, size, action:'subtraction'})

      await Promise.all([promises, batch.commit()])

      if(childToParentDelet){
        childToParentDelet(files)
      }
    }
  } catch(e) {
    console.log(e)
  }
}


export default deletFiles