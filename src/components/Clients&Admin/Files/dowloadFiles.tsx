import { db } from '../../../../firebase'
import { doc, getDoc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/interfaces'
import ViwedEvent from '../Calendar/viwedEvent';

interface Props{
  filesDownloaded:Files[]
  files?:Files[]
  folderName: string
  from:string
  childToParentDownload?:Function
}

async function DownloadsFile({filesDownloaded, files, childToParentDownload, from, folderName}:Props){
  const docRef = doc(db, "companies", files[0].id_company, "clients", files[0].id_user);
  const docSnap = await getDoc(docRef);
  let folder = docSnap.data().folders.filter((folder) => folder.name == folderName);

  try{
    for(var i = 0; i < filesDownloaded.length; i++){
      if(folder[0].singleDownload === true && filesDownloaded[i].downloaded === true) {
        return toast.error("Há arquivos selecionados que já foram baixados uma vez (Pasta configurada para downloads únicos).")
      }

      let blob = await fetch(filesDownloaded[i].url).then(r => r.blob());
      filesDownloaded[i].urlDownload = (window.URL ? URL : webkitURL).createObjectURL(blob)
    }
  }catch(e) {
    toast.error("Erro: " + e)
  }

  try{
    for(let i = 0; i < filesDownloaded.length; i++) {
      const element = document.createElement("a");
      element.href = filesDownloaded[i].urlDownload
      element.download = filesDownloaded[i].name;

      document.body.appendChild(element);

      element.click();

      element.parentNode.removeChild(element);

      filesDownloaded[i].checked = false

      await updateDoc(doc(db, 'files', filesDownloaded[i].id_company, "documents", filesDownloaded[i].id_file), {
        downloaded: true
      })

      let viewedDate = new Date().toString();

      const index = files.findIndex(file => file.id_file == filesDownloaded[i].id_file)
      files[index].downloaded = true;
      
      if(from === "user" && filesDownloaded[i].folder != "Cliente" && filesDownloaded[i].viwed === false){
        await updateDoc(doc(db, 'files', filesDownloaded[i].id_company, "documents", filesDownloaded[i].id_file), {
          viwed: true,
          viewedDate: viewedDate,
        })

        if(files){          
          files[index].viwed = true
          files[index].viewedDate = viewedDate;

          childToParentDownload(files)
        }
        }else if(from === "admin" && filesDownloaded[i].folder == "Cliente" && filesDownloaded[i].viwed === false){
          await updateDoc(doc(db, 'files', filesDownloaded[i].id_company, "documents", filesDownloaded[i].id_file), {
            viwed: true,
            viewedDate: viewedDate
          })
          if(files){            
            files[index].viwed = true
            files[index].viewedDate = viewedDate;            

            childToParentDownload(files)
          }
        }
    }
  } catch(e) {
    console.log(e)
    toast.error("Não foi possível baixar os arquivos.")
  }
}

  export default DownloadsFile