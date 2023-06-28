import React, {useContext, useState, useEffect} from 'react'
import { ArrowLeftIcon, UploadIcon, DownloadIcon, TrashIcon } from '@radix-ui/react-icons';
import { Event } from '../../../types/event'
import { FormatDate } from '../../../Utils/Other/FormatDate';
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where, writeBatch } from 'firebase/firestore';
import { db, storage } from '../../../../firebase';
import { userContext } from "../../../app/Context/contextUser";
import { companyContext } from '../../../app/Context/contextCompany';
import { toast } from 'react-toastify';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import style from './calendar.module.css'
import styles from '../../Admin/Home/home.module.css'
import DownloadsFile from '../Files/dowloadFiles';
import DeletEvents from '../../Admin/Calendar/deletEvents';
import { Files } from '../../../types/files';
import { GetFilesEvent } from '../../../Utils/Firebase/GetFiles'
import { GetSizeCompany } from '../../../Utils/Other/getSizeCompany';
import updateSizeCompany from '../../../Utils/Other/updateSizeCompany';
import { adminContext } from '../../../app/Context/contextAdmin';


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
    const batch = writeBatch(db);
    const { dataCompany } = useContext(companyContext)
    const { dataAdmin } = useContext(adminContext)
    const {dataUser} = useContext(userContext)
    const [files, setFiles]= useState<Files[]>([])
    const [newFiles, setNewFiles]= useState<any>([])
    const [dataEvent, setDataEvent] = useState({style:'', text:'', upload:true})
    const from = admin ? 'admin' : 'user'
    const messageToastDelet = {pending:'Deletando arquivo...', success:'Arquivo deletado com sucesso.'}

    useEffect(() =>{
        GetStatus(eventSelected.complete)
        if(dataUser != undefined || dataAdmin != undefined){
            const id_company = dataUser.id_company ? dataUser.id_company : dataAdmin.id_company
            GetFilesEvent({id_company, eventSelected, setFiles})
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[dataUser, dataAdmin])

    function GetStatus(complete:Boolean){
        const diffInMs   = new Date().getTime() - new Date(eventSelected.dateSelected).getTime()
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) 
        if(complete){
            setDataEvent({style:'border-greenV bg-greenV/20', text:'Completo', upload:true})
        } else if(diffInDays <= 1){
            setDataEvent({style:'bg-[#d4d0d0] border-[#a9a6a6]', text:'Em aberto', upload:true})
        } else if( 5 >= diffInDays ) {
            setDataEvent({style:'bg-[#efd1478e] border-[#f4c703]', text:'Atrasado', upload:true})
        } else if(5 < diffInDays){
            setDataEvent({style:'border-red bg-red/20', text:'Incompleto', upload:false})
        }
    }
    

    //Pegando arquivos do input file
    async function SelectFiles(dataFiles){
        if(dataFiles.length > 10){
            throw toast.error('Você não pode armazenar mais de 10 arquivos de uma vez.')
        }

        const newFilesHere:Files[] = [...newFiles]
        const filesHere = [...files]
        for await (const file of dataFiles) {
            if(file.size > 30000000){
                toast.error(`O arquivo ${file.name} excede o limite de 30mb.`)
            } else {
                file.id = Math.floor(1000 + Math.random() * 9000) + file.name;
                file.type2 = FindTypeFile(file)
                filesHere.push(file)
                newFilesHere.push(file)
            }
        }
        setFiles(filesHere)
        setNewFiles(newFilesHere)
        dataFiles.value = null
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
        
        if(newFiles.length > 0){
            toast.promise(UploadFileStorage(),{pending:'Armazenando os arquivos...', success:'Arquivos aramazenados com sucesso.'})
        }
    }

    async function  UploadFileStorage() {
        const promises:any = []
        var size = 0
        for await (const file of newFiles) {
            const docsRef = ref(storage, `${dataUser.id_company}/files/${dataUser.id}/${eventSelected.id_enterprise}/Cliente/${file.id}`);
            promises.push(uploadBytes(docsRef, file))
            size += file.size
        }

        const companySize = await GetSizeCompany({id_company:dataUser.id_company})

        if((companySize + size) > dataCompany.maxSize){
        throw toast.error('Limite de armazenamento foi excedido.')
        }

        await updateSizeCompany({id_company:dataUser.id_company, size, action:'sum'})

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
        const enterprise = dataUser.enterprises.find((data) => data.id === eventSelected.id_enterprise)
        const folder = enterprise?.folders.find((data) => data.name === 'Cliente')
        const date = new Date() + ""
        if(folder){
            for(var i = 0; i < newFiles.length; i++){
                const data:Files= {
                    id_user: eventSelected.id_user,
                    id: newFiles[i].id,
                    path:result[i].metadata.fullPath,
                    id_company: dataUser.id_company,
                    id_enterprise: eventSelected.id_enterprise,
                    id_event:eventSelected.id,
                    name: newFiles[i].name,
                    size: files[i].size,
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
                console.log(data)
                const docRef = doc(db, "files", dataUser.id_company, eventSelected.id_user, 'user', 'files', newFiles[i].id)
                batch.set(docRef, data)
            }   
        }

        try {
            await batch.commit()
        } catch (e) {
            toast.error("Não foi possivel armazenar o " + name)
            console.log(e)
        } 
    }

    //setando evento completo
    async function UpdatedEventComplete(){
        if(!eventSelected.complete){
            await updateDoc(doc(db, 'companies', dataUser.id_company, "events", eventSelected.id), {
                complete:true
            })
            
            if (elementFather === 'table' && eventsThatDay && setEventsThatDay){
                const index =  eventsThatDay.findIndex(event => event.id == eventSelected.id)
                eventsThatDay[index].complete = true
                setEventsThatDay([...eventsThatDay])
            }
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
            var size = file.size
            try{
                const desertRef = ref(storage, `${file.path}`);
                await Promise.all([
                    deleteDoc(doc(db, 'files', file.id_company, file.id_user,  'user', 'files', file.id)),
                    deleteObject(desertRef)
                ])
                
                await updateSizeCompany({id_company:file.id_company, size, action:'subtraction'})
                
            } catch(e){
                console.log(e)
                throw Error
            }
        } 

        const index2 = newFiles.findIndex(file => file.id === file.id)

        newFilesFunction.splice(index2, 1)
        filesFunction.splice(index, 1)

        const id_company = file.id_company

        setFiles(filesFunction)
        setNewFiles(newFilesFunction)
        UpdatedEventIncomplete({files:filesFunction.filter((data) => data.id_folder), id_company})
    }

    async function UpdatedEventIncomplete({files, id_company}){
        if(eventSelected.complete && files.length === 0){
            await updateDoc(doc(db, 'companies', id_company, "events", eventSelected.id), {
                complete:false
            })
            
            if (elementFather === 'table' && eventsThatDay && setEventsThatDay && setEventSelected){
                const index =  eventsThatDay.findIndex(event => event.id == eventSelected.id)
                eventsThatDay[index].complete = false
                GetStatus(false)
                setEventsThatDay([...eventsThatDay])
            }
        }
    }

  return (
    <div className="flex justify-center items-center w-screen h-screen fixed z-50 left-0 top-0 bg-black/20 backdrop-blur-sm">
        <div className='max-w-[800px] w-[90%] max-h-[95%] border-b-[2px] border-[2px] border-terciary rounded-[8px] bg-primary px-[4px] pt-[5px] pb-[10px] relative flex flex-col'>
            <div onClick={() =>  {setEventsThatDay && elementFather  === 'table' ?  setEventsThatDay() : setEventSelected ? setEventSelected() : ''}} className="cursor-pointer w-[2px] h-[30px] rounded-[4px] bg-neutral-400 rotate-45 after:w-[2px] after:h-[30px] after:block after:bg-neutral-400 after:rounded-[4px] after:cursor-pointer after:rotate-90 absolute right-[20px] top-[5px]"></div>
            {elementFather === 'table' && setEventSelected ?
                <button onClick={() => setEventSelected()} className="cursor-pointer absolute left-[0px] top-[5px]">
                    <ArrowLeftIcon className="w-[50px] h-[35px] text-neutral-400" />
                </button>
            : <></>}
            <p className="font-poiretOne text-[40px] max-lsm:text-[30px] self-center">Evento</p>
            <div>
                <p className="text-[20px] text-left max-lsm:text-[18px] mt-[10px] overflow-hidden text-ellipsis"><span className="font-[600]">Titúlo:</span> {eventSelected.title}</p>
                <p className="text-[20px] text-left max-lsm:text-[18px] mt-[10px] overflow-hidden text-ellipsis"><span className="font-[600]">Observação:</span> {eventSelected.observation}</p>
                <p className="text-[20px] text-left max-lsm:text-[18px] mt-[10px] overflow-hidden text-ellipsis"><span className="font-[600]">Empresa:</span> {eventSelected.name_enterprise}</p>
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
                                <input onChange={ (e) => SelectFiles(e.target.files)} multiple={true} type="file" name="document" id="document" className='hidden w-full h-full' />
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
                        <DeletEvents files={files} eventSelected={eventSelected} eventsThatDay={eventsThatDay} events={events} id_company={dataAdmin.id_company} setEventSelected={setEventSelected} setEventsThatDay={ setEventsThatDay} />
                    : 
                        <div className={`${files.length > 0 ? 'border-greenV ' : 'border-neutral-400'} border-[2px] self-center rounded-[4px] mt-[15px] hover:scale-105`}>
                            <button onClick={() => UploadFiles() } className={`${files.length > 0 ? 'text-greenV bg-greenV/20' : 'text-neutral-[500] bg-neutral-300'} cursor-pointer   self-center text-[20px] max-lsm:text-[18px] px-[8px] py-[2]`}>Salvar</button>
                        </div>
                    }
                </>
            : 
                
                <p className='text-[18px] text-red max-sm:text-[16px] max-sm:text-center'>Este evento ja venceu e você não consegue mais fazer o armazenamento de arquivos.</p>  
                
            }
          </div>
    </div>
  )
}

export default ViwedEvent