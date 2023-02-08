import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/interfaces'


async function DownloadsFile(props:{filesDownloaded?:Files[], files?:Files[], childToParentDownload:Function, from:string}){
  const filesDownloaded = props.filesDownloaded
  const files = props.files
  for(var i = 0; i < filesDownloaded.length; i++){
    let blob = await fetch(filesDownloaded[i].url).then(r => r.blob());
    filesDownloaded[i].urlDownload = (window.URL ? URL : webkitURL).createObjectURL(blob)
    console.log((window.URL ? URL : webkitURL).createObjectURL(blob))
  }
  try{
    for(let i = 0; i < filesDownloaded.length; i++) {
      const element = document.createElement("a");
      element.href = filesDownloaded[i].urlDownload
      element.download = filesDownloaded[i].name;

      document.body.appendChild(element);

      element.click();

      element.parentNode.removeChild(element);

      if(props.from === "user" && filesDownloaded[i].folder != "Cliente"){
        await updateDoc(doc(db, 'files', filesDownloaded[i].id_company, "Arquivos", filesDownloaded[i].id_file), {
          viwed: true
        })
        const index = files.findIndex(file => file.id_file == filesDownloaded[i].id_file)
        files[index].viwed = true
      } else if(props.from === "admin" && filesDownloaded[i].folder == "Cliente"){
        await updateDoc(doc(db, 'files', filesDownloaded[i].id_company, "Arquivos", filesDownloaded[i].id_file), {
          viwed: true
        })
        const index = files.findIndex(file => file.id_file == filesDownloaded[i].id_file)
        files[index].viwed = true
      }
      props.childToParentDownload(files)
    }
  } catch(e) {
    console.log(e)
    toast.error("Não foi possivél baixar os arquivos.")
  }
}

  export default DownloadsFile