'use client'
import { CalendarIcon, FileTextIcon, PersonIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { adminContext } from '../../../app/Context/contextAdmin'
import { companyContext } from '../../../app/Context/contextCompany'
import { userContext } from '../../../app/Context/contextUser'
import { Event } from '../../../types/event'
import { GetEvent } from '../../../Utils/Firebase/Events/GetEvents'
import DataEvent from './dataEvent'

function Index({ id_event, nameUser }: { id_event: string, nameUser: string }) {
  const { dataCompany } = useContext(companyContext)
  const { dataUser } = useContext(userContext)
  const { dataAdmin } = useContext(adminContext)
  const [event, setEvent] = useState<Event>()
  const admin = dataAdmin.id === '' ? false : true

  useEffect(() => {
    GetThisEvent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function GetThisEvent() {
    const result = await GetEvent({ id_event, id_company: dataCompany.id })
    setEvent(result)
  }

  return (
    <div>
      <p className='font-poiretOne text-[40px] mt-[40px]'>Evento</p>
      <div className='flex items-center text-[#AAAAAA] text-[18px] mt-[5px]'>
        <PersonIcon width={17} height={17} className='mr-[5px]' />
        {nameUser === 'undefined' ?
          <Link href={'/Dashboard/Clientes'}>Pessoal</Link>
          :
          <Link href={'/Dashboard/Admin/Clientes'} className='max-w-[100px] truncate'>{nameUser}</Link>
        }

        <p className='mx-[8px]'>{'>'}</p>

        <CalendarIcon width={17} height={17} className='mr-[5px]' />
        <Link href={`${admin ? `/Dashboard/Admin/Calendario/${event?.id_user}/${event?.userName}` : `/Dashboard/Clientes/Calendario/${dataUser?.id}/${undefined}`}`}>
          Calendário
        </Link>


        {event?.title &&
          <>
            <p className='mx-[8px]'>{'>'}</p>
            <FileTextIcon width={17} height={17} className='mr-[5px]' />
            <p className='max-w-[100px] truncate'>{event?.title}</p>
          </>
        }
      </div>
      <div className='flex flex-col  items-start ml-[20px] max-sm:ml-[10px]'>
        {event && <DataEvent event={event} setEvent={setEvent} />}
      </div>
    </div>
  )
}

export default Index