import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { Files } from '../../types/files';

interface Props_GetFilesOrderByDate{
    id_company:string
    from:string
    setRecentsFile:Function
}

export async function GetFilesOrderByDate({id_company, from, setRecentsFile}:Props_GetFilesOrderByDate){
    const files:Files[] = []
    const q = query(collection(db, "files", id_company, "documents"), where('from', '==', from), orderBy("created_date"), limit(5));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {      
      files.push({
        id_file:doc.data()?.id_file,
        id_user:doc.data()?.id_user,
        folder:doc.data()?.folder,
        trash:doc.data()?.trash,
        size:doc.data()?.size,
        id_company:doc.data()?.id_company,
        favorite:doc.data()?.favorite,
        id_enterprise:doc.data()?.enterprises,
        name:doc.data()?.name,
        url:doc.data()?.url,
        viewedDate:doc.data()?.viewedDate,
        type:doc.data()?.type
      })
    });
    setRecentsFile(files)
}


interface Props_GetFilesToTrash{
  id_company:string
  id_user:string
  id_enterprise:string
  setFiles:Function
  setPages:Function
}

export async function GetFilesToTrash({id_company,  id_user, id_enterprise, setFiles, setPages}:Props_GetFilesToTrash){
  const files:Files[] = []
  const q = query(collection(db, "files", id_company, "documents"), where("id_user", "==",  id_user), where("trash", "==", true), where("id_enterprise", "==", id_enterprise));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    var file:Files = {
      id_file:doc.data()?.id_file,
      id_user:doc.data()?.id_user,
      folder:doc.data()?.folder,
      trash:doc.data()?.trash,
      size:doc.data()?.size,
      id_company:doc.data()?.id_company,
      favorite:doc.data()?.favorite,
      id_enterprise:doc.data()?.enterprises,
      name:doc.data()?.name,
      url:doc.data()?.url,
      viewedDate:doc.data()?.viewedDate,
      type:doc.data()?.type
    }
    file.checked = false
    files.push(file)
  });
  setFiles(files)
  setPages(Math.ceil(files.length / 10))
}


interface Props_GetFilesToFavorites{
  id_company:string
  id_user:string
  id_enterprise:string
  setFiles:Function
  setPages:Function
}

export async function GetFilesToFavorites({id_company,  id_user, id_enterprise, setFiles, setPages}:Props_GetFilesToFavorites){
  const files:Files[] = []
  const q = query(collection(db, "files", id_company, "documents"), where("id_user", "==",  id_user), where("favorite", "==", true), where("trash", "==", false), where("id_enterprise", "==", id_enterprise));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    var file:Files = {
      id_file:doc.data()?.id_file,
      id_user:doc.data()?.id_user,
      folder:doc.data()?.folder,
      trash:doc.data()?.trash,
      size:doc.data()?.size,
      id_company:doc.data()?.id_company,
      favorite:doc.data()?.favorite,
      id_enterprise:doc.data()?.enterprises,
      name:doc.data()?.name,
      url:doc.data()?.url,
      viewedDate:doc.data()?.viewedDate,
      type:doc.data()?.type
    }
    file.checked = false
    files.push(file)
  });
  setFiles(files)
  setPages(Math.ceil(files.length / 10))
}



interface GetFilesToNormal{
  id_company:string
  id_user:string
  id_enterprise:string
  folderName:string
  setFiles:Function
  setPages:Function
}

export async function GetFilesToNormal({id_company,  id_user, id_enterprise, folderName, setFiles, setPages}:GetFilesToNormal){
  const files:Files[] = []
  const q = query(collection(db, "files", id_company, "documents"), where("id_user", "==",  id_user), where("folder", "==", folderName), where("trash", "==", false), where("id_enterprise", "==", id_enterprise));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    var file:Files = {
      id_file:doc.data()?.id_file,
      id_user:doc.data()?.id_user,
      folder:doc.data()?.folder,
      trash:doc.data()?.trash,
      size:doc.data()?.size,
      id_company:doc.data()?.id_company,
      favorite:doc.data()?.favorite,
      id_enterprise:doc.data()?.enterprises,
      name:doc.data()?.name,
      url:doc.data()?.url,
      viewedDate:doc.data()?.viewedDate,
      type:doc.data()?.type
    }
    file.checked = false
    files.push(file)
  });
  setFiles(files)
  setPages(Math.ceil(files.length / 10))
}


interface GetFilesToAllFolders{
  id_company:string
  id_user:string
  id_enterprise:string
  from:string
  setFiles:Function
  setRecentFiles:Function
}

export async function GetFilesToAllFolders({id_company,  id_user, id_enterprise, from,  setFiles, setRecentFiles}:GetFilesToAllFolders){
  const files:Files[] = [];

  try{
    const recentFiles:Files[] = []
  const q = query(collection(db, "files", id_company, "documents"), where("id_user", "==", id_user), where("id_enterprise", "==", id_enterprise), orderBy("created_date"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    files.push({
      id_file:doc.data()?.id_file,
      id_user:doc.data()?.id_user,
      folder:doc.data()?.folder,
      trash:doc.data()?.trash,
      size:doc.data()?.size,
      id_company:doc.data()?.id_company,
      favorite:doc.data()?.favorite,
      id_enterprise:doc.data()?.enterprises,
      name:doc.data()?.name,
      url:doc.data()?.url,
      viewedDate:doc.data()?.viewedDate,
      type:doc.data()?.type
    });
  });
  setFiles(files)
  
  for(var i = 0; i < 3 ; i++){
    if(files[i]?.from === from){
      recentFiles.push(files[i])
    }
  }
  setRecentFiles(recentFiles)
  }catch(e){
    console.log(e)
  }
}
