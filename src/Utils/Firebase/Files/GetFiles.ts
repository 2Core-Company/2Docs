import { collection, getDocs, query, where, doc, getDoc, orderBy, limit, writeBatch } from "firebase/firestore";
import { Files } from '../../../types/files';
import { db } from "../../../../firebase";
import { toast } from 'react-toastify';
import { GetFolder } from "../folders/GetFolders";


interface interfaceGetRecentFiles{
  id_company:string
  id_user:string
  from:string
}

export async function GetRecentFiles({id_company,  id_user, from}:interfaceGetRecentFiles){
  const files:Files[] = []
  const q = query(collection(db, "files", id_company, id_user, 'user', 'files'), where('from', '==', from), where("trash", "==", false), orderBy('created_date'), limit(4));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((document) => {
    var file:Files = {
      id:document.data()?.id,
      id_user:document.data()?.id_user,
      id_company:document.data()?.id_company,
      id_enterprise:document.data()?.id_enterprise,
      id_event: document.data()?.id_event,
      id_folder:document.data()?.id_folder,
      size:document.data()?.size,
      name:document.data()?.name,
      path:document.data()?.path,
      viewedDate:document.data()?.viewedDate,
      type:document.data()?.type,
      from:document.data()?.from,
      message:document.data()?.message,
      messageNotif: document.data()?.messageNotif,
      created_date:document.data()?.created_date,
      checked:false,
      trash:document.data()?.trash,
      favorite:document.data()?.favorite,
      downloaded:document.data()?.downloaded
    }
    file.checked = false
    files.push(file)
  });

  if(files[0]){
    return files
  }
}

interface interfaceGetAllFilesOfEnterprise{
  id_company:string
  id_user:string
  id_enterprise:string
}

export async function GetAllFilesOfEnterprise({id_company,  id_user, id_enterprise}:interfaceGetAllFilesOfEnterprise){
  const files:Files[] = []
  const q = query(collection(db, "files", id_company, id_user, 'user', 'files'), where("id_enterprise", "==", id_enterprise));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((document) => {
    var file:Files = {
      id:document.data()?.id,
      id_company:document.data()?.id_company,
      id_user:document.data()?.id_user,
      id_enterprise:document.data()?.id_enterprise,
      id_folder:document.data()?.id_folder,
      id_event: document.data()?.id_event,
      name:document.data()?.name,
      trash:document.data()?.trash,
      size:document.data()?.size,
      favorite:document.data()?.favorite,
      path:document.data()?.path,
      viewedDate:document.data()?.viewedDate,
      type:document.data()?.type,
      created_date:document.data()?.created_date,
      from:document.data()?.from,
      message:document.data()?.message,
      downloaded:document.data()?.downloaded,
      checked:false
    }
    file.checked = false
    files.push(file)
  });

  return files
}

interface interfaceGetAllFilesOfFolder{
  id_company:string
  id_user:string
  id_enterprise:string
  id_folder:string
}

export async function GetAllFilesOfFolder({id_company,  id_user, id_enterprise, id_folder}:interfaceGetAllFilesOfFolder){
  const files:Files[] = []
  const q = query(collection(db, "files", id_company, id_user, 'user', 'files'), where("id_enterprise", "==", id_enterprise), where("id_folder", "==", id_folder));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((document) => {
    var file:Files = {
      id:document.data()?.id,
      id_company:document.data()?.id_company,
      id_user:document.data()?.id_user,
      id_enterprise:document.data()?.id_enterprise,
      id_folder:document.data()?.id_folder,
      id_event: document.data()?.id_event,
      name:document.data()?.name,
      trash:document.data()?.trash,
      size:document.data()?.size,
      favorite:document.data()?.favorite,
      path:document.data()?.path,
      viewedDate:document.data()?.viewedDate,
      type:document.data()?.type,
      created_date:document.data()?.created_date,
      from:document.data()?.from,
      message:document.data()?.message,
      downloaded:document.data()?.downloaded,
      checked:false
    }
    file.checked = false
    files.push(file)
  });

  return files
}



interface interfaceGetRecentFilesOfEnterprise{
  id_company:string
  id_user:string
  id_enterprise:string
  from:string
  setRecentFiles:Function
}

interface interfaceGetRecentFilesOfEnterprise{
  id_company:string
  id_user:string
  id_enterprise:string
  from:string
  setRecentFiles:Function
}

export async function GetRecentFilesOfEnterprise({id_company,  id_user, id_enterprise, from, setRecentFiles}:interfaceGetRecentFilesOfEnterprise){
  const files:Files[] = []
  const q = query(collection(db, "files", id_company, id_user, 'user', 'files'), where('from', '==', from), where("trash", "==", false), where("id_enterprise", "==", id_enterprise), orderBy('created_date'), limit(3));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((document) => {
    var file:Files = {
      id:document.data()?.id,
      id_company:document.data()?.id_company,
      id_user:document.data()?.id_user,
      id_enterprise:document.data()?.id_enterprise,
      id_folder:document.data()?.id_folder,
      id_event: document.data()?.id_event,
      name:document.data()?.name,
      trash:document.data()?.trash,
      size:document.data()?.size,
      favorite:document.data()?.favorite,
      path:document.data()?.path,
      viewedDate:document.data()?.viewedDate,
      type:document.data()?.type,
      created_date:document.data()?.created_date,
      from:document.data()?.from,
      message:document.data()?.message,
      downloaded:document.data()?.downloaded,
      checked:false,
      messageNotif: document.data()?.messageNotif,
    }
    file.checked = false
    files.push(file)
  });
  setRecentFiles(files)
}


interface interfaceGetFilesToTrash{
  id_company:string
  id_user:string
  id_enterprise:string
  setFiles:Function
  setDataPages:Function
}

export async function GetFilesToTrash({id_company,  id_user, id_enterprise, setFiles, setDataPages}:interfaceGetFilesToTrash){
  const files:Files[] = []
  const q = query(collection(db, "files", id_company, id_user, 'user', 'files'), where("trash", "==", true), where("id_enterprise", "==", id_enterprise));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((document) => {
    var file:Files = {
      id:document.data()?.id,
      id_company:document.data()?.id_company,
      id_user:document.data()?.id_user,
      id_enterprise:document.data()?.id_enterprise,
      id_folder:document.data()?.id_folder,
      id_event: document.data()?.id_event,
      name:document.data()?.name,
      trash:document.data()?.trash,
      size:document.data()?.size,
      favorite:document.data()?.favorite,
      path:document.data()?.path,
      viewedDate:document.data()?.viewedDate,
      type:document.data()?.type,
      created_date:document.data()?.created_date,
      from:document.data()?.from,
      message:document.data()?.message,
      downloaded:document.data()?.downloaded,
      checked:false,
      messageNotif: document.data()?.messageNotif
    }
    file.checked = false
    files.push(file)
  });
  setFiles(files)
  setDataPages({page: 1, maxPages:Math.ceil(files.length / 10)})
}


interface interfaceGetFilesToFavorites{
  id_company:string
  id_user:string
  id_enterprise:string
  setFiles:Function
  setDataPages:Function
}

export async function GetFilesToFavorites({id_company,  id_user, id_enterprise, setFiles, setDataPages}:interfaceGetFilesToFavorites){
  const files:Files[] = []
  const q = query(collection(db, "files", id_company, id_user, 'user', 'files'), where("favorite", "==", true), where("trash", "==", false), where("id_enterprise", "==", id_enterprise));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((document) => {
    var file:Files = {
      id:document.data()?.id,
      id_company:document.data()?.id_company,
      id_user:document.data()?.id_user,
      id_enterprise:document.data()?.id_enterprise,
      id_folder:document.data()?.id_folder,
      id_event: document.data()?.id_event,
      name:document.data()?.name,
      trash:document.data()?.trash,
      size:document.data()?.size,
      favorite:document.data()?.favorite,
      path:document.data()?.path,
      viewedDate:document.data()?.viewedDate,
      type:document.data()?.type,
      created_date:document.data()?.created_date,
      from:document.data()?.from,
      message:document.data()?.message,
      downloaded:document.data()?.downloaded,
      checked:false,
      messageNotif: document.data()?.messageNotif
    }
    files.push(file)
  });
  setFiles(files)
  setDataPages({page: 1, maxPages:Math.ceil(files.length / 10)})
}


