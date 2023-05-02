import { db } from '../../../../firebase'
import { doc, getDoc, updateDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/files'
import { Folders } from '../../../types/folders'
import ViwedEvent from '../Calendar/viwedEvent';

interface Props{
  filesDownloaded:Files[]
  files?:Files[]
  folderName: string
  from:string
  childToParentDownload?:Function
}

async function DownloadsFile({filesDownloaded, files, childToParentDownload, from, folderName}:Props){
  const docRef = doc(db, "companies", filesDownloaded[0].id_company, "clients", filesDownloaded[0].id_user);
  const docSnap = await getDoc(docRef);
  let folder:Folders[] = docSnap.data()?.folders.filter((folder) => folder.name == folderName);

  try{
    for(var i = 0; i < filesDownloaded.length; i++){
      let monthDownload:Number = new Date(filesDownloaded[i].created_date).getMonth(), monthNow:Number = new Date().getMonth()

      if(from === "user" && filesDownloaded[i].folder != "Cliente" && folder[0].singleDownload === true && filesDownloaded[i].downloaded === true) {
        return toast.error("Este(s) arquivo(s) já foram baixados uma vez (Pasta configurada para downloads únicos).")
      }

      if(from === "user" && filesDownloaded[i].folder != "Cliente" && folder[0].onlyMonthDownload === true && monthDownload !== monthNow) {
        return toast.error("Este(s) arquivo(s) são do mês passado (Pasta configurada para download no mês).")
      }

      let blob = await fetch(filesDownloaded[i].url).then(r => r.blob());
      filesDownloaded[i].urlDownload = (window.URL ? URL : webkitURL).createObjectURL(blob)
    }
  }catch(e) {
    toast.error("Erro: " + e)
  }

  try{
    for(let i = 0; i < filesDownloaded.length; i++) {
      const element:any = document.createElement("a");
      element.href = filesDownloaded[i].urlDownload
      element.download = filesDownloaded[i].name;

      document.body.appendChild(element);

      element.click();

      element.parentNode.removeChild(element);

      filesDownloaded[i].checked = false

      if(from === "user" && filesDownloaded[i].folder != "Cliente" && filesDownloaded[i].downloaded === false) {
        await updateDoc(doc(db, 'files', filesDownloaded[i].id_company, "documents", filesDownloaded[i].id_file), {
          downloaded: true
        })

        if(files && childToParentDownload){
          const index = files.findIndex(file => file.id_file == filesDownloaded[i].id_file)
          files[index].downloaded = true;
          childToParentDownload(files)
        }
      } else if(from === "admin" && filesDownloaded[i].folder == "Cliente" && filesDownloaded[i].downloaded === false) {
        await updateDoc(doc(db, 'files', filesDownloaded[i].id_company, "documents", filesDownloaded[i].id_file), {
          downloaded: true
        })

        if(files && childToParentDownload){
          const index = files.findIndex(file => file.id_file == filesDownloaded[i].id_file)
          files[index].downloaded = true;

          childToParentDownload(files)
        }
      }

      let viewedDate = new Date().toString();
      
      if(from === "user" && filesDownloaded[i].folder != "Cliente" && filesDownloaded[i].viwed === false){
        await updateDoc(doc(db, 'files', filesDownloaded[i].id_company, "documents", filesDownloaded[i].id_file), {
          viwed: true,
          viewedDate: viewedDate,
        })

        if(files && childToParentDownload){
          const index = files.findIndex(file => file.id_file == filesDownloaded[i].id_file)
          files[index].downloaded = true;

          files[index].viwed = true
          files[index].viewedDate = viewedDate;

          childToParentDownload(files)
        }
        }else if(from === "admin" && filesDownloaded[i].folder == "Cliente" && filesDownloaded[i].viwed === false){
          await updateDoc(doc(db, 'files', filesDownloaded[i].id_company, "documents", filesDownloaded[i].id_file), {
            viwed: true,
            viewedDate: viewedDate
          })
          if(files && childToParentDownload){
            const index = files.findIndex(file => file.id_file == filesDownloaded[i].id_file)
            files[index].downloaded = true;

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