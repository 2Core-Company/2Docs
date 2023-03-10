import React, { useState } from 'react'
import { Event } from '../../../types/interfaces'
import { FormatDate } from '../Utils/FormatDate'
import styles from '../../Admin/Home/home.module.css'
import ViwedEvent from './viwedEvent'

interface Props {
  eventsSelected:Event[]
  events:Event[]
  admin:boolean
  setEventsSelected:Function
}

function TableEvents({eventsSelected, events, admin, setEventsSelected}:Props) {
  const [eventSelected, setEventSelected] = useState<Event>()
  return (
      <div className='bg-black/20 backdrop-blur-sm absolute z-50 w-screen h-screen flex flex-col justify-center items-center text-left'>
        <div className='max-w-[800px] w-[90%] max-h-[90%] border-b-[2px] border-[2px] border-terciary rounded-[8px] bg-primary px-[4px] py-[5px] relative'>
          {
            eventSelected ? <ViwedEvent eventSelected={eventSelected} admin={admin} setEventSelected={setEventSelected} setEventsSelected={setEventsSelected} eventsSelected={eventsSelected} events={events}/>
          :
            <div id={styles.boxFiles} className='overflow-auto h-full px-[3px]'>
              <div onClick={() => setEventsSelected()} className="cursor-pointer w-[4px] h-[30px] rounded-[4px] bg-neutral-400 rotate-45 after:w-[4px] after:h-[30px] after:block after:bg-neutral-400 after:rounded-[4px] after:cursor-pointer after:rotate-90 absolute right-[35px] top-[15px]"></div>
              <p className='text-[23px] text-center'>Eventos do dia</p>
              <p className='text-[23px] text-center'>{FormatDate(eventsSelected[0].dateSelected)}</p>
              <div className='border-[2px] border-neutral-300 mt-[15px] rounded-[8px]'>
                <div className=' grid grid-cols-4 max-sm:grid-cols-3 gap-4 px-[10px] bg-neutral-300'>
                  <p className='font-[600]'>Cliente</p>
                  <p className='font-[600]'>Empresa</p>
                  <p className='font-[600]'>Titulo</p>
                  <p className='font-[600] max-sm:hidden'>Status</p>
                </div>
                {eventsSelected.map((event, index) => {
                  return (
                    <div key={index} onClick={() => setEventSelected(event)} className='cursor-pointer grid grid-cols-4 max-sm:grid-cols-3 gap-4 px-[10px] py-[8px] border-b-[2px] border-y-neutral-300'>
                      <p className='overflow-hidden text-ellipsis'>{event.userName}</p>
                      <p className='overflow-hidden text-ellipsis'>{event.enterprise.name}</p>
                      <p className='overflow-hidden text-ellipsis'>{event.title}</p>
                      <div className='flex max-sm:hidden'>
                        <p className={`px-[5px] border-[1px] rounded-[4px] text-center text-[15px] ${event.complete ? 'border-greenV bg-greenV/20 text-greenV' : 'border-red bg-red/20 text-red'}`} >{event.complete ? "Completo" : "Incompleto"}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          }
        </div>
      </div>

  )
}

export default TableEvents