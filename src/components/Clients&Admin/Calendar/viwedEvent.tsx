import React, {useContext, useState, useEffect} from 'react'
import { ArrowLeftIcon, UploadIcon, DownloadIcon } from '@radix-ui/react-icons';
import { Event, Modal } from '../../../types/interfaces'
import { FormatDate } from '../Utils/FormatDate';
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db, storage } from '../../../../firebase';
import AppContext from '../AppContext';
import { toast } from 'react-toastify';
import Modals from '../../Clients&Admin/Modals'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import style from './calendar.module.css'
import styles from '../../Admin/Home/home.module.css'
import DownloadsFile from '../Files/dowloadFiles';

interface Props{
    eventSelected:Event
    eventsSelected:Event[]
    events:Event[]
    admin:boolean
    setEventSelected:Function
    setEventsSelected:Function
}

function ViwedEvent({eventSelected, eventsSelected, events, admin, setEventSelected, setEventsSelected}:Props) {
    const context = useContext(AppContext)
    const [modal, setModal] = useState<Modal>({status: false, message: "", subMessage1: "", subMessage2:""})
    const messageToast = {pendig:'Deletando evento....', success:'Evento deletado com sucesso.', error:'Não foi possivel deletar este evento.'}
    const messageModal = {status: true, message: "Tem certeza que deseja excluir este evento?", subMessage1: "Sera permanente.", subMessage2: "Não sera possivel recupera-lo."}
    const [files, setFiles]= useState([])
    const [newFiles, setnewFiles]= useState([])
    const from = admin ? 'admin' : 'user'

    useEffect(() =>{
        if(context.dataUser != undefined){
          GetFiles()
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[context.dataUser])

    async function GetFiles(){
        const getFiles = []
        var q = query(collection(db, "files", context.dataUser.id_company, "Arquivos"), where("id_event", "==",  eventSelected.id));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          getFiles.push(doc.data())
        });

        setFiles(getFiles)
    }

    const childModal = () => {
        setModal({status: false, message: "", subMessage1: ""})
        toast.promise(DeletEvent, messageToast)
    }

    async function DeletEvent() {
        await deleteDoc(doc(db, "companies", context.dataUser.id_company, 'events', eventSelected.id));
        const index1 = events.findIndex(event => event.id == eventSelected.id)
        const index2 = eventsSelected.findIndex(event => event.id == eventSelected.id)
        events.splice(index1, 1)
        eventsSelected.splice(index2, 1)

        if(eventsSelected.length > 0){
            setEventSelected()
        } else {
            setEventsSelected()
        }
    }

    async function SelectFiles(e){
        const newFilesHere = [...newFiles]
        const filesHere = [...files]
        for await (const file of e.files) {
            if(file.size > 30000000){
                e.value = null
                return toast.error("Os arquivos só podem ter no maximo 30mb.")
            }
            file.type2 = FindTypeFile(file)
            filesHere.push(file)
            newFilesHere.push(file)
        }
        setFiles(filesHere)
        setnewFiles(newFilesHere)
        e.value = null
    }

    function FindTypeFile(file){
        var type = file.type.split('/')
        var type2 = file.name.split('.')
    
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
        return type
    }

    function UploadFiles(){
        if(files.length < 0){
            return toast.error("Faça o armazenamento de algum arquivo para salvar.")
        } 
        toast.promise(UploadFileStorage(),{pending:'Armazenando os arquivos...', success:'Arquivos aramazenados com sucesso.', error:'Não foi possivel armazerar estes arquivos.'})
    }

    async function  UploadFileStorage() {
        for await (const file of newFiles) {
            const referencesFile = Math.floor(1000 + Math.random() * 9000) + file.name;
            const docsRef = ref(storage, `${context.dataUser.id_company}/files/${context.dataUser.id + "/" + referencesFile}`);
            try{
                const upload = await uploadBytes(docsRef, file)
                const url = await GetUrlDownload(upload.metadata.fullPath)
                UploadFilestore({nameFile:referencesFile, name:file.name, size:file.size, type:file.type2, url:url})
            }catch(e){
                console.log(e)
            }
        }
    }

    async function GetUrlDownload(path:string){
        return await getDownloadURL(ref(storage, path))
    }

    async function UploadFilestore({type, name, nameFile, size, url}){
        const date = new Date() + ""

    try {
        const docRef = await setDoc(doc(db, "files", context.dataUser.id_company, "Arquivos", nameFile), {
            id_user: eventSelected.id_user,
            id_file: nameFile,
            id_company: context.dataUser.id_company,
            id_enterprise: eventSelected.enterprise.id,
            id_event:eventSelected.id,
            url: url,
            name: name,
            size: Math.ceil(size / 1000),
            created_date: date,
            type:type, 
            trash: false,
            viwed: false,
            folder: 'Cliente',
            from: 'user'
        });
        UpdatedEvent()
    } catch (e) {
        toast.error("Não foi possivel armazenar o " + name)
        console.log(e)
    } 
    }

    async function UpdatedEvent(){
        await updateDoc(doc(db, 'companies', context.dataUser.id_company, "events", eventSelected.id), {
            complete:true
        })
        const index1 = events.findIndex(event => event.id == eventSelected.id)
        const index2 = eventsSelected.findIndex(event => event.id == eventSelected.id)
        events[index1].complete = true
        eventsSelected[index2].complete = true
        setEventSelected()
    }

  return (
    <div className="flex flex-col w-full h-full px-[10px] text-ellipsis">
        {modal.status ? <Modals setModal={setModal} message={modal.message} subMessage1={modal.subMessage1} subMessage2={modal.subMessage2} childModal={childModal}/> : <></>}
        <div onClick={() => setEventsSelected()} className="cursor-pointer w-[4px] h-[30px] rounded-[4px] bg-neutral-400 rotate-45 after:w-[4px] after:h-[30px] after:block after:bg-neutral-400 after:rounded-[4px] after:cursor-pointer after:rotate-90 absolute right-[18px] top-[5px]"></div>
        <button onClick={() => setEventSelected()} className="cursor-pointer absolute left-[0px] top-[5px]">
            <ArrowLeftIcon className="w-[50px] h-[35px] text-neutral-400" />
        </button>
        <p className="font-poiretOne text-[40px] max-lsm:text-[30px] self-center">Evento</p>
        <p className="text-[20px] text-left max-lsm:text-[18px] mt-[10px] overflow-hidden text-ellipsis"><span className="font-[600]">Titúlo:</span> {eventSelected.title}</p>
        <p className="text-[20px] text-left max-lsm:text-[18px] mt-[10px] overflow-hidden text-ellipsis"><span className="font-[600]">Observação:</span> {eventSelected.observation}</p>
        <p className="text-[20px] text-left max-lsm:text-[18px] mt-[10px] overflow-hidden text-ellipsis"><span className="font-[600]">Empresa:</span> {eventSelected.enterprise.name}</p>
        <p className="text-[20px] text-left max-lsm:text-[18px] mt-[10px] overflow-hidden text-ellipsis"><span className="font-[600]">Nome:</span> {eventSelected.userName}</p>
        <p className="text-[20px] text-left max-lsm:text-[18px] mt-[10px] overflow-hidden text-ellipsis"><span className="font-[600]">Data Selecionada:</span> {FormatDate(eventSelected.dateSelected)}</p>
        <div className='flex mt-[10px]'>
            <div className='flex text-[20px] max-lsm:text-[18px]'>
                <p className="font-[600]">Status:</p> 
                <p className={`px-[5px] border-[1px] ml-[5px] leading-[3px] font-[600] text-[16px] flex items-center rounded-[4px] text-center ${eventSelected.complete ? 'border-greenV bg-greenV/20 text-greenV' : 'border-red bg-red/20 text-red'}`} >{eventSelected.complete ? "Completo" : "Incompleto"}</p>
            </div>
        </div>
        <div className='flex mt-[10px] items-center flex-col pb-[15px]'>
            <p>Armazene seus arquivos</p>
            <label className={` bg-neutral-400/20 border-[2px] border-neutral-400 w-[300px] h-[100px] dark:bg-white cursor-pointer text-white dark:text-black p-[5px] flex justify-center items-center rounded-[8px] text-[17px] max-sm:text-[14px]`}>
                <UploadIcon className="w-[50px] h-[35px] text-neutral-400" />
                <input onChange={ (e) => SelectFiles(e.target)} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
            </label>
        </div>

        <div id={styles.boxFiles} className='h-[170px] overflow-x-auto'>
            {files?.map((file, index) => {
                return(
                    <div key={index} className="flex mt-[10px] justify-center pr-[3px]">
                        <div className='border-[2px] border-neutral-300 px-[5px] py-[3px] rounded-[4px] w-[60%]'>
                            <div className='flex items-center w-full relative'>
                                <Image src={`/icons/${file.type2 ? file.type2 : file.type}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={40} height={40}  className='text-[10px] mt-[3px] mr-[10px] w-[30px] max-lg:w-[25px]  h-[30px] max-lg:h-[25px]'/>
                                <p className='max-lg:text-[16px] mr-[25px] max-sm:text-[14px] text-ellipsis overflow-hidden whitespace-nowrap'>{file.name}</p>
                                {file.url ? <DownloadIcon onClick={() => DownloadsFile({filesDownloaded:[file], from:from})} width={22} height={22} className='cursor-pointer ml-[20px] absolute right-0'/> : <></>}
                            </div>
                            <div id={style.animationUpdate}/>
                        </div>
                    </div>
                )
            })}
        </div>


        {admin ? 
            <div className='border-red border-[2px] self-center rounded-[4px] mt-[15px] hover:scale-105'>
                <button onClick={() => setModal(messageModal) } className="cursor-pointer text-red bg-red/20  self-center text-[20px] max-lsm:text-[18px] px-[8px] py-[2]">Deletar</button>
            </div>
        : 
        <div className={`${files.length > 0 ? 'border-greenV ' : 'border-neutral-400'} border-[2px] self-center rounded-[4px] mt-[15px] hover:scale-105`}>
            <button onClick={() => UploadFiles() } className={`${files.length > 0 ? 'text-greenV bg-greenV/20' : 'text-neutral-[500] bg-neutral-300'} cursor-pointer   self-center text-[20px] max-lsm:text-[18px] px-[8px] py-[2]`}>Salvar</button>
        </div>
        }
    </div>
  )
}

export default ViwedEvent