'use client'
import { ToastContainer } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import { FileIcon } from '@radix-ui/react-icons';
import DataEvent from '@/src/components/Clients&Admin/Event/dataEvent';
import TableFiles from '@/src/components/Clients&Admin/Event/tableFiles';
import { useContext, useEffect, useState } from 'react';
import { GetEvent } from '@/src/Utils/Firebase/Events/GetEvents';
import { Files } from '@/src/types/files';
import { Event } from '@/src/types/event';
import { getFilesEvent } from '@/src/Utils/Firebase/Files/getFiles';
import { stripe } from '@/lib/stripe'
import { userContext } from '@/src/app/Context/contextUser';
import { companyContext } from '@/src/app/Context/contextCompany';
import { GetUser } from '@/src/Utils/Firebase/Users/GetUsers';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import ModalNotFoundEvent from './modalNotFoundEvent';

function SharedFile({ params }: { params: { id_event: string, id_company: string, id_user: string } }) {
  const [event, setEvent] = useState<Event>()
  const [files, setFiles] = useState<Files[]>([])
  const { id_event, id_company, id_user } = params
  const { dataUser, setDataUser } = useContext(userContext);
  const { dataCompany, setDataCompany } = useContext(companyContext);
  const [onLoad, setOnLoad] = useState(false);
  const [modalNotFoundEvent, setModalNotFoundEvent] = useState(false);


  useEffect(() => {
    GetThisEvent()
    GetPlanStripe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function GetThisEvent() {
    const result = await GetEvent({ id_event: id_event, id_company: id_company })
    if (result) {
      setEvent(result)
      GetFilesThisEvent(result)
    } else {
      setModalNotFoundEvent(true)
    }
  }

  async function GetFilesThisEvent(event: Event) {
    const result = await getFilesEvent({ id_company: id_company, id_user: id_user, id_event: event.id })
    setFiles(result)
  }

  async function GetPlanStripe() {
    const { data } = await stripe.customers.search({
      query: 'metadata[\'id_company\']:\'' + id_company + '\'',
      limit: 1,
      expand: ['data.subscriptions']
    })
      .catch(err => err)

    await Promise.all([
      GetDataUser(),
      GetDataCompanyUser({ id_company: id_company, data })
    ])

    if (!onLoad) {
      setOnLoad(true)
    }

  }

  //Pegando credenciais dos usuários
  async function GetDataUser() {

    const allDataUser = await GetUser({ id_company: id_company, id_user: id_user })

    if (allDataUser?.id) {
      setDataUser(allDataUser)
    } else {
      setModalNotFoundEvent(true)
    }
  }

  async function GetDataCompanyUser({ id_company, data }) {
    const maxSize = await SearchCostumer({ data })
    const docRef = doc(db, "companies", id_company);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setDataCompany({
        id: docSnap?.data().id,
        name: docSnap.data().name,
        contact: docSnap.data().contact,
        questions: docSnap.data().questions,
        maxSize: maxSize,
        domain:docSnap.data().domain
      })
    } else {
      setModalNotFoundEvent(true)
    }
  }

  async function SearchCostumer({ data }) {
    const id = data[0]?.subscriptions.data[0]?.plan.id

    if (id == 'price_1MX5uXBC8E6EzctJ1TMCPSoE') {
      return 21474836480
    } else if (id == 'price_1MX5uXBC8E6EzctJ1qaXp8ho') {
      return 21474836480
    } else if (id == 'price_1MX5u3BC8E6EzctJlS8NCOJF') {
      return 10737418240
    } else if (id == 'price_1MX5u3BC8E6EzctJLblqdVuF') {
      return 10737418240
    } else if (id == 'price_1MX5tXBC8E6EzctJCEiUGV4h') {
      return 5368709120
    } else {
      return 5368709120
    }
  }


  return (
    <section className='px-[60px] max-sm:px-[10px] pt-[20px]'>
      {modalNotFoundEvent && <ModalNotFoundEvent />}
      <ToastContainer autoClose={3000} />
      <Link href='https://www.2docs.app/' target='_blank' className='flex gap-[18px] items-center justify-start mb-[60px] select-none w-fit'>
        <Image alt='Logo da empresa 2Docs' src={'/image/Logo2CorePretoSemFundo.svg'} width={64} height={64} priority/>
        <div className='h-[41px] w-[2px] bg-black'></div>
        <p className='text-[32px]'>2Docs</p>
      </Link>

      <div className='flex items-center gap-[8px] mb-[16px] flex-wrap'>
        <p className='text-[#686868] whitespace-nowrap'>{'Compartilhamento >'}</p>
        <div className='flex gap-1'>
          <FileIcon width={20} height={20} className='text-[#686868]' />
          {event && <p className='text-[#9E9E9E]'>{event.title}</p>}
        </div>
      </div>

      <p className='font-poiretOne text-[40px] max-lg:text-[35px] max-sm:text-[30px]'>Compartilhamento de Evento</p>
      {event && dataUser?.id && dataCompany?.id ?
        <>
          <div className='flex flex-col  items-start ml-[20px] max-sm:ml-[10px]'>
            {event && <DataEvent files={files!} event={event} setEvent={setEvent} setFiles={setFiles} />}
          </div>

          <div className='mb-[10px] ml-[20px] max-sm:ml-[10px]'>
            {event && <TableFiles event={event} files={files} setFiles={setFiles} setEvent={setEvent} />}
          </div>
        </>

        :

        <div className='w-full h-full flex justify-center mt-[100px]'>
          <svg className="h-[50px] w-[50px] animate-spin text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" style={{ strokeWidth: 4 }} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      }
    </section>

  )
}

export default SharedFile;