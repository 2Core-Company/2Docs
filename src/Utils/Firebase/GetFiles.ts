import { collection, getDocs, query, where, doc, getDoc, updateDoc } from "firebase/firestore";
import { Files } from '../../types/files';
import { Folders } from '../../types/folders';
import { db } from "../../../firebase";
import { toast } from 'react-toastify';

interface Props_GetFilesOrderByDate{
  id_user:string
  id_company:string
  from:string
  id_enterprise:string
  setRecentsFiles:Function
}

export async function GetFilesOrderByDate({id_company, from, id_user, setRecentsFiles, id_enterprise}:Props_GetFilesOrderByDate){
  const files:Files[] = []

  const q = query(collection(db, "files", id_company, id_user), where("id_enterprise", "==", id_enterprise), where('from', '==', from), where("trash", "==", false));
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
      id_enterprise:doc.data()?.id_enterprise,
      name:doc.data()?.name,
      path:doc.data()?.path,
      viewedDate:doc.data()?.viewedDate,
      type:doc.data()?.type,
      created_date:Date.parse(doc.data()?.created_date),
      id_event: doc.data()?.id_event,
      viwed:doc.data()?.viwed,
      from:doc.data()?.from,
      message:doc.data()?.message,
      nameCompany:doc.data()?.nameCompany,
      downloaded:doc.data()?.downloaded,
    })
  });

  files.sort((a:any, b:any) => b.created_date - a.created_date);
  setRecentsFiles(files.slice(0, 3))
}


interface Props_GetFilesToTrash{
  id_company:string
  id_user:string
  id_enterprise:string
  setFiles:Function
  setDataPages:Function
}

export async function GetFilesToTrash({id_company,  id_user, id_enterprise, setFiles, setDataPages}:Props_GetFilesToTrash){
  const files:Files[] = []
  const q = query(collection(db, "files", id_company, id_user), where("trash", "==", true), where("id_enterprise", "==", id_enterprise));
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
      id_enterprise:doc.data()?.id_enterprise,
      name:doc.data()?.name,
      path:doc.data()?.path,
      viewedDate:doc.data()?.viewedDate,
      type:doc.data()?.type,
      created_date:doc.data()?.created_date,
      id_event: doc.data()?.id_event,
      viwed:doc.data()?.viwed,
      from:doc.data()?.from,
      message:doc.data()?.message,
      nameCompany:doc.data()?.nameCompany,
      downloaded:doc.data()?.downloaded,
      checked: false
    }
    file.checked = false
    files.push(file)
  });
  setFiles(files)
  setDataPages({page: 1, maxPages:Math.ceil(files.length / 10)})
}


interface Props_GetFilesToFavorites{
  id_company:string
  id_user:string
  id_enterprise:string
  setFiles:Function
  setDataPages:Function
}

export async function GetFilesToFavorites({id_company,  id_user, id_enterprise, setFiles, setDataPages}:Props_GetFilesToFavorites){
  const files:Files[] = []
  const q = query(collection(db, "files", id_company, id_user), where("favorite", "==", true), where("trash", "==", false), where("id_enterprise", "==", id_enterprise));
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
      id_enterprise:doc.data()?.id_enterprise,
      name:doc.data()?.name,
      path:doc.data()?.path,
      viewedDate:doc.data()?.viewedDate,
      type:doc.data()?.type,
      created_date:doc.data()?.created_date,
      id_event: doc.data()?.id_event,
      viwed:doc.data()?.viwed,
      from:doc.data()?.from,
      message:doc.data()?.message,
      nameCompany:doc.data()?.nameCompany,
      downloaded:doc.data()?.downloaded,
      checked: false
    }
    file.checked = false
    files.push(file)
  });
  setFiles(files)
  setDataPages({page: 1, maxPages:Math.ceil(files.length / 10)})
}



interface GetFilesToNormal{
  id_company:string
  id_user:string
  id_enterprise:string
  folderName:string
  setFiles:Function
  setDataPages:Function
}

export async function GetFilesToNormal({id_company,  id_user, id_enterprise, folderName, setFiles, setDataPages}:GetFilesToNormal){
  const files:Files[] = []
  const q = query(collection(db, "files", id_company, id_user),  where("folder", "==", folderName), where("trash", "==", false), where("id_enterprise", "==", id_enterprise));

  const docRef = doc(db, "companies", id_company, "clients", id_user);
  const docSnap = await getDoc(docRef);
  let enterprises =  docSnap.data()?.enterprises
  let enterprise = enterprises.find((data) => data.id === id_enterprise)
  let folder: Folders[] = enterprise.folders.filter((folder) => folder.name == folderName);

  const querySnapshot = await getDocs(q);

  try {
    querySnapshot.forEach((document) => {
      let file: Files = {
        id_file:document.data()?.id_file,
        id_user:document.data()?.id_user,
        folder:document.data()?.folder,
        trash:document.data()?.trash,
        size:document.data()?.size,
        id_company:document.data()?.id_company,
        favorite:document.data()?.favorite,
        id_enterprise:document.data()?.id_enterprise,
        name:document.data()?.name,
        path:document.data()?.path,
        viewedDate:document.data()?.viewedDate,
        type:document.data()?.type,
        created_date:document.data()?.created_date,
        id_event:document.data()?.id_event,
        viwed:document.data()?.viwed,
        from:document.data()?.from,
        message:document.data()?.message,
        nameCompany:document.data()?.nameCompany,
        downloaded:document.data()?.downloaded,
        checked: false
      }
      let timeDiff = Date.now() - Date.parse(file.created_date.toString());

      switch(folder[0].timeFile) {
        case 3:
          files.push(file);
          break;
        case 2:
          if(timeDiff > 2592000000) {
            updateDoc(doc(db, 'files', id_company, file.id_user, file.id_file), {
              ...file,
              trash: true
            })
          } else {
            files.push(file);
          }
          break;
        case 1:
          if(timeDiff > 604800000) {
            updateDoc(doc(db, 'files', id_company, file.id_user, file.id_file), {
              ...file,
              trash: true
            })
          } else {
            files.push(file);
          }
          break;
        case 0:
          if(timeDiff > 86400000) {
            updateDoc(doc(db, 'files', id_company, file.id_user, file.id_file), {
              ...file,
              trash: true
            })
          } else {
            files.push(file);
          }
          break;
        default:
          throw "A configuração de algum arquivo foi corrompida! Reinicie a página."
      }
    });
  }catch (e) {
    toast.error("Erro: " + e)
  }
  
  setFiles(files)
  setDataPages({page: 1, maxPages:Math.ceil(files.length / 10)})
}