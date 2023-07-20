import { ChevronRightIcon } from '@radix-ui/react-icons'
import React, { useContext } from 'react'
import Image from 'next/image'
import imageEventDashboard from '../../../../public/icons/imageEventDashboard.svg'
import { FormatDateVerySmall } from '../../../Utils/Other/FormatDate'
import { Event } from '../../../types/event'
import { Component } from '../../../Utils/Other/componentRoot'
import Link from 'next/link'
import { adminContext } from '../../../app/Context/contextAdmin'

interface Props {
    events: Event[]
    from: 'dashboard' | 'calendar'
    nameUser?:string
    id_user?:string
}

function ShowEvents({events, from, nameUser, id_user}: Props) {
    const { dataAdmin } = useContext(adminContext)
    const admin = dataAdmin.id === '' ? false : true

    function CalculateStatus(event) {
        const diffInMs = event.dateEnd - new Date().getTime()
        var data = { styleCircle: '', styleDiv: '', styleDivStatus: '', styleText: '', text: '' }

        if (event.complete) {
            data = {
                styleCircle: 'bg-[#10B981]',
                styleDiv: 'text-[#767676]',
                styleDivStatus: 'border-[#10B981] text-[#10B981]',
                styleText: 'line-through',
                text: 'Concluído'
            }
        } else if (event.delivered) {
            data = {
                styleCircle: 'bg-[#2E86AB]',
                styleDiv: 'text-[#000]',
                styleDivStatus: 'border-[#2E86AB] text-[#2E86AB]',
                styleText: '',
                text: 'Entregue'
            }

        } else if (event.dateEnd === null) {
            data = {
                styleCircle: 'bg-[#BB8702]',
                styleDiv: 'text-[#000]',
                styleDivStatus: 'border-[#BB8702] text-[#BB8702]',
                styleText: '',
                text: 'Aberto'
            }
        } else if (diffInMs > 0) {
            data = {
                styleCircle: 'bg-[#BB8702]',
                styleDiv: 'text-[#000]',
                styleDivStatus: 'border-[#BB8702] text-[#BB8702]',
                styleText: '',
                text: 'Aberto'
            }
        } else if (diffInMs < 0) {
            data = {
                styleCircle: 'bg-[#BE0000]',
                styleDiv: 'text-[#000]',
                styleDivStatus: 'border-[#BE0000] text-[#BE0000]',
                styleText: '',
                text: 'Atrasado'
            }
        }
        return data
    }

    return (
        <Component.root className='p-[30px] max-sm:p-[20px]'>
            <div className='flex overflow-y-auto flex-col gap-y-[19px] bg-primary rounded-[12px] w-[500px] max-sm:w-[370px] max-lsm:w-[290px] min-h-[580px] '>
                {events[0] ?
                    <>
                        {events.map((event, index) => {
                            const data = CalculateStatus(event)
                            return (
                                <Link href={`${admin ? `/Dashboard/Admin/Evento/${event.id}/${nameUser}` : `/Dashboard/Clientes/Evento/${event.id}/${undefined}`}`} key={event.id} className={`${index === 0 ? 'max-sm:rounded-t-[12px]' : ''} flex items-center group cursor-pointer `}>
                                    <div className='flex items-start'>
                                        <div className={`${data.styleCircle} w-[12px] h-[12px] rounded-full mt-[10px]`} />
                                        <div className={`${data.styleDiv} `}>
                                            <p className={`${data.styleText} text-[20px] max-sm:text-[18px] text-ellipsis overflow-hidden max-w-[400px] max-sm:max-w-[300px] max-lsm:max-w-[250px] whitespace-nowrap ml-[15px] max-sm:ml-[10px] max-lsm:ml-[5px]`}>
                                                {event.title}
                                            </p>
                                            <div className=' inline-flex items-center ml-[15px] max-sm:ml-[10px] max-lsm:ml-[0px]'>
                                                <p className='max-sm:text-[14px] max0lsm:text-[12px]'>Status:</p>
                                                <div className={`${data.styleDivStatus} border-[1px] rounded-full px-[6px] max-lsm:px-[3px] py-[1px] ml-[5px]`}>
                                                    <p className='text-[14px] max-sm:text-[12px]'>
                                                        {data.text}
                                                    </p>
                                                </div>

                                                {event.dateEnd && <p className='ml-[20px] max-lsm:ml-[10px] max-sm:text-[14px]'>Data Venc.: <span className='text-[14px] max-sm:text-[12px]'>{FormatDateVerySmall(event.dateEnd)}</span></p>}
                                            </div>
                                        </div>
                                    </div>
                                    < ChevronRightIcon className='absolute min-w-[30px] min-h-[30px] max-sm:min-w-[25px] max-sm:min-h-[25px] right-[25px] max-sm:right-[15px] lg:group-hover:right-[0px] duration-200' />
                                </Link>
                            )
                        })}

                        {from === 'dashboard' &&
                            <Link href={`/Dashboard/Clientes/Calendario/${id_user}/${undefined}`} className='mt-auto w-full text-end text-[18px] max-sm:text-[16px] text-hilight hover:brightness-[.85] duration-100' >
                                {'Ver mais eventos >'}
                            </Link>
                        }

                    </>
                    :
                    <div className='w-full h-[600px] items-center justify-center flex flex-col'>
                        <p className='font-poiretOne text-[28px] max-sm:text-[25px] max-lsm:text-[23px] text-[#686868] text-center'>Nenhum evento agendado...</p>
                        <Image alt={''} quality={100} priority={true} width={322} height={300} className='max-sm:w-[300px] h-auto max-lsm:w-[270px] mt-[25px]' src={imageEventDashboard} />
                    </div>
                }
            </div>
        </Component.root>
    )
}

export default ShowEvents