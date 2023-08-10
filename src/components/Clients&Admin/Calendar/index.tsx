'use client'
import { CalendarIcon, PersonIcon } from '@radix-ui/react-icons'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { GetEventsInOneMonth } from '../../../Utils/Firebase/Events/GetEvents'
import MiniCalendar from './miniCalendar'
import { Event } from '../../../types/event'
import ShowEvents from '../../Clients&Admin/Calendar/showEvents'
import { FormatDate } from '../../../Utils/Other/FormatDate'
import { companyContext } from '../../../app/Context/contextCompany'
import Link from 'next/link'
import { adminContext } from '@/src/app/Context/contextAdmin'

function Index({ id_user, nameUser }: { id_user: string, nameUser: string }) {
  const { dataCompany } = useContext(companyContext)
  const { dataAdmin } = useContext(adminContext)
  const [ eventsInDateSelected, setEventsInDateSelected] = useState<Event[]>([])
  const [dataMonth, setDataMonth] = useState({ firstDay: moment().clone().startOf("month").valueOf(), lastDay: moment().clone().endOf("month").valueOf() })
  const [events, setEvents] = useState<Event[]>([])
  const [dateSelected, setDateSelected] = useState<number>(new Date().setHours(0,0,0,0))
  const admin = dataAdmin.id === '' ? false : true
  
  useEffect(() => {
    GetEventsInMonthSelected()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataMonth])

  async function GetEventsInMonthSelected() {
    const result = await GetEventsInOneMonth({ id_company: dataCompany.id, id_user, dateMin: dataMonth.firstDay, dateMax: dataMonth.lastDay })
    const day = new Date(dateSelected).getTime()
    if (result) {
      setEvents(result)
      setEventsInDateSelected(result.filter((date) => date.dateStarted === day))
    }
  }

  function AfterSelectDate(date){
    const day = new Date(date).getTime()
    setEventsInDateSelected(events.filter((date) => date.dateStarted === day))
    setDateSelected(day)
  }

  return (
    <div className="bg-primary dark:bg-dprimary text-black dark:text-white">
      <p className='font-poiretOne text-[40px] mt-[40px]'>Calendário</p>
      <div className='flex items-center text-[#AAAAAA] text-[18px] max-sm:text-[16px] mt-[5px]'>
        <PersonIcon className='min-w-[17px] min-h-[17px] mr-[5px]' />
        {admin ? 
          <Link href={'/Dashboard/Admin/Clientes'}>{nameUser.replaceAll("%20", ' ').replaceAll('%', '@')}</Link>
        :
          <Link href={'/Dashboard/Clientes'}>Pessoal</Link>
        }

        <p className='mx-[8px]'>{'>'}</p>

        <CalendarIcon className='min-w-[17px] min-h-[17px] mr-[5px]' />
        <p>Calendário</p>
      </div>
      <p className='text-zinc-700 font-[200] text-[28px] max-sm:text-[25px] mt-[30px] ml-[20px] max-sm:ml-[10px]'>Eventos - {FormatDate(dateSelected)}</p>
      <div className='flex items-start gap-x-[150px] gap-y-[30px] flex-wrap mt-[20px] mb-[10px] ml-[20px] max-sm:ml-[10px]'>
        <MiniCalendar setDataMonth={setDataMonth} events={events} AfterSelectDate={AfterSelectDate}/>
        <ShowEvents events={eventsInDateSelected} from={'calendar'} nameUser={nameUser} />
      </div>
    </div>
  )
}

export default Index