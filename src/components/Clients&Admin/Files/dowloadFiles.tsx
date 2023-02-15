import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/interfaces'

interface Props{
  filesDownloaded:Files[]
  files:Files[]
  from:string
  childToParentDownload:Function
}

async function DownloadsFile({filesDownloaded, files, childToParentDownload, from}:Props){

  for(var i = 0; i < filesDownloaded.length; i++){
    let blob = await fetch(filesDownloaded[i].url).then(r => r.blob());
    filesDownloaded[i].urlDownload = (window.URL ? URL : webkitURL).createObjectURL(blob)
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
      
      if(from === "user" && filesDownloaded[i].folder != "Cliente"){
        await updateDoc(doc(db, 'files', filesDownloaded[i].id_company, "Arquivos", filesDownloaded[i].id_file), {
          viwed: true
        })
        const index = files.findIndex(file => file.id_file == filesDownloaded[i].id_file)
        files[index].viwed = true
      } else if(from === "admin" && filesDownloaded[i].folder == "Cliente"){
        await updateDoc(doc(db, 'files', filesDownloaded[i].id_company, "Arquivos", filesDownloaded[i].id_file), {
          viwed: true
        })
        const index = files.findIndex(file => file.id_file == filesDownloaded[i].id_file)
        files[index].viwed = true
      }

      childToParentDownload(files)
    }
  } catch(e) {
    console.log(e)
    toast.error("Não foi possivél baixar os arquivos.")
  }
}

  export default DownloadsFile