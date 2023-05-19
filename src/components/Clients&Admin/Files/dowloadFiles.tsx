import { db, storage } from '../../../../firebase'
import { doc, getDoc, writeBatch } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/files'
import { Folders } from '../../../types/folders'
import { getDownloadURL, ref } from 'firebase/storage';
import { GetFolders } from '../../../Utils/folders/getFolders';

interface Props{
  selectFiles:Files[]
  files?:Files[]
  id_folder: string
  from:string
  childToParentDownload?:Function
}



async function DownloadsFile({selectFiles, files, id_folder, from, childToParentDownload}:Props){
  const folders = await GetFolders({id_company:selectFiles[0].id_company, id_enterprise:selectFiles[0].id_enterprise, id_user:selectFiles[0].id_user})
  let folder:Folders = folders.find((folder) => folder.id === id_folder)
  let folderCliente = folders.find((folder) => folder.name === "Cliente")
  const batch = writeBatch(db);

  await GetUrlDownloadFile()

  async function GetUrlDownloadFile(){
    const promises:any = []
    const promises2:any = []
    try{
      for await(const file of selectFiles){
        let monthDownload:Number = new Date(file.created_date).getMonth(), monthNow:Number = new Date().getMonth()

        if(from === "user" &&  file.id_folder != folderCliente.id && folder.singleDownload === true && file.downloaded === true) {
          return toast.error("Este(s) arquivo(s) já foram baixados uma vez (Pasta configurada para downloads únicos).")
        }
    
        if(from === "user" && file.id_folder != folderCliente.id && folder.onlyMonthDownload === true && monthDownload !== monthNow) {
          return toast.error("Este(s) arquivo(s) são do mês passado (Pasta configurada para download no mês).")
        }

        promises.push(getDownloadURL(ref(storage, file.path)))
      }

      const result = await Promise.all(promises)

      for await(const url of result){
        promises2.push(fetch(url).then(r => r.blob()))
      }

      const allUrls = await Promise.all(promises2)

      await StartDownload(allUrls)

    }catch(e) {
      toast.error("Erro: " + e)
    }
  }

  async function StartDownload(allUrls){
    for(var i = 0; i < allUrls.length; i++){
      const url = (window.URL ? URL : webkitURL).createObjectURL(allUrls[i])
      const element:any = document.createElement("a");
      element.href = url
      element.download = selectFiles[i].name;

      document.body.appendChild(element);

      element.click();

      element.parentNode.removeChild(element);
    }

    await Promise.all([VerifyDownload(), VerifyViwed()])
    .then(async () => {
      await batch.commit()
    })
    if(childToParentDownload){
      childToParentDownload(files)
    }
  }

  async function VerifyDownload(){
    for(let i = 0; i < selectFiles.length; i++) {
      selectFiles[i].checked = false

      if(from === "user" && selectFiles[i].id_folder != folderCliente.id && selectFiles[i].downloaded === false) {
        const laRef = doc(db, 'files', selectFiles[i].id_company, selectFiles[i].id_user, selectFiles[i].id);
        batch.update(laRef, {downloaded: true})
        if(files && childToParentDownload){
          const index = files.findIndex(file => file.id== selectFiles[i].id)
          files[index].downloaded = true;
        }
      } else if (from === "admin" && selectFiles[i].id_folder === folderCliente.id && selectFiles[i].downloaded === false) {
        const laRef = doc(db, 'files', selectFiles[i].id_company, selectFiles[i].id_user, selectFiles[i].id);
        batch.update(laRef, {downloaded: true})
        if(files && childToParentDownload){
          const index = files.findIndex(file => file.id == selectFiles[i].id)
          files[index].downloaded = true;
        }
      }
    }
  }

  async function VerifyViwed(){
    for(let i = 0; i < selectFiles.length; i++) {
      let viewedDate = new Date().toString();
      
      if(from === "user" && selectFiles[i].id_folder != folderCliente.id && selectFiles[i].viewed === false){
        const laRef = doc(db, 'files', selectFiles[i].id_company, selectFiles[i].id_user, selectFiles[i].id);
        batch.update(laRef, {viewed: true, viewedDate:viewedDate})

        if(files && childToParentDownload){
          const index = files.findIndex(file => file.id == selectFiles[i].id)
          files[index].viewed = true
          files[index].viewedDate = viewedDate;
        }

      }else if(from === "admin" && selectFiles[i].id_folder == folderCliente.id && selectFiles[i].viewed === false){
        const laRef = doc(db, 'files', selectFiles[i].id_company, selectFiles[i].id_user, selectFiles[i].id);
        batch.update(laRef, {viewed: true, viewedDate: viewedDate})

        if(files && childToParentDownload){
          const index = files.findIndex(file => file.id == selectFiles[i].id)
          files[index].viewed = true
          files[index].viewedDate = viewedDate;            
        }
      }
    }
  }

}

  export default DownloadsFile