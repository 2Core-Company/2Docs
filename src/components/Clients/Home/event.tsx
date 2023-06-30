import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../../app/Context/contextUser'
import { GetLimitedEventsUser } from '../../../Utils/Firebase/Events/GetEvents'
import { Event } from '../../../types/event'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { FormatDateVerySmall } from '../../../Utils/Other/FormatDate'
import imageEventDashboard from '../../../../public/icons/imageEventDashboard.svg'
import Image from 'next/image'

function Events() {
    const { dataUser } = useContext(userContext)
    const [events, setEvents] = useState<Event[]>()
    useEffect(() => {
        GetEvents()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function GetEvents() {
        await GetLimitedEventsUser({ id_company: dataUser.id_company, id_user: dataUser.id, setEvents })
    }

    function CalculateStatus(event) {
        const diffInMs = new Date().getTime() - new Date(event.dateSelected).getTime()
        var data = { styleCircle: '', styleDiv: '', styleDivStatus: '', styleText: '', text: '' }

        if (event.complete) {
            data = {
                styleCircle: 'bg-[#10B981]',
                styleDiv: 'text-[#767676]',
                styleDivStatus: 'border-[#10B981] text-[#10B981]',
                styleText: 'line-through',
                text: 'Concluído'
            }
        } else if (diffInMs < 0) {
            data = {
                styleCircle: 'bg-[#BB8702]',
                styleDiv: 'text-[#000]',
                styleDivStatus: 'border-[#BB8702] text-[#BB8702]',
                styleText: '',
                text: 'Em aberto'
            }
        } else if (diffInMs > 0) {
            data = {
                styleCircle: 'bg-[#BE0000]',
                styleDiv: 'text-[#000]',
                styleDivStatus: 'border-[#BE0000] text-[#BE0000]',
                styleText: '',
                text: 'Em atraso'
            }
        }
        return data
    }

    return (
        <div className='mt-[20px] max-sm:mt-[10px] '>
            <p className='font-poiretOne text-[40px] max-sm:text-[30px]'>Eventos</p>
            <div className='flex flex-col gap-y-[19px] bg-primary border-[1px] border-[#9E9E9E] pb-[15px] pt-[10px] rounded-[12px]  w-[500px] max-sm:w-[390px] max-lsm:w-[340px] h-[660px] max-sm:h-[600px] drop-shadow-[0_5px_5px_rgba(0,0,0,0.20)]'>
                {events ?
                    <>
                        {events.map((event, index) => {
                            const data = CalculateStatus(event)
                            return (
                                <div key={event.id} className={`${index === 0 ? 'mt-[10px] max-sm:mt-[0px] max-sm:rounded-t-[12px]' : ''} flex items-center group cursor-pointer  px-[30px] max-sm:px-[20px] max-lsm:px-[15px]`}>
                                    <div className='flex items-start'>
                                        <div className={`${data.styleCircle} w-[12px] h-[12px] rounded-full mt-[10px]`} />
                                        <div className={`${data.styleDiv} ml-[15px] max-sm:ml-[10px]`}>
                                            <p className={`${data.styleText} text-[20px] max-sm:text-[18px] text-ellipsis overflow-hidden max-w-[400px] max-sm:max-w-[300px] max-lsm:max-w-[250px] whitespace-nowrap`}>
                                                {event.title}
                                            </p>
                                            <div className='flex items-center'>
                                                <p className='max-sm:text-[14px]'>Status:</p>
                                                <div className={`${data.styleDivStatus} border-[1px] rounded-full px-[6px] py-[1px] ml-[5px]`}>
                                                    <p className='text-[14px] max-sm:text-[12px]'>
                                                        {data.text}
                                                    </p>
                                                </div>

                                                <p className='ml-[20px] max-lsm:ml-[10px] max-sm:text-[14px]'>Data Venc.: <span className='text-[14px] max-sm:text-[12px]'>{FormatDateVerySmall(event.dateSelected)}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    < ChevronRightIcon className='min-w-[30px] min-h-[30px] max-sm:min-w-[25px] max-sm:min-h-[25px] ml-auto lg:group-hover:mr-[-25px] duration-200' />
                                </div>
                            )
                        })}
                        <button className='w-full mt-[10px] text-end text-[18px] max-sm:text-[16px] text-hilight px-[28px] max-sm:px-[22px] max-lsm:px-[18px] hover:brightness-[.85] duration-100' >
                            {'Ver mais eventos >'}
                        </button>
                    </>
                :
                    <div className='w-full h-full items-center justify-center flex flex-col'>
                        <p className='text-[26px] max-sm:text-[23px] max-lsm:text-[21px] text-[#868686] text-center'>Nenhum evento agendado...</p>
                        <Image alt={''} quality={100} priority={true} width={322} height={300} className='max-sm:w-[300px] h-auto max-lsm:w-[270px] mt-[25px]' src={imageEventDashboard} />
                    </div>
                }


            </div>
        </div>
    )
}

export default Events