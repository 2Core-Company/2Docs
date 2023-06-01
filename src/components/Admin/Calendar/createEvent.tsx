import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { FormatDate } from '../../../Utils/Other/FormatDate'
import Image from 'next/image'
import Document from '../../../../public/icons/document.svg'
import styles from '../../Admin/Home/home.module.css'
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { useContext, useState } from 'react'
import { adminContext } from '../../../app/Context/contextAdmin';
import { toast } from 'react-toastify';
import { Enterprise } from '../../../types/others'
import Arrow from '../../../../public/icons/arrow.svg'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Event } from '../../../types/event';


interface Props{
    dateSelected:string
    id:string
    enterprises:Enterprise[]
    userName:string
    email:string
    setDateSelected:Function
    setModalEvent:Function
}

function CreateEvent({email, setDateSelected, dateSelected, id, enterprises, userName, setModalEvent}:Props) {
    const { dataAdmin } = useContext(adminContext);
    const [changeEnterprise, setChangeEnterprise] = useState(false);
    const [dataEvent, setDataEvent] = useState<Event>({id:uuidv4(), title:"", observation:"", dateSelected:dateSelected, id_user:id, complete:false, enterprise: enterprises[0], userName:userName, viewed: false});
    const messageToast = {pending: 'Criando evento...', success:'Evento criado com sucesso.', error:'Não foi possivel criar este evento.'};

    async function CreatedEvent(){
        try{            
            await setDoc(doc(db, "companies", contextUser.dataUser.id_company, "events", dataEvent.id), dataEvent),
            setModalEvent(false)
            SendEmail()
        } catch(e){
            console.log(e)
            throw Error
        }
    }

    function OnToast(e: { preventDefault: () => void; }){
        e.preventDefault()
        toast.promise(CreatedEvent(),messageToast)
    }

    async function SendEmail() {
        const data = {
            email: email,
            title: dataEvent.title,
            observation: dataEvent.observation,
            enterprise: dataEvent.enterprise.name,
            dateSelected: dataEvent.dateSelected
        }
        const domain:string = new URL(window.location.href).origin
        try{
          const result = await axios.post(`${domain}/api/events/sendEmail`, data)  
          if(result.status === 200){
            toast.success('Enviamos um email para seu cliente, notificando sobre este evento.')
          }
        }catch(e){
            console.log(e)
            throw Error
        }
    }

    return (
        <form onSubmit={OnToast} className="flex flex-col w-[460px] max-lsm:w-[360px] px-[10px]">
            <button className="cursor-pointer absolute left-[0px] top-[5px]" onClick={() => setDateSelected("")}>
                <ArrowLeftIcon className="w-[50px] h-[35px] text-neutral-400" />
            </button>
            <p className="font-poiretOne text-[40px] max-lsm:text-[30px] self-center">Dados</p>
            <Image src={Document} width={70} alt="Documento" className="self-center"/>
            <p className="text-[20px] max-lsm:text-[18px] text-left">Titulo:</p>
            <label className="w-[70%] border-[2px] border-neutral-400 rounded-[6px]">
                <input onChange={(text) => setDataEvent({...dataEvent, title:text.target.value})} required maxLength={30} id={styles.boxFiles} className="w-full outline-none text-[20px] max-lsm:text-[18px] bg-transparent px-[5px]" placeholder="Digite o título"/>
            </label>

            <p className="text-[20px] max-lsm:text-[18px] mt-[10px] text-left">Observação:</p>
            <label className="border-[2px] border-neutral-400 rounded-[6px] px-[1px]">
                <textarea onChange={(text) => setDataEvent({...dataEvent, observation:text.target.value})} required maxLength={200} rows={3} id={styles.boxFiles} className="outline-none w-full text-[20px] max-lsm:text-[18px] bg-transparent px-[2px]" placeholder="Digite a observação"/>
            </label>
            <div className='bg-neutral-200 w-[200px] dark:bg-neutral-200/20 border-[2px] border-neutral-400 dark:border-white rounded-[4px] pt-[3px] mt-[15px]'>
                <div className='flex items-center px-[7px] justify-between' onClick={() => setChangeEnterprise(!changeEnterprise)}>
                    <p className='max-w-[150px] overflow-hidden text-ellipsis' >{dataEvent.enterprise.name}</p>
                    <div className='flex ml-[10px] '>
                        <div className='w-[20px] h-[20px] rounded-full border-neutral-400 dark:border-white p-[2px] border-[2px]'>
                            <div className='bg-neutral-400 dark:bg-white w-full h-full rounded-full'></div>
                        </div>
                        <Image src={Arrow} alt="flecha" className={`cursor-pointer w-[15px] ml-[5px] duration-200 dark:invert ¨${changeEnterprise ? " rotate-180" : ""}`}/>
                    </div>
                </div>

                <div className={`${changeEnterprise ? "" : "hidden"} duration-500`}>
                    {enterprises.map((data, index) =>{
                        if(data.id == dataEvent.enterprise.id) return ""
                        return (
                            <div key={data.id} className="text-left flex mt-[5px] justify-between px-[7px]">
                                <p onClick={() => (setDataEvent({...dataEvent,  enterprise:enterprises[index]}), setChangeEnterprise(false))} className="cursor-pointer w-[100%] max-w-[150px] overflow-hidden text-ellipsis">{data.name}</p>
                                <div onClick={() => (setDataEvent({...dataEvent,  enterprise:enterprises[index]}), setChangeEnterprise(false))} className='cursor-pointer min-w-[20px] h-[20px] rounded-full border-black dark:border-white p-[2px] border-[2px]' />
                            </div>
                        )
                    })}
                </div>
            </div>
            <p className="text-[20px] text-left max-lsm:text-[18px] mt-[10px]"><span className="font-[600]">Nome:</span> {userName}</p>
            <p className="text-[20px] text-left max-lsm:text-[18px] mt-[10px]"><span className="font-[600]">Data Selecionada:</span> {FormatDate(dateSelected)}</p>
            <div className='border-greenV border-[2px] self-center rounded-[4px]  mt-[15px] hover:scale-105'>
                <button type='submit' className="cursor-pointer text-greenV bg-greenV/20  self-center text-[20px] px-[8px] py-[2]">Criar</button>
            </div>
        </form>
    )
}

export default CreateEvent