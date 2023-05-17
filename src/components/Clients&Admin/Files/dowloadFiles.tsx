import { db, storage } from '../../../../firebase'
import { doc, getDoc, writeBatch } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/files'
import { Folders } from '../../../types/folders'
import { getDownloadURL, ref } from 'firebase/storage';

interface Props{
  selectFiles:Files[]
  files?:Files[]
  folderName: string
  from:string
  childToParentDownload?:Function
}



async function DownloadsFile({selectFiles, files, childToParentDownload, from, folderName}:Props){
  const docRef = doc(db, "companies", selectFiles[0].id_company, "clients", selectFiles[0].id_user);
  const docSnap = await getDoc(docRef);
  let enterprises = docSnap.data()?.enterprises
  console.log(selectFiles[0])
  let enterprise = enterprises.find((data) => selectFiles[0].id_enterprise == data.id) 
  let folder:Folders = enterprise.folders.find((folder) => folder.name === folderName)
  const batch = writeBatch(db);

  await GetUrlDownloadFile()

  async function GetUrlDownloadFile(){
    const promises:any = []
    const promises2:any = []
    try{
      for await(const file of selectFiles){
        let monthDownload:Number = new Date(file.created_date).getMonth(), monthNow:Number = new Date().getMonth()

        if(from === "user" && file.folder != "Cliente" && folder.singleDownload === true && file.downloaded === true) {
          return toast.error("Este(s) arquivo(s) já foram baixados uma vez (Pasta configurada para downloads únicos).")
        }
    
        if(from === "user" && file.folder != "Cliente" && folder.onlyMonthDownload === true && monthDownload !== monthNow) {
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

      if(from === "user" && selectFiles[i].folder != "Cliente" && selectFiles[i].downloaded === false) {
        const laRef = doc(db, 'files', selectFiles[i].id_company, selectFiles[i].id_user, selectFiles[i].id_file);
        batch.update(laRef, {downloaded: true})
        if(files && childToParentDownload){
          const index = files.findIndex(file => file.id_file == selectFiles[i].id_file)
          files[index].downloaded = true;
        }
      } else if (from === "admin" && selectFiles[i].folder == "Cliente" && selectFiles[i].downloaded === false) {
        const laRef = doc(db, 'files', selectFiles[i].id_company, selectFiles[i].id_user, selectFiles[i].id_file);
        batch.update(laRef, {downloaded: true})
        if(files && childToParentDownload){
          const index = files.findIndex(file => file.id_file == selectFiles[i].id_file)
          files[index].downloaded = true;
        }
      }
    }
  }

  async function VerifyViwed(){
    for(let i = 0; i < selectFiles.length; i++) {
      let viewedDate = new Date().toString();
      
      if(from === "user" && selectFiles[i].folder != "Cliente" && selectFiles[i].viwed === false){
        const laRef = doc(db, 'files', selectFiles[i].id_company, selectFiles[i].id_user, selectFiles[i].id_file);
        batch.update(laRef, {viwed: true,viewedDate: viewedDate})

        if(files && childToParentDownload){
          const index = files.findIndex(file => file.id_file == selectFiles[i].id_file)
          files[index].viwed = true
          files[index].viewedDate = viewedDate;
        }

      }else if(from === "admin" && selectFiles[i].folder == "Cliente" && selectFiles[i].viwed === false){
        const laRef = doc(db, 'files', selectFiles[i].id_company, selectFiles[i].id_user, selectFiles[i].id_file);
        batch.update(laRef, {viwed: true,viewedDate: viewedDate})

        if(files && childToParentDownload){
          const index = files.findIndex(file => file.id_file == selectFiles[i].id_file)
          files[index].viwed = true
          files[index].viewedDate = viewedDate;            
        }
      }
    }
  }

}

  export default DownloadsFile