import { storage, db } from '../../../../firebase'
import { ref,  uploadBytes } from "firebase/storage";
import { collection, doc, writeBatch } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/files';
import { GetSizeCompany } from '../../../Utils/Other/getSizeCompany';
import { useContext } from 'react';
import { companyContext } from '../../../app/Context/contextCompany';
import updateSizeCompany from '../../../Utils/Other/updateSizeCompany';


  interface Props{
    id_enterprise:string
    id_company:string
    id_folder:string
    folderName:string
    menu:boolean
    permission: number
    id_user:string
    from:string
    files:Files[]
    childToParentDownload:Function
  }

function UploadFiles({folderName, files, id_folder, menu, permission, id_user, id_company,  from, id_enterprise, childToParentDownload}: Props) {
  const { dataCompany } = useContext(companyContext)
  const batch = writeBatch(db);
  const toastUpload = {pending:"Armazenando arquivos...", success:"Arquivos armazenados."}

  async function UploadFilesStorage(files){
    if(files.length > 10){
      throw toast.error('Você não pode armazenar mais de 10 arquivos de uma só vez.')
    }

    const docsRef = ref(storage, `${id_company}/files/${id_user}/${id_enterprise}/${id_folder}`);
    const allFilesFilter:any = []
    var promises:any = []
    var size = 0

    for await (const file of files) {
      if (file.size > 30000000) {
        files.value = null;
        toast.error(`Erro ao upar o arquivo: ${file.name}, ele excede o limite de 30mb`);
      } else {
        const referencesFile = Math.floor(1000 + Math.random() * 9000) + file.name
        const docRef = ref(docsRef, referencesFile);
        promises.push(uploadBytes(docRef , file));
        allFilesFilter.push(file)
        size += file.size
      }
    }

    if(promises.length === 0){
      files.value = null;
      throw Error
    }

    const companySize = await GetSizeCompany({id_company})

    if((companySize + size) > dataCompany.maxSize){
      throw toast.error('Limite de armazenamento foi excedido.')
    }

    await updateSizeCompany({id_company, size, action:'sum'})

    await Promise.all(promises)
    .then((result) => {
      OrganizeFilesInArray({filesUpload:allFilesFilter, result:result.filter((file) => file != undefined)})
    }).catch((error) => {
      console.error('Erro ao fazer upload dos arquivos:', error);
    });
    files.value = null;
  }

  async function OrganizeFilesInArray({filesUpload, result}){
    const allDataFiles:any = []
    const collectionRef = collection(db, "files", id_company, id_user, 'user', 'files')

    for(var i = 0; i < filesUpload.length; i++){
      var type = filesUpload[i].type.split('/')
      var type2 = filesUpload[i].name.split('.')
  
      if (type.at(0) === 'image'){
        type = "images"
      } else if (type.at(1) === "pdf"){
        type = "pdfs"
      } else if(type.at(1) === "x-zip-compressed" || type2[1] === 'rar') {
        type = "zip"
      } else if(type.at(0) === "text") {
        type = "txt"
      } else if(type[1] === "vnd.openxmlformats-officedocument.spreadsheetml.sheet" || type2[1] === 'xlsx'){
        type = "excel"
      } else {
        type = "docs"
      }
      const date = new Date() 

      const data:Files = {
        id_user: id_user,
        id: result[i].metadata.name,
        id_company: id_company,
        id_enterprise: id_enterprise,
        path: result[i].metadata.fullPath,
        name: filesUpload[i].name,
        size: filesUpload[i].size,
        created_date: date,
        type:type,
        trash: false,
        viewed: false,
        downloaded: false,
        id_folder: id_folder,
        from: from,
        favorite:false,
        viewedDate:'', 
        id_event:'',
        message:''
      }

      const docRef  = doc(collectionRef, result[i].metadata.name);
      batch.set(docRef, data)
      data.checked = false
      allDataFiles.push(data)
    }

    try{  
      await batch.commit()
      childToParentDownload(allDataFiles.concat(files))
    }catch(e){
      console.log(e)
    }
  }

  return(
    <>
      {permission > 0 && folderName != 'Cliente' && folderName != 'Favoritos' ? (
        <label className={`bg-black dark:bg-white cursor-pointer text-white dark:text-black p-[5px] flex justify-center items-center rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>
          <p>+ Upload</p>
          <input onChange={(e) => toast.promise(UploadFilesStorage(e.target.files), toastUpload)} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
        </label>
      ) : 

        permission === 0 && folderName === 'Cliente' ? (
          <label className={`bg-black dark:bg-white cursor-pointer text-white dark:text-black p-[5px] flex justify-center items-center rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`} >
            <p>+ Upload</p>
            <input onChange={(e) => toast.promise(UploadFilesStorage(e.target), toastUpload)} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
          </label>
        ) 
      : <></>}
    </>
  )
}

export default UploadFiles;
