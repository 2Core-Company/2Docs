import { storage, db } from '../../../../firebase'
import { ref,  uploadBytes } from "firebase/storage";
import { collection, doc, setDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { Files } from '../../../types/files';
import { usePathname } from 'next/navigation';


  interface Props{
    id_enterprise:string
    id_company:string
    id_folder:string
    folderName:string
    menu:boolean
    permission: number
    id:string
    from:string
    files:Files[]
    childToParentDownload:Function
  }

function UploadFiles({folderName, files, id_folder, menu, permission, id, id_company,  from, id_enterprise, childToParentDownload}: Props) {
  const path = usePathname()

  async function UploadFile(files){
    const docsRef = ref(storage, `${id_company}/files/${id}/${id_enterprise}/${id_folder}`);
    const allFiles:any = await Promise.all(files.files)
    const allFilesFilter:any = []
    var promises:any = []

    allFiles.map((file) => {
      if (file.size > 30000000) {
        files.value = null;
        toast.error(`Erro ao upar o arquivo: ${file.name}, ele excede o limite de 30mb`);
      } else {
        const referencesFile = Math.floor(1000 + Math.random() * 9000) + file.name;
        const docRef = ref(docsRef, referencesFile);
        promises.push(uploadBytes(docRef , file));
        allFilesFilter.push(file)
      }
    });

    await Promise.all(promises)
    .then((result) => {
      OrganizeFilesInArray({files:allFilesFilter, result:result.filter((file) => file != undefined)})
    }).catch((error) => {
      console.error('Erro ao fazer upload dos arquivos:', error);
    });
  }

  async function OrganizeFilesInArray({files, result}){
    const promises:any = []
    const allDataFiles:any = []
    const collectionRef = collection(db, "files", id_company, id)

    for(var i = 0; i < files.length; i++){
      var type = files[i].type.split('/')
      var type2 = files[i].name.split('.')
  
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
      const date = new Date() + ""

      const data:Files = {
        id_user: id,
        id: result[i].metadata.name,
        id_company: id_company,
        id_enterprise: id_enterprise,
        path: result[i].metadata.fullPath,
        name: files[i].name,
        size: Math.ceil(files[i].size / 1000),
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
      promises.push(setDoc(docRef, data))
      data.checked = false
      allDataFiles.push(data)
    }

    UploadFilestore({promises, allDataFiles})
  }

  async function UploadFilestore({promises, allDataFiles}){
    await Promise.all(promises)
    .then(() => {
      childToParentDownload(allDataFiles.concat(files))
    })
    .catch(error => {
      console.error('Erro ao fazer upload dos dados:', error);
    });
  }

  return(
    <>
      {permission > 0 && folderName != 'Cliente' && folderName != 'Favoritos' ? (
        <label className={`bg-black dark:bg-white cursor-pointer text-white dark:text-black p-[5px] flex justify-center items-center rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>
          <p>+ Upload</p>
          <input onChange={ (e) => toast.promise(UploadFile(e.target) ,{pending:"Armazenando arquivos...", success:"Arquivos armazenados.", error:"Não foi possivel armazenar os arquivos"})} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
        </label>
      ) : 
        permission === 0 && folderName === 'Cliente' ?
        (
          <label className={`${path === "Dashboard/Clientes/Cliente" &&  permission === 0  ? "hidden" : <></>} bg-black dark:bg-white cursor-pointer text-white dark:text-black p-[5px] flex justify-center items-center rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`} >
            <p>+ Upload</p>
            <input onChange={ (e) => toast.promise(UploadFile(e.target) ,{pending:"Armazenando arquivos...", success:"Arquivos armazenados.", error:"Não foi possivel armazenar os arquivos"})} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
          </label>
        ) 
        : <></>
      }
    </>
  )
}

export default UploadFiles;