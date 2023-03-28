import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../firebase'
import { DataUser, Event } from '../../../types/interfaces'
import styles from './home.module.css'
import NotificationIcon from '../../../../public/icons/notification.svg'
import Image from 'next/image'
import { FormatDateSmall } from '../../../Utils/Other/FormatDate'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import ViwedEvent from '../../Clients&Admin/Calendar/viwedEvent'
interface Props{
    dataUser:DataUser
}

function Notification({dataUser}:Props) {
    const [events, setEvets] = useState<Event[]>([])
    const [tableNotification, setTableNotification] = useState(false)
    const [notification, setNotification] = useState(false)
    const [eventSelected, setEventSelected] = useState<Event>()

    useEffect(() => {
        if(dataUser){
            GetEvents()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[dataUser])

    async function GetEvents(){
        var q = query(collection(db, "companies", dataUser.id_company, "events"), where('id_user', '==', dataUser.id), where('viwed', '==', false));
        const allEvents = []
    
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            allEvents.push({
                id:doc.data().id, 
                id_user:doc.data().id_user, 
                userName:doc.data().userName,
                enterprise:doc.data().enterprise,
                title:doc.data().title,
                observation:doc.data().observation,
                complete:doc.data().complete,
                dateSelected:doc.data().dateSelected,
                viwed:doc.data().viwed
            })
        });
        VerifyNotificationEvent(allEvents)
        setEvets(allEvents) 
    }

    function VerifyNotificationEvent(allEvents){
        if(allEvents.findIndex((event) => event.viwed === false) != -1){
            setNotification(true)
        } else {
            setNotification(false)
        }
    }

  return (
    <>
        {events.length > 0 ? 
            <div>
                {eventSelected ? <ViwedEvent VerifyNotificationEvent={VerifyNotificationEvent} elementFather={'home'} eventSelected={eventSelected}  events={events} admin={false} setEventSelected={setEventSelected}/> : <></>}
                <div onClick={() => setTableNotification(!tableNotification)} className='cursor-pointer w-[50px] h-[50px] bg-[#cbe8f2] rounded-full justify-center items-center flex relative'>
                    {tableNotification ? 
                        <div className='h-[3px] w-[25px] bg-black rotate-45 rounded-[8px] after:h-[3px] after:w-[25px] after:bg-black after:rotate-90 after:rounded-[8px] after:block '/>
                    : 
                        <>
                            <div className={`${notification ? '' : 'hidden'} animate-[ping_1.3s_ease-in-out_infinite] bg-[#48c3f0] w-[70%] h-[70%] absolute rounded-full`}/>
                            <Image alt='Sino de notificação' src={NotificationIcon} width={30} height={30} className='z-20' />
                        </>
                    }
                </div>

                {tableNotification ?
                    <div id={styles.boxFiles} className='w-[350px] max-h-[180px] px-[5px] overflow-auto'>
                        <p className='font-poiretOne text-[25px]'>Eventos Não Visuzalidos</p>
                        <div   className='border-[2px] border-neutral-400 rounded-[8px]'>
                            <div className='w-full grid grid-cols-5 gap-4 bg-neutral-300  rounded-t-[8px] px-[3px]'>
                            <p className='font-[600] col-span-2'>Titúlo</p>
                            <p className='font-[600] col-span-2'>Data</p>
                            <p className='font-[600]'>Status</p>
                        </div>
                            {events?.map((event, index) => {
                                return(
                                    <div onClick={() => setEventSelected(event)} className="cursor-pointer font-[600] mt-[5px] grid grid-cols-5 gap-4 px-[3px] pb-[3px]" key={index}>
                                        <p className='col-span-2 text-ellipsis overflow-hidden'>{event.title}</p>
                                        <p className='col-span-2'>{FormatDateSmall(event.dateSelected)}</p>
                                        <div className={`justify-self-center flex justify-center items-center w-[35px] rounded-[16px] ${event.viwed ? 'bg-[#a9e7bd]' : 'bg-[#ea4747]'}`}>
                                            {event.viwed ?
                                                <EyeOpenIcon height={25} width={25}  />   
                                            :
                                                <EyeClosedIcon height={25} width={25} />
                                            }
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    : 
                    <></>
                }
            </div>
        
        : <></>}
     </>

  )
}

export default Notification