import { storage, db } from '../../../firebase'
import { ref,  uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";  
import { toast } from 'react-toastify';

  interface Props{
    data:{
      file:any
      from:string
      folder:string
      id:string
    }
    childToParentUpload:Function
    id_company:string
    id_user:string
  }

  async function UploadFiles(props:Props) {
    const file = props.data.file
    for (var i = 0; i < file.length; i++) {
      const type = file[i].type
      const name = file[i].name
      const size = file[i].size
      const referencesFile = Math.floor(Math.random() * 65536) + file[i].name;
        const storageRef = ref(storage, props.id_company + "/files/" + props.id_user+ "/" + referencesFile);
        uploadBytes(storageRef, file[i])
        .then((snapshot) => {
          getDownloadURL(ref(storage, props.id_company + "/files/" + props.id_user+ "/" + referencesFile))
          .then((url) => { 
             UploadFilestore({id_company:props.id_company, from:props.data.from, folder:props.data.folder, url, nameFile:referencesFile, name:name, size:size, id:props.data.id, file: type, function: props.childToParentUpload})
          })
          .catch((error) => {
            toast.error("Não foi possivel armazenar o " + name)
            return console.log(error)
          }); 
        })
        .catch((error) => {
          return console.log(error)
      });
    }
  }

  async function UploadFilestore(props){
    let blob = await fetch(props.url).then(r => r.blob());
    var urlDownload = (window.URL ? URL : webkitURL).createObjectURL(blob)

    var type = props.file.split('/')
    if (type.at(0) === 'image'){
      type = "images"
    } else if (type.at(1) === "pdf"){
      type = "pdfs"
    } else if(type.at(1) === "x-zip-compressed") {
      type = "zip"
    } else if(type.at(0) === "text") {
      type = "txt"
    } else {
      type = "docs"
    }

    const date = new Date() + ""
    try {
      const docRef = await setDoc(doc(db, "files", props.id_company, "Arquivos", props.nameFile), {
        id_user: props.id,
        id_file: props.nameFile,
        id_company: props.id_company,
        url: props.url,
        name: props.name,
        size: Math.ceil(props.size / 1000),
        created_date: date,
        type:type, 
        trash: false,
        viwed: false,
        folder: props.folder,
        from: props.from
      });

      const data = {
        id_user: props.id,
        id_file: props.nameFile,
        id_company: props.id_company,
        url: props.url,
        name: props.name,
        size: Math.ceil(props.size / 1000),
        created_date: date,
        type:type,
        urlDownload: urlDownload,
        trash: false,
        viwed: false,
        checked:false,
        folder: props.folder,
        from: props.from
      }
      props.function(data)
    } catch (e) {
      toast.error("Não foi possivel armazenar o " + props.name)
      console.log(e)
    } 
  }
  

export default UploadFiles;