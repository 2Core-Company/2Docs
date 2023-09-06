'use client'
import { CalendarIcon, MagnifyingGlassIcon, PlusIcon, TriangleDownIcon } from '@radix-ui/react-icons'
import React, { useContext, useEffect, useState } from 'react'
import ModalEvent from '../Calendar/modalEvent'
import Image from 'next/image'
import { GetUsersWithPendencies } from '../../../Utils/Firebase/Users/GetUsers'
import { adminContext } from '../../../app/Context/contextAdmin'
import { DataUser } from '../../../types/users'
import { FilterAlphabetical, FilterNumberPendenciesOfUser } from '../../../Utils/Other/Filters'
import Link from 'next/link'
import { Component } from '../../../Utils/Other/componentRoot'

function EventsActives() {
  const [modalEvent, setModalEvent] = useState(false)
  const { dataAdmin } = useContext(adminContext)
  const [usersWithPendencies, setUsersWithPendencies] = useState<DataUser[]>()
  const [textSearch, setTextSearch] = useState<string>('')
  const [dataPages, setDataPages] = useState({ page: 0, maxPage: 0 })
  const [actionFilter, setActionFilter] = useState<{ alpabetical: 'asc' | 'desc', event: 'asc' | 'desc' }>({ alpabetical: 'asc', event: 'desc' })

  useEffect(() => {
    GetUserPendencies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function GetUserPendencies() {
    const result = await GetUsersWithPendencies({ id_company: dataAdmin.id_company, permission:dataAdmin.permission, admin_id: dataAdmin.id})
    setUsersWithPendencies(result)
    var page = Math.floor(result.length / 10)
    if(page === 0){
      page = 1
    }

    const maxPage = Math.ceil(result.length / 10)
    setDataPages({ page: page, maxPage: maxPage })
  }

  async function FilterName() {
    const result = FilterAlphabetical({ data: usersWithPendencies, action: actionFilter.alpabetical })
    var type
    if (actionFilter.alpabetical === 'asc') {
      type = 'desc'
    } else if (actionFilter.alpabetical === 'desc') {
      type = 'asc'
    }
    setUsersWithPendencies(result)
    setActionFilter({ event: 'desc', alpabetical: type })
  }

  async function FilterEvent() {
    const result = FilterNumberPendenciesOfUser({ data: usersWithPendencies, action: actionFilter.event })
    var type
    if (actionFilter.event === 'asc') {
      type = 'desc'
    } else if (actionFilter.event === 'desc') {
      type = 'asc'
    }
    setUsersWithPendencies(result)
    setActionFilter({ alpabetical: 'asc', event: type })
  }

  async function childModalEvent({event}:{event:Event}){
    const result = await GetUserPendencies()
  }

  return (
    <div>
      <Component.root title={'Eventos ativos'}>
        <div className='w-[500px] max-sm:w-[415px] max-lsm:w-[330px] h-[667px] max-sm:h-[644px] max-lsm:h-[600px] flex flex-col'>
          {modalEvent && <ModalEvent modalEvent={modalEvent} setModalEvent={setModalEvent} action={'create'} childModalEvent={childModalEvent}/>}
          <div className='flex items-center p-[30px] max-sm:p-[20px] max-lsm:p-[10px] text-[20px] max-sm:text-[16px] max-lsm:text-[14px] font-[500]'>
            <p>{usersWithPendencies ? usersWithPendencies.length : 0} <span className='text-[rgba(0,0,0,0.30)]'>Clientes</span></p>

            <label className='flex items-center ml-[20px] max-sm:ml-[10px]'>
              <MagnifyingGlassIcon width={22} height={22} className='max-sm:w-[20px] max-sm:h-[20px]' />
              <input onChange={(text) => setTextSearch(text.target.value)} placeholder='Buscar' className='ml-[10px] max-sm:ml-[5px] max-lsm:ml-[2px]  bg-transparent text-[#AAAAAA] w-[120px] max-sm:w-[110px] max-lsm:w-[70px]' />
            </label>

            <button disabled={dataAdmin.permission < 2} onClick={() => setModalEvent(true)} className='flex items-center gap-x-[5px] max-sm:gap-x-[3px] px-[8px] max-sm:px-[5px] py-[8px] bg-hilight border-[1px] border-[#119E70] rounded-[8px] ml-auto text-white hover:bg-emerald-600 duration-100'>
              <PlusIcon width={21} height={20} className='max-sm:w-[18px] max-sm:h-[17px]' />
              <p className='text-[18px] max-sm:text-[16px] max-lsm:text-[14px] font-[400]'>Novo Evento</p>
            </button>
          </div>

          <div className='grid grid-cols-[240px_100px_90px] max-sm:grid-cols-[180px_100px_124px] max-lsm:grid-cols-[140px_100px_100px] items-center py-[10px] bg-[#DDDDDD] border-t-[1px] border-t-[#B1B1B1] px-[20px]'>
            <button onClick={() => FilterName()} className='hover:opacity-[.65] flex items-center w-full'>
              <p className='text-[18px] max-lsm:text-[16px]'>Nome</p>
              <TriangleDownIcon width={25} height={25} className={`${actionFilter.alpabetical === 'asc' ? '' : 'rotate-180 '} text-[#686868] duration-100`} />
            </button>

            <button onClick={() => FilterEvent()} className='hover:opacity-[.65] flex items-center w-full'>
              <p className='text-[18px] max-lsm:text-[16px]'>Eventos</p>
              <TriangleDownIcon width={25} height={25} className={`${actionFilter.event === 'desc' ? '' : 'rotate-180 '} text-[#686868] duration-100`} />
            </button>
          </div>

          {usersWithPendencies?.filter((user) => user.name.toUpperCase().includes(textSearch.toUpperCase()))[0] ?
            usersWithPendencies.filter((user) => user.name.toUpperCase().includes(textSearch.toUpperCase()))
              .map((user, index) => {
                if ((((dataPages.page - 1) * 8) - 1) < index && index < (dataPages.page * 8)) {
                  return (
                    <div key={user.id} className='max-w-full py-[10px] px-[20px] grid auto-cols-auto grid-cols-[275px_60px_124px] 
                      max-sm:grid-cols-[210px_40px_124px]
                      max-lsm:grid-cols-[170px_30px_100px]
                      items-center  border-b-[1px] border-b-[#D2D2D2]'>
                      <div className='flex items-center gap-x-[15px] max-sm:gap-x-[10px]'>
                        <Image src={user.photo_url} width={35} height={35} alt='Perfil' className='min-w-[35px] max-sm:min-w-[30px] aspect-square bg-black rounded-full' />
                        <p className='text-[20px] max-sm:text-[18px] max-lsm:text-[16px] truncate mr-[40px]'>{user.name}</p>
                      </div>

                      <p className='text-[20px] max-lsm:text-[18px]'>{user.pendencies}</p>

                      <Link href={`/Dashboard/Admin/Calendario/${user.id}/${user.name}`} className='border-[1px] border-[rgba(0,0,0,0.2)] cursor-pointer flex items-center  justify-center py-[5px] text-[rgba(0,0,0,0.5)] bg-[rgba(94,94,94,0.15)] rounded-[6px] gap-x-[10px] max-lsm:gap-x-[3px] hover:bg-[rgba(94,94,94,0.35)] duration-100'>
                        <CalendarIcon width={20} height={20} className='max-lsm:w-[15px] max-lsm:h-[15px]' />
                        <p className='max-lsm:text-[14px]'>Ver mais</p>
                      </Link>
                    </div>
                  )
                }
              })
            :
            <div className='w-full h-full flex flex-col justify-center items-center'>
              <Image src={'/icons/eventsActiveOff.svg'} alt='' width={120} height={164} priority={true} />
              <p className='font-poiretOne text-[28px] max-sm:text-[25px] max-lsm:text-[23px] text-[#686868] text-center'>Todos os eventos completos.</p>
            </div>
          }

          {usersWithPendencies?.filter((user) => user.name.toUpperCase().includes(textSearch.toUpperCase()))[0] ?
            <div className='flex items-center justify-between px-[20px] max-lsm:px-[10px] py-[13px] border-t-[#9E9E9E] border-t-[1px] mt-auto'>
              <button disabled={dataPages.page - 1 > 0 ? false : true} onClick={() => setDataPages({ ...dataPages, page: dataPages.page - 1 })} className={`${dataPages.page - 1 > 0 ? 'text-[#EBEBEB] bg-hilight hover:bg-emerald-600  border-[#00B268]' : 'text-[#AAAAAA]  border-[#9E9E9E] bg-[#D9D9D9]'} border-[1px] rounded-[8px] py-[4px] px-[15px] max-lsm:px-[10px] duration-100`}>
                Anterior
              </button>

              <p className='text-[#686868] text-[18px] max-sm:text-[16px]'>Página {dataPages.page} de {dataPages.maxPage}</p>

              <button disabled={dataPages.page + 1 <= dataPages.maxPage ? false : true} onClick={() => setDataPages({ ...dataPages, page: dataPages.page + 1 })} className={`${dataPages.page + 1 <= dataPages.maxPage ? 'text-[#EBEBEB] bg-hilight hover:bg-emerald-600 border-[#00B268]' : 'text-[#AAAAAA]  border-[#9E9E9E] bg-[#D9D9D9]'} border-[1px] rounded-[8px] py-[4px] px-[15px] max-lsm:px-[10px] duration-100`}>
                Próxima
              </button>
            </div>
            :
            <></>
          }
        </div>
      </Component.root>
    </div>
  )
}

export default EventsActives