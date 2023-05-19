import React, {useContext, useState, useEffect} from 'react'
import { ArrowLeftIcon, UploadIcon, DownloadIcon, TrashIcon } from '@radix-ui/react-icons';
import { Event } from '../../../types/event'
import { FormatDate } from '../../../Utils/Other/FormatDate';
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db, storage } from '../../../../firebase';
import { userContext } from "../../../app/Context/contextUser";
import { companyContext } from '../../../app/Context/contextCompany';
import { toast } from 'react-toastify';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import style from './calendar.module.css'
import styles from '../../Admin/Home/home.module.css'
import DownloadsFile from '../Files/dowloadFiles';
import DeletEvents from './deletEvents';
import { Files } from '../../../types/files';
import { GetFilesEvent } from '../../../Utils/Firebase/GetFiles'


interface Props{
    eventSelected:Event
    eventsThatDay?:Event[]
    events:Event[]
    admin:boolean
    elementFather:string
    setEventSelected?:Function
    setEventsThatDay?:Function
}

function ViwedEvent({elementFather, eventSelected, eventsThatDay, events, admin, setEventSelected,  setEventsThatDay}:Props) {
    const {dataUser} = useContext(userContext)
    const [files, setFiles]= useState<Files[]>([])
    const [newFiles, setNewFiles]= useState<any>([])
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

        if(dataUser != undefined){
            const id_company = dataUser.id_company
            GetFilesEvent({id_company, eventSelected, setFiles})
            UpdatedEventViwed()
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[dataUser])

    //setando evento visualizado
    async function UpdatedEventViwed(){
        await updateDoc(doc(db, 'companies', dataUser.id_company, "events", eventSelected.id), {
            viwed:true
        })

        if(elementFather === 'home'){
            const index1 = events.findIndex(event => event.id == eventSelected.id)
            events.splice(index1, 1)
        }
    }
    

    //Pegando arquivos do input file
    async function SelectFiles(e){
        const newFilesHere:Files[] = [...newFiles]
        const filesHere = [...files]
        for await (const file of e.files) {
            if(file.size > 30000000){
                e.value = null
                return toast.error("Os arquivos só podem ter no maximo 30mb.")
            }
            file.id = Math.floor(1000 + Math.random() * 9000) + file.name;
            file.type2 = FindTypeFile(file)
            filesHere.push(file)
            newFilesHere.push(file)
        }
        setFiles(filesHere)
        setNewFiles(newFilesHere)
        e.value = null
    }

    //Buscando o tipo
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

    //Guardando arquivos no storage
    function UploadFiles(){
        if(files.length < 0){
            return toast.error("Faça o armazenamento de algum arquivo para salvar.")
        } 

        toast.promise(UploadFileStorage(),{pending:'Armazenando os arquivos...', success:'Arquivos aramazenados com sucesso.', error:'Não foi possivel armazerar estes arquivos.'})
    }

    async function  UploadFileStorage() {
        const promises:any = []
        for await (const file of newFiles) {
            const docsRef = ref(storage, `${dataUser.id_company}/files/${dataUser.id}/${eventSelected.enterprise.id}/Cliente/${file.id}`);
            promises.push(uploadBytes(docsRef, file))
        }
        try{
            const result = await Promise.all(promises)

            await Promise.all([UploadFilestore(result), UpdatedEventComplete()])


        } catch(e){
            console.log(e)
        }

        if(setEventSelected){
            setEventSelected()
        }
    }

    //Guardando arquivos no firestore 
    async function UploadFilestore(result){
        const enterprise = dataUser.enterprises.find((data) => data.id === eventSelected.enterprise.id)
        const folder = enterprise?.folders.find((data) => data.name === 'Cliente')
        const date = new Date() + ""
        const promises:any = []
        if(folder){
            for(var i = 0; i < newFiles.length; i++){
                const data:Files= {
                    id_user: eventSelected.id_user,
                    id: newFiles[i].id,
                    path:result[i].metadata.fullPath,
                    id_company: dataUser.id_company,
                    id_enterprise: eventSelected.enterprise.id,
                    id_event:eventSelected.id,
                    name: newFiles[i].name,
                    size: Math.ceil(files[i].size / 1000),
                    created_date: date,
                    type:newFiles[i].type2, 
                    trash: false,
                    viewed: false,
                    id_folder: folder.id,
                    from: 'user',
                    favorite:false,
                    viewedDate:'',
                    message:'',
                    downloaded:false
                }
                const docRef = doc(db, "files", dataUser.id_company, eventSelected.id_user, newFiles[i].id)
                promises.push(setDoc(docRef, data))
            } 
        }

        try {
            await Promise.all(promises)
        } catch (e) {
            toast.error("Não foi possivel armazenar o " + name)
            console.log(e)
        } 
    }

    //setando evento completo
    async function UpdatedEventComplete(){
        await updateDoc(doc(db, 'companies', dataUser.id_company, "events", eventSelected.id), {
            complete:true
        })

        if(events.length > 0){
            const index = events.findIndex(event => event.id == eventSelected.id)
            events[index].complete = true
        } 
        
        if (elementFather === 'table' && eventsThatDay && setEventsThatDay){
            const index =  eventsThatDay.findIndex(event => event.id == eventSelected.id)
            eventsThatDay[index].complete = true
            
            setEventsThatDay([...eventsThatDay])
        }
    }

    function DownloadFiles(file){
        if(file.path){
         return DownloadsFile({selectFiles:[file], from:from, id_folder: file.id_folder})
        }
        toast.error('Clique em salvar e depois faça download deste arquivo')
    }

    async function DeletFile(file, index){
        const filesFunction = [...files]
        const newFilesFunction = [...newFiles]

        if(file.id_folder){
            try{
                const desertRef = ref(storage, `${file.path}`);
                await Promise.all([
                    deleteDoc(doc(db, 'files', file.id_company, file.id_user, file.id)),
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
            <div onClick={() =>  {setEventsThatDay && elementFather  === 'table' ?  setEventsThatDay() : setEventSelected ? setEventSelected() : ''}} className="cursor-pointer w-[4px] h-[30px] rounded-[4px] bg-neutral-400 rotate-45 after:w-[4px] after:h-[30px] after:block after:bg-neutral-400 after:rounded-[4px] after:cursor-pointer after:rotate-90 absolute right-[18px] top-[5px]"></div>
            {elementFather === 'table' && setEventSelected ?
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
            {dataEvent.upload && setEventSelected ? 
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
                        {files?.map((file:any, index) => {
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


                    {admin && eventsThatDay && setEventsThatDay ? 
                        <DeletEvents files={files} eventSelected={eventSelected} eventsThatDay={eventsThatDay} events={events} id_company={dataUser.id_company} setEventSelected={setEventSelected} setEventsThatDay={ setEventsThatDay} />
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