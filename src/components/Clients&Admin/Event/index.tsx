'use client'
import { CalendarIcon, FileTextIcon, PersonIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { adminContext } from '../../../app/Context/contextAdmin'
import { companyContext } from '../../../app/Context/contextCompany'
import { userContext } from '../../../app/Context/contextUser'
import { Event } from '../../../types/event'
import { Files } from '../../../types/files'
import { GetEvent } from '../../../Utils/Firebase/Events/GetEvents'
import { getFilesEvent } from '../../../Utils/Firebase/Files/getFiles'
import DataEvent from './dataEvent'
import TableFiles from './tableFiles'
import { Tasks } from './tasks'

function Index({ id_event, nameUser }: { id_event: string, nameUser: string }) {
  const { dataCompany } = useContext(companyContext)
  const { dataUser } = useContext(userContext)
  const { dataAdmin } = useContext(adminContext)
  const [event, setEvent] = useState<Event>()
  const [files, setFiles] = useState<Files[]>([])
  const admin = dataAdmin.id === '' ? false : true
  const router = useRouter()

  useEffect(() => {
    GetThisEvent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function GetThisEvent() {
    const result = await GetEvent({ id_event, id_company: dataCompany.id })
    if (result) {
      setEvent(result)
      GetFilesThisEvent(result)
    } else {
      if (admin) {
        router.replace('/Dashboard/Admin')
      } else {
        router.replace('/Dashboard/Clientes')
      }

    }
  }

  async function GetFilesThisEvent(event: Event) {
    if (event) {
      const result = await getFilesEvent({ id_company: dataCompany.id, id_user: event?.id_user, id_event: event.id })
      setFiles(result)
    }
  }

  function childModalEvent({ event }: { event: Event }) {
    setEvent(event)
  }

  async function childConcluedEvent() {
    if (event) {
      setEvent({ ...event, complete: true })
    }
  }

  return (
    <div>
      <p className='font-poiretOne text-[40px] mt-[40px]'>Evento</p>
      <div className='flex flex-wrap items-center text-[#AAAAAA] text-[18px] max-sm:text-[16px] max-lsm:text-[15px] mt-[5px]'>
        <PersonIcon className='min-w-[17px] min-h-[17px] mr-[5px]' />
        {nameUser === 'undefined' ?
          <Link href={'/Dashboard/Clientes'}>Pessoal</Link>
          :
          <Link href={'/Dashboard/Admin/Clientes'} className='max-w-[100px] truncate'>{nameUser.replaceAll("%20", ' ').replaceAll('%', '@')}</Link>
        }

        <p className='mx-[8px]'>{'>'}</p>

        <div className='flex items-center'>
          <CalendarIcon className='min-w-[17px] min-h-[17px] mr-[5px]' />
          <Link href={`${admin ? `/Dashboard/Admin/Calendario/${event?.id_user}/${event?.userName ? event?.userName : undefined}` : `/Dashboard/Clientes/Calendario/${dataUser?.id}/${undefined}`}`}>
            Calendário
          </Link>
          <p className='mx-[8px]'>{'>'}</p>
        </div>

        {event?.title &&
          <div className='flex items-center'>
            <FileTextIcon className='min-w-[17px] min-h-[17px] mr-[5px]' />
            <p className='max-w-[100px] truncate'>{event?.title}</p>
          </div>
        }
      </div>
      
      <div className='flex flex-col  items-start ml-[20px] max-sm:ml-[10px]'>
        {event && <DataEvent files={files!} event={event} setEvent={setEvent} childModalEvent={childModalEvent} childConcluedEvent={childConcluedEvent} setFiles={setFiles} />}
      </div>

      {!admin && event?.tasks && event.tasks[0] ? <Tasks task={event.tasks} files={files}/> : ''}

      <div className='mb-[10px] ml-[20px] max-sm:ml-[10px]'>
        {event && <TableFiles event={event} files={files} setFiles={setFiles} setEvent={setEvent} />}
      </div>

    </div>
  )
}

export default Index