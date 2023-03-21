import React, {useContext, useState, useEffect} from 'react'
import { ArrowLeftIcon, UploadIcon, DownloadIcon, TrashIcon } from '@radix-ui/react-icons';
import { Event } from '../../../types/interfaces'
import { FormatDate } from '../Utils/FormatDate';
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db, storage } from '../../../../firebase';
import AppContext from '../AppContext';
import { toast } from 'react-toastify';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import style from './calendar.module.css'
import styles from '../../Admin/Home/home.module.css'
import DownloadsFile from '../Files/dowloadFiles';
import DeletEvents from './deletEvents';

interface Props{
    eventSelected:Event
    eventsThatDay?:Event[]
    events:Event[]
    admin:boolean
    elementFather:string
    VerifyNotificationEvent?:Function
    setEventSelected:Function
    setEventsThatDay?:Function
}

function ViwedEvent({elementFather, eventSelected, eventsThatDay, events, admin, setEventSelected,  setEventsThatDay, VerifyNotificationEvent}:Props) {
    const context = useContext(AppContext)
    const [files, setFiles]= useState([])
    const [newFiles, setNewFiles]= useState([])
    const [dataEvent, setDataEvent] = useState({style:'', text:'', upload:true})
    const from = admin ? 'admin' : 'user'
    const messageToastDelet = {pending:'Deletando arquivo...', success:'Arquivo deletado com sucesso.'}

    useEffect(() =>{
        const diffInMs   = new Date().getTime() - new Date(eventSelected.dateSelected).getTime()
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) 
        if(eventSelected.complete){
            setDataEvent({style:'border-greenV bg-greenV/20', text:'Completo', upload:true})
        } else if(diffInDays <= 1){
            setDataEvent({style:'bg-[#d4d0d0] border-[#a9a6a6]', text:'Em aberto', upload:true})
        } else if( 5 >= diffInDays ) {
            setDataEvent({style:'bg-[#efd1478e] border-[#f4c703]', text:'Atrasado', upload:true})
        } else if(5 < diffInDays){
            setDataEvent({style:'border-red bg-red/20', text:'Incompleto', upload:false})
        }

        if(context.dataUser != undefined){
          GetFiles()
          UpdatedEventViwed()
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

    async function SelectFiles(e){
        const newFilesHere = [...newFiles]
        const filesHere = [...files]
        for await (const file of e.files) {
            if(file.size > 30000000){
                e.value = null
                return toast.error("Os arquivos só podem ter no maximo 30mb.")
            }
            file.id_file = Math.floor(1000 + Math.random() * 9000) + file.name;
            file.type2 = FindTypeFile(file)
            filesHere.push(file)
            newFilesHere.push(file)
        }
        setFiles(filesHere)
        setNewFiles(newFilesHere)
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
            const docsRef = ref(storage, `${context.dataUser.id_company}/files/${context.dataUser.id + "/" + file.id_file}`);
            try{
                const upload = await uploadBytes(docsRef, file)
                const url = await GetUrlDownload(upload.metadata.fullPath)
                await UploadFilestore({nameFile:file.id_file, name:file.name, size:file.size, type:file.type2, url:url})
            }catch(e){
                console.log(e)
            }
        }
        setEventSelected()
    }

    async function GetUrlDownload(path:string){
        return await getDownloadURL(ref(storage, path))
    }

    async function UploadFilestore({type, name, nameFile, size, url}){
        const date = new Date() + ""
        const data = {
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
        }

        try {
            await Promise.all([
                setDoc(doc(db, "files", context.dataUser.id_company, "Arquivos", nameFile), data),
                UpdatedEventComplete()
            ])
        } catch (e) {
            toast.error("Não foi possivel armazenar o " + name)
            console.log(e)
        } 
    }

    async function UpdatedEventComplete(){
        await updateDoc(doc(db, 'companies', context.dataUser.id_company, "events", eventSelected.id), {
            complete:true
        })
        const index1 = events.findIndex(event => event.id == eventSelected.id)
        events[index1].complete = true

        if(elementFather === 'table'){
            const index2 =  eventsThatDay.findIndex(event => event.id == eventSelected.id)
            eventsThatDay[index2].complete = true
        }
    }

    async function UpdatedEventViwed(){
        await updateDoc(doc(db, 'companies', context.dataUser.id_company, "events", eventSelected.id), {
            viwed:true
        })

        if(elementFather === 'home'){
            const index1 = events.findIndex(event => event.id == eventSelected.id)
            events.splice(index1, 1)
        }
    }

    function DownloadFiles(file){
        if(file.url){
         return   DownloadsFile({filesDownloaded:[file], from:from})
        }
        toast.error('Clique em salvar e depois faça download deste arquivo')
    }

    async function DeletFile(file, index){
        const filesFunction = [...files]
        const newFilesFunction = [...newFiles]

        if(file.folder){
            const fileOfStorage = files.filter(file => file.folder?.length > 5)
            if(fileOfStorage.length === 1){
                toast.error('Você não pode deletar todos os arquivos deste evento após ele ja estar completo.')
                throw Error
                return 
            }
            try{
                const desertRef = ref(storage, file.id_company + '/files/' + file.id_user + "/" + file.id_file);
                await Promise.all([
                    deleteDoc(doc(db, 'files', file.id_company, "Arquivos", file.id_file)),
                    deleteObject(desertRef)
                ])
            } catch(e){
                console.log(e)
                throw Error
            }

        } 

        const index2 = newFiles.findIndex(file => file.id === file.id)

        newFilesFunction.splice(index2, 1)
        filesFunction.splice(index, 1)

        setFiles(filesFunction)
        setNewFiles(newFilesFunction)

    }

  return (
    <div className="flex justify-center items-center w-screen h-screen fixed z-50 left-0 top-0 bg-black/20 backdrop-blur-sm">
        <div className='max-w-[800px] w-[90%] max-h-[95%] border-b-[2px] border-[2px] border-terciary rounded-[8px] bg-primary px-[4px] py-[5px] relative flex flex-col'>
            <div onClick={() =>  {elementFather === 'table' ?  setEventsThatDay() : setEventSelected()}} className="cursor-pointer w-[4px] h-[30px] rounded-[4px] bg-neutral-400 rotate-45 after:w-[4px] after:h-[30px] after:block after:bg-neutral-400 after:rounded-[4px] after:cursor-pointer after:rotate-90 absolute right-[18px] top-[5px]"></div>
            {elementFather === 'table' ?
                <button onClick={() => setEventSelected()} className="cursor-pointer absolute left-[0px] top-[5px]">
                    <ArrowLeftIcon className="w-[50px] h-[35px] text-neutral-400" />
                </button>
            : <></>}
            <p className="font-poiretOne text-[40px] max-lsm:text-[30px] self-center">Evento</p>
            <div>
                <p className="text-[20px] text-left max-lsm:text-[18px] mt-[10px] overflow-hidden text-ellipsis"><span className="font-[600]">Titúlo:</span> {eventSelected.title}</p>
                <p className="text-[20px] text-left max-lsm:text-[18px] mt-[10px] overflow-hidden text-ellipsis"><span className="font-[600]">Observação:</span> {eventSelected.observation}</p>
                <p className="text-[20px] text-left max-lsm:text-[18px] mt-[10px] overflow-hidden text-ellipsis"><span className="font-[600]">Empresa:</span> {eventSelected.enterprise.name}</p>
                <p className="text-[20px] text-left max-lsm:text-[18px] mt-[10px] overflow-hidden text-ellipsis"><span className="font-[600]">Nome:</span> {eventSelected.userName}</p>
                <p className="text-[20px] text-left max-lsm:text-[18px] mt-[10px] overflow-hidden text-ellipsis"><span className="font-[600]">Data Selecionada:</span> {FormatDate(eventSelected.dateSelected)}</p>
            </div>

            <div className='flex mt-[10px]'>
                <div className='flex text-[20px] max-lsm:text-[18px]'>
                    <p className="font-[600]">Status:</p> 
                    <p className={`px-[5px] border-[1px] ml-[5px] leading-[3px] font-[600] text-[16px] flex items-center rounded-[4px] text-center ${dataEvent.style}`} >{dataEvent.text}</p>
                </div>
            </div>
            {dataEvent.upload ? 
                <>
                    {admin ? <></> 
                    : 
                        <div className='flex mt-[10px] items-center flex-col pb-[15px]'>
                            <p>Armazene seus arquivos</p>
                            <label className={` bg-neutral-400/20 border-[2px] border-neutral-400 w-[250px] h-[80px] dark:bg-white cursor-pointer text-white dark:text-black p-[5px] flex justify-center items-center rounded-[8px] text-[17px] max-sm:text-[14px]`}>
                                <UploadIcon className="w-[50px] h-[35px] text-neutral-400" />
                                <input onChange={ (e) => SelectFiles(e.target)} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
                            </label>
                        </div>
                    }
                    <div id={styles.boxFiles} className={`${files.length > 0 ? 'mt-[10px] overflow-x-auto pr-[3px]' : ''}`}>
                        {files?.map((file, index) => {
                            return(
                                <div key={index} className="flex mt-[8px] justify-center ">
                                    <div className='border-[2px] border-neutral-300 px-[2px] pb-[2px] pt-[3px] rounded-[4px] w-[60%] max-md:w-full'>
                                        <div className='flex items-center w-full relative'>
                                            <Image src={`/icons/${file.type2 ? file.type2 : file.type}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={40} height={40}  className='mr-[5px] w-[30px] max-lg:w-[25px]  h-[30px] max-lg:h-[25px]'/>
                                            <p className='max-lg:text-[16px] mr-[45px] max-sm:text-[14px] text-ellipsis overflow-hidden whitespace-nowrap'>{file.name}</p>
                                            <div className='absolute right-0 flex items-center justify-center'>
                                                <TrashIcon onClick={() => toast.promise(DeletFile(file, index), messageToastDelet)} width={22} height={22} className='text-red cursor-pointer hover:scale-110 duration-100'/>
                                                <DownloadIcon onClick={() => DownloadFiles(file)} width={22} height={22} className='cursor-pointer ml-[3px] hover:scale-110 duration-100'/>
                                            </div>
                                        </div>
                                        <div id={style.animationUpdate}/>
                                    </div>
                                </div>
                            )
                        })}
                    </div>


                    {admin ? 
                        <DeletEvents files={files} eventSelected={eventSelected} eventsThatDay={eventsThatDay} events={events} id_company={context.dataUser.id_company} setEventSelected={setEventSelected} setEventsThatDay={ setEventsThatDay} />
                    : 
                        <div className={`${files.length > 0 ? 'border-greenV ' : 'border-neutral-400'} border-[2px] self-center rounded-[4px] mt-[15px] hover:scale-105`}>
                            <button onClick={() => UploadFiles() } className={`${files.length > 0 ? 'text-greenV bg-greenV/20' : 'text-neutral-[500] bg-neutral-300'} cursor-pointer   self-center text-[20px] max-lsm:text-[18px] px-[8px] py-[2]`}>Salvar</button>
                        </div>
                    }
                </>
            : 
                <>
                    <p className='text-[18px] text-red max-sm:text-[16px] max-sm:text-center'>Este evento ja venceu e você não consegue mais fazer o armazenamento de arquivos.</p>  
                </>
            }
          </div>
    </div>
  )
}

export default ViwedEvent