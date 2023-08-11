import { collection, doc, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { toast } from 'react-toastify';
import { db, storage } from '../../../../firebase';
import { GetSizeCompany } from '../../../Utils/Firebase/Company/GetSizeCompany';
import updateSizeCompany from '../../../Utils/Firebase/Company/UpdateSizeCompany';
import { Files } from '../../../types/files';
import { getFolder } from '@/src/Utils/Firebase/Folders/getFolders';
import { Folders } from '@/src/types/folders';

interface PropsUploadFiles{
  id_company: string
  id_user: string
  id_enterprise: string
  id_folder: string
  id_event?: string
  files: any
  from: 'user' | 'admin'
  maxSize:number
}

export async function UploadFiles({id_event, id_folder, id_company, id_user, id_enterprise, files, from, maxSize}:PropsUploadFiles) {
  const batch = writeBatch(db);
  const toastUpload = {pending:"Armazenando arquivos...", success:"Arquivos armazenados."};
  const folder:Folders | undefined = await getFolder({id_company, id_user, id_enterprise, id_folder})
  const response = await toast.promise(CreateReferencesOfFiles(), toastUpload);
  return response;
  


  async function CreateReferencesOfFiles(){
    const docsRef = ref(storage, `${id_company}/files/${id_user}/${id_enterprise}/${id_folder}`);
    const allFilesFilter:any = [];
    var promises:any = [];
    var size = 0;

    for await (const file of files) {
      const referencesFile = Math.floor(1000 + Math.random() * 9000) + file.name;
      const docRef = ref(docsRef, referencesFile);
      promises.push(uploadBytes(docRef , file));
      allFilesFilter.push(file);
      size += file.size;
    }

    const response = await UpdateSizeInCompany(size);
    const response2 = await UploadFilesStorage({promises, allFilesFilter, files});

    return response2;

  }

  
  async function UpdateSizeInCompany(size){
    const companySize = await GetSizeCompany({id_company});

    if((companySize + size) > maxSize){
      throw toast.error('Limite de armazenamento foi excedido.');
    }

    const response = await updateSizeCompany({id_company, size, action:'sum'});
    return response;
  }

  
  async function UploadFilesStorage({promises, allFilesFilter, files}){
    try {
      const response = await Promise.all(promises);
      const response2 = await OrganizeFilesInArray({filesUpload:allFilesFilter, result:response.filter((file) => file != undefined)});
      if(response2){
        return {status: 200, files:response2};
      }
    } catch (error) {
      console.error('Erro ao fazer upload dos arquivos:', error);
      throw error;
    }

    files.value = null;
  }


  async function OrganizeFilesInArray({filesUpload, result}){
    const dataFilesUploaded:Files[] = [];
    const collectionRef = collection(db, "files", id_company, id_user, 'user', 'files');
    const id_eventHere = id_event ? id_event : '';

    for(var i = 0; i < filesUpload.length; i++){
      const type =  GetTypeFile(filesUpload[i]);
      const date = new Date().getTime();

      const data:Files = {
        id_user: id_user,
        id:result[i].metadata.name,
        id_company: id_company,
        id_enterprise: id_enterprise,
        id_event:id_eventHere,
        id_folder: id_folder,
        path: result[i].metadata.fullPath,
        name: filesUpload[i].name,
        size: filesUpload[i].size,
        created_date: date,
        type:type,
        trash: false,
        downloaded: false,
        from: from,
        favorite:false,
        viewedDate:null, 
        message:'',
        isPrivate:folder?.isPrivate,
        singleDownload: folder?.singleDownload
      }

      const docRef  = doc(collectionRef, result[i].metadata.name);
      batch.set(docRef, data);
      data.checked = false;
      dataFilesUploaded.push(data);
    }

    try{  
      const result = await batch.commit();

      return dataFilesUploaded;
    }catch(e){
      console.log(e);
      throw e;
    }
  }


  function GetTypeFile(file){
    var type = file.type.split('/');
    var type2 = file.name.split('.');

    if (type.at(0) === 'image'){
      type = "images";
    } else if (type.at(1) === "pdf"){
      type = "pdfs";
    } else if(type.at(1) === "x-zip-compressed" || type2[1] === 'rar') {
      type = "zip";
    } else if(type.at(0) === "text") {
      type = "txt";
    } else if(type[1] === "vnd.openxmlformats-officedocument.spreadsheetml.sheet" || type2[1] === 'xlsx'){
      type = "excel";
    } else {
      type = "docs";
    }
    return type;
  }
}
