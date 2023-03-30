import { folder } from 'jszip';
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

interface Props_GetFilesOrderByDate{
    id_company:string
    from:string
    setRecentsFile:Function
}

export async function GetFilesOrderByDate({id_company, from, setRecentsFile}:Props_GetFilesOrderByDate){
    const files = []
    const q = query(collection(db, "files", id_company, "documents"), where('from', '==', from), orderBy("created_date"), limit(5));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      files.push(doc.data())
    });
    setRecentsFile(files)
}


interface Props_GetFilesToTrash{
  id_company:string
  id_user:string
  id_enterprise:string
  setFiles:Function
  setFilesFilter:Function
  setPages:Function
}

export async function GetFilesToTrash({id_company,  id_user, id_enterprise, setFiles, setFilesFilter, setPages}:Props_GetFilesToTrash){
  const files = []
  const q = query(collection(db, "files", id_company, "documents"), where("id_user", "==",  id_user), where("trash", "==", true), where("id_enterprise", "==", id_enterprise));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    var file = doc.data()
    file.checked = false
    files.push(file)
  });
  setFiles(files)
  setFilesFilter(files)
  setPages(Math.ceil(files.length / 10))
}


interface Props_GetFilesToFavorites{
  id_company:string
  id_user:string
  id_enterprise:string
  setFiles:Function
  setFilesFilter:Function
  setPages:Function
}

export async function GetFilesToFavorites({id_company,  id_user, id_enterprise, setFiles, setFilesFilter, setPages}:Props_GetFilesToFavorites){
  const files = []
  const q = query(collection(db, "files", id_company, "documents"), where("id_user", "==",  id_user), where("favorite", "==", true), where("trash", "==", false), where("id_enterprise", "==", id_enterprise));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    var file = doc.data()
    file.checked = false
    files.push(file)
  });
  setFiles(files)
  setFilesFilter(files)
  setPages(Math.ceil(files.length / 10))
}



interface GetFilesToNormal{
  id_company:string
  id_user:string
  id_enterprise:string
  folderName:string
  setFiles:Function
  setFilesFilter:Function
  setPages:Function
}

export async function GetFilesToNormal({id_company,  id_user, id_enterprise, folderName, setFiles, setFilesFilter, setPages}:GetFilesToNormal){
  const files = []
  const q = query(collection(db, "files", id_company, "documents"), where("id_user", "==",  id_user), where("folder", "==", folderName), where("trash", "==", false), where("id_enterprise", "==", id_enterprise));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    var file = doc.data()
    file.checked = false
    files.push(file)
  });
  setFiles(files)
  setFilesFilter(files)
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
  const files = [];

  try{
      const recentFiles = []
  const q = query(collection(db, "files", id_company, "documents"), where("id_user", "==", id_user), where("id_enterprise", "==", id_enterprise), orderBy("created_date"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    files.push(doc.data());
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