interface interfaceGetFilesAdmin{
  id_company:string
  id_user:string
  id_enterprise:string
  id_folder:string
  setFiles:Function
  setDataPages:Function
}

export async function GetFilesAdmin({id_company,  id_user, id_enterprise, id_folder, setFiles, setDataPages}:interfaceGetFilesAdmin){
  const files:Files[] = []
  const q = query(collection(db, "files", id_company, id_user, 'user', 'files'),  where("id_folder", "==", id_folder), where("trash", "==", false), where("id_enterprise", "==", id_enterprise));
  const querySnapshot = await getDocs(q);
  const folder = await GetFolder({id_company,  id_user, id_enterprise, id_folder})

  if(!folder){
    throw Error
  }

  try {
    const batch = writeBatch(db);    

    querySnapshot.forEach((document) => {
      let file: Files = {
        id:document.data()?.id,
        id_company:document.data()?.id_company,
        id_user:document.data()?.id_user,
        id_enterprise:document.data()?.id_enterprise,
        id_folder:document.data()?.id_folder,
        id_event: document.data()?.id_event,
        name:document.data()?.name,
        trash:document.data()?.trash,
        size:document.data()?.size,
        favorite:document.data()?.favorite,
        path:document.data()?.path,
        viewedDate:document.data()?.viewedDate,
        type:document.data()?.type,
        created_date:document.data()?.created_date,
        from:document.data()?.from,
        message:document.data()?.message,
        downloaded:document.data()?.downloaded,
        checked:false,
        messageNotif: document.data()?.messageNotif
      }
      let timeDiff = Date.now() - Date.parse(file.created_date.toString());

      switch(folder.timeFile) {
        case 3:
          files.push(file);
          break;
        case 2:
          if(timeDiff > 2592000000) {
            batch.update(doc(db, 'files', id_company, file.id_user, "user", "files", file.id), {trash: true});
          } else {
            files.push(file);
          }
          break;
        case 1:
          if(timeDiff > 604800000) {
            batch.update(doc(db, 'files', id_company, file.id_user, "user", "files", file.id), {trash: true});
          } else {
            files.push(file);
          }
          break;
        case 0:
          if(timeDiff > 86400000) {
            batch.update(doc(db, 'files', id_company, file.id_user, "user", "files", file.id), {trash: true});
          } else {
            files.push(file);
          }
          break;
        default:
          throw "A configuração de algum arquivo foi corrompida! Reinicie a página."
      }
    });

    await batch.commit();
  }catch (e) {
    toast.error("Erro: " + e)
  }

  setFiles(files)
  setDataPages({page: 1, maxPages:Math.ceil(files.length / 10)})
}


interface interfaceGetFilesEvent{
  id_company:string
  id_user:string
  id_event:string
}

export async function GetFilesEvent({id_company, id_user, id_event}: interfaceGetFilesEvent){
  const getFiles:Files[] = []
  var q = query(collection(db, "files", id_company, id_user, 'user', 'files'), where("id_event", "==",  id_event));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((document) => {
    getFiles.push({
      id:document.data()?.id,
      id_company:document.data()?.id_company,
      id_user:document.data()?.id_user,
      id_enterprise:document.data()?.id_enterprise,
      id_folder:document.data()?.id_folder,
      id_event: document.data()?.id_event,
      name:document.data()?.name,
      trash:document.data()?.trash,
      size:document.data()?.size,
      favorite:document.data()?.favorite,
      path:document.data()?.path,
      viewedDate:document.data()?.viewedDate,
      type:document.data()?.type,
      created_date:document.data()?.created_date,
      from:document.data()?.from,
      message:document.data()?.message,
      downloaded:document.data()?.downloaded,
      messageNotif: document.data()?.messageNotif
    })
  });
  return getFiles
}


interface interfaceGetSpecificFile{
  id_company:string
  id_user:string
  id_file:string
  setFile:Function
}

export async function GetSpecificFile({id_company, id_user, id_file, setFile}:interfaceGetSpecificFile){
  const docRefFile = doc(db, "files", id_company, id_user, 'user', 'files', id_file);
  const document = await getDoc(docRefFile)
  console.log(document.data())
  const data:Files = {      
    id:document.data()?.id,
    id_company:document.data()?.id_company,
    id_user:document.data()?.id_user,
    id_enterprise:document.data()?.id_enterprise,
    id_folder:document.data()?.id_folder,
    id_event: document.data()?.id_event,
    name:document.data()?.name,
    trash:document.data()?.trash,
    size:document.data()?.size,
    favorite:document.data()?.favorite,
    path:document.data()?.path,
    viewedDate:document.data()?.viewedDate,
    type:document.data()?.type,
    created_date:document.data()?.created_date,
    from:document.data()?.from,
    message:document.data()?.message,
    downloaded:document.data()?.downloaded,
    messageNotif: document.data()?.messageNotif
  }
  setFile(data)
} 


interface interfaceGetFilesClient{
  id_company:string
  id_user:string
  id_enterprise:string
  id_folder:string
  setFiles:Function
  setDataPages:Function
}

export async function GetFilesClient({id_company,  id_user, id_enterprise, id_folder, setFiles, setDataPages}:interfaceGetFilesClient){

  const files:Files[] = []
  const q = query(collection(db, "files", id_company, id_user, 'user', 'files'), where("trash", "==", false), where("id_enterprise", "==", id_enterprise), where("id_folder", "==", id_folder));
  const querySnapshot = await getDocs(q);
  const folder = await GetFolder({id_company,  id_user, id_enterprise, id_folder})

  if(!folder){
    throw Error
  }

  try {
    const batch = writeBatch(db);
    querySnapshot.forEach((document) => {
      let file: Files = {
        id:document.data()?.id,
        id_company:document.data()?.id_company,
        id_user:document.data()?.id_user,
        id_enterprise:document.data()?.id_enterprise,
        id_folder:document.data()?.id_folder,
        id_event: document.data()?.id_event,
        name:document.data()?.name,
        trash:document.data()?.trash,
        size:document.data()?.size,
        favorite:document.data()?.favorite,
        path:document.data()?.path,
        viewedDate:document.data()?.viewedDate,
        type:document.data()?.type,
        created_date:document.data()?.created_date,
        from:document.data()?.from,
        message:document.data()?.message,
        downloaded:document.data()?.downloaded,
        checked:false,
        messageNotif: document.data()?.messageNotif
      }
      let timeDiff = Date.now() - Date.parse(file.created_date.toString());

      switch(folder.timeFile) {
        case 3:
          files.push(file);
          break;
        case 2:
          if(timeDiff > 2592000000) {
            batch.update(doc(db, 'files', id_company, file.id_user, "user", "files", file.id), {trash: true});
          } else {
            files.push(file);
          }
          break;
        case 1:
          if(timeDiff > 604800000) {
            batch.update(doc(db, 'files', id_company, file.id_user, "user", "files", file.id), {trash: true});
          } else {
            files.push(file);
          }
          break;
        case 0:
          if(timeDiff > 86400000) {
            batch.update(doc(db, 'files', id_company, file.id_user, "user", "files", file.id), {trash: true});
          } else {
            files.push(file);
          }
          break;
        default:
          throw "A configuração de algum arquivo foi corrompida! Reinicie a página."
      }
    });

    await batch.commit();
  }catch (e) {
    toast.error("Erro: " + e)
  }

  setFiles(files)
  setDataPages({page: 1, maxPages:Math.ceil(files.length / 10)})
}
