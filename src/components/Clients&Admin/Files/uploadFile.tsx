import { storage, db } from '../../../../firebase'
import { ref,  uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';
import { AlterSizeCompany } from '../../../Utils/Firebase/AlterSizeCompany';
import { useContext } from 'react';
import { companyContext } from '../../../app/Context/contextCompany';

  interface Props{
    folderName?:string
    menu:boolean
    permission: number
    id:string
    id_company:string
    from:string
    id_enterprise:string
    setFiles:Function
    setMenu:Function
    setFilesFilter:Function
  }

function UploadFiles({folderName, menu, permission, id, id_company,  from, id_enterprise, setFiles, setMenu, setFilesFilter}: Props) {
  const {dataCompany} = useContext(companyContext)
  
  async function UploadFile(files){
    console.log(dataCompany)
    if(dataCompany.gbFiles.type === 'Gb'){
      if(dataCompany.gbFiles.size >= dataCompany.plan.maxSize){
        files.value = null
        toast.error('O plano da sua empresa excedeu o limite de armazenamento, comunique um responsavel desta empresa.')
        throw ''
      }
    }

    var totalSizeFiles = 0
    for await (const file of files.files) {
      totalSizeFiles = file.size + totalSizeFiles
      if(file.size > 30000000){
        files.value = null
        return toast.error("Os arquivos só podem ter no máximo 30mb.")
      }
    }
    
    for await (const file of files.files) {
      const referencesFile = Math.floor(1000 + Math.random() * 9000) + file.name;
      const docsRef = ref(storage, `${id_company}/files/${id + "/" + referencesFile}`);
      const upload = await uploadBytes(docsRef, file)
      await GetUrlDownload({referencesFile:referencesFile, file:file, path:upload.metadata.fullPath})
    }
    files.value = null
    setMenu(false)
    AlterSizeCompany({id_company:id_company, action:'sum', size:totalSizeFiles})
  }

  async function GetUrlDownload(params){
    const type = params.file.type
    const name = params.file.name
    const size = params.file.size
    const url = await getDownloadURL(ref(storage, params.path))
    UploadFilestore({url, nameFile:params.referencesFile, name:name, size:size, file: type})
  }

  async function UploadFilestore(params){
    try{
      let blob = await fetch(params.url).then(r => r.blob());
      var urlDownload = (window.URL ? URL : webkitURL).createObjectURL(blob)
    } catch(e){
      console.log(e)
    }
    var type = params.file.split('/')
    var type2 = params.name.split('.')

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

    try {
      const docRef = await setDoc(doc(db, "files", id_company, "documents", params.nameFile), {
        id_user: id,
        id_file: params.nameFile,
        id_company: id_company,
        id_enterprise: id_enterprise,
        url: params.url,
        name: params.name,
        size: Math.ceil(params.size / 1000),
        created_date: date,
        type:type, 
        trash: false,
        viwed: false,
        folder: folderName,
        from: from
      });

      const data = {
        id_user: id,
        id_file: params.nameFile,
        id_company: id_company,
        id_enterprise: id_enterprise,
        url: params.url,
        name: params.name,
        size: Math.ceil(params.size / 1000),
        created_date: date,
        type:type,
        urlDownload: urlDownload,
        trash: false,
        viwed: false,
        checked:false,
        folder: folderName,
        from: from
      }
      setFiles((files) => [data, ...files])
      setFilesFilter((filesFilter) => [data, ...filesFilter])
    } catch (e) {
      toast.error("Não foi possível armazenar o " + params.name)
      console.log(e)
    } 
  }

  return(
    <>
      {permission > 0 ? (
        <label className={`${folderName === "Cliente" &&  permission > 0  ? "hidden" : <></>} bg-black dark:bg-white cursor-pointer text-white dark:text-black p-[5px] flex justify-center items-center rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>
          <p>+ Upload</p>
          <input onChange={ (e) => toast.promise(UploadFile(e.target) ,{pending:"Armazenando arquivos...", success:"Arquivos armazenados.", error:"Não foi possivel armazenar os arquivos"})} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
        </label>
        ) : (
        <label className={`${folderName !== "Cliente" &&  permission === 0  ? "hidden" : <></>} bg-black dark:bg-white cursor-pointer text-white dark:text-black p-[5px] flex justify-center items-center rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`} >
          <p>+ Upload</p>
          <input onChange={ (e) => toast.promise(UploadFile(e.target) ,{pending:"Armazenando arquivos...", success:"Arquivos armazenados.", error:"Não foi possivel armazenar os arquivos"})} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
        </label>
        )
      }
    </>
  )
}

export default UploadFiles;