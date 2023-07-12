import { ClockIcon } from '@radix-ui/react-icons'
import React from 'react'
import { Event } from '../../../types/event'
import { Component } from '../../../Utils/Other/componentRoot'
import UploadFile from './uploadFiles'
import * as Tooltip from '@radix-ui/react-tooltip';
import { FormatDateToPageEvent } from '../../../Utils/Other/FormatDate'

function DataEvent({ event, setEvent }: { event: Event, setEvent: Function }) {
    const styleTextTitle = `text-[24px]`
    const styleTextContent = `text-[#686868] text-[22px] font-[300] whitespace-pre-line ml-[5px]`
    const data = CalculateStatus(event)
    const disabledUpload = (Number(event.dateEnd) - new Date().getTime()) < 0 &&  event.limitedDelivery ? true : false

    function CalculateStatus(event) {
        const diffInMs = event.dateEnd - new Date().getTime()
        var data = { styleCircle: '', styleDivStatus: '', styleClock: '', text: '' }

        if (event.complete) {
            data = {
                styleCircle: 'bg-[#10B981]',
                styleDivStatus: 'border-[#10B981] text-[#10B981]',
                styleClock: 'text-[#10B981]',
                text: 'Concluído'
            }
        } else if (event.delivered) {
            data = {
                styleCircle: 'bg-[#2E86AB]',
                styleDivStatus: 'border-[#2E86AB] text-[#2E86AB]',
                styleClock: 'text-[#2E86AB]',
                text: 'Entregue'
            }
        } else if (event.dateEnd === null) {
            data = {
                styleCircle: 'bg-[#BB8702]',
                styleDivStatus: 'border-[#BB8702] text-[#BB8702]',
                styleClock: 'text-[#BB8702]',
                text: 'Aberto'
            }
        } else if (diffInMs > 0) {
            data = {
                styleCircle: 'bg-[#BB8702]',
                styleDivStatus: 'border-[#BB8702] text-[#BB8702]',
                styleClock: 'text-[#BB8702]',
                text: 'Aberto'
            }
        } else if (diffInMs < 0) {
            data = {
                styleCircle: 'bg-[#BE0000]',
                styleDivStatus: 'border-[#BE0000] text-[#BE0000]',
                styleClock: 'text-[#BE0000]',
                text: 'Atrasado'
            }
        }
        return data
    }


    return (
        <div className='mt-[30px] max-2xl:w-[740px] max-lg:w-full'>
            <div className='flex items-center 2xl:w-[860px] '>
                <p className='text-zinc-700 font-[200] text-[28px] max-sm:text-[25px] truncate'>{event.title}</p>
                <div className={`ml-[15px] mr-[30px] min-w-[12px] min-h-[12px] rounded-full ${data.styleCircle}`} />
                <Tooltip.Provider>
                    <Tooltip.Root disableHoverableContent={!event.limitedDelivery}>
                        <Tooltip.Trigger asChild className={`${event.limitedDelivery ? '' : 'hidden'}`}>
                            <ClockIcon className={`min-w-[25px] min-h-[25px] ${data.styleClock} ml-auto`} />
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content sideOffset={5} className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none drop-shadow-[0_5px_5px_rgba(0,0,0,0.20)] will-change-[transform,opacity]">
                                <p className='text-center'>Este é um evento com entrega limitada à prazo. <br /> Não será possível entregar após o prazo.</p>
                                <Tooltip.Arrow className="fill-white" />
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider>

            </div>
            <div className='flex flex-wrap gap-x-[30px] gap-y-[20px] w-full'>
                <div className='max-lg:w-full'>
                    <Component.root className='p-[30px] max-sm:p-[20px] max-lg:w-full'>
                        <div className='w-[800px] max-2xl:w-[680px] max-lg:w-full gap-y-[20px] flex flex-col'>
                            <div className='flex items-center'>
                                <p className='text-[24px]'>Status:</p>
                                <div className={`${data.styleDivStatus} border-[1px] px-[8px] py-[2px]  flex items-center justify-center rounded-[10px]  ml-[10px]`}>
                                    <p className='text-[14px]'>{data.text}</p>
                                </div>
                            </div>

                            <div className='flex max-h-[200px] overflow-x-auto'>
                                <p className={styleTextTitle} >
                                    Descrição:
                                    <span className={styleTextContent} >{event.description}</span>
                                </p>

                            </div>

                            <div className='flex'>
                                <p className={styleTextTitle} >
                                    Empresa:
                                    <span className={styleTextContent} >{event.nameEnterprise}</span>
                                </p>
                            </div>

                            <div className='flex'>
                                <p className={styleTextTitle} >
                                    Prazo para entrega:
                                    <span className={styleTextContent} >{`De  ${new Date(event.dateStarted).toLocaleDateString()} ${event.dateEnd ? `Até ${new Date(event.dateEnd).toLocaleDateString()}` : ''}`}</span>
                                </p>
                            </div>

                            <div className='flex'>
                                <p className={styleTextTitle} >
                                    Última modificação:
                                    <span className={styleTextContent} >{event.lastModify ? FormatDateToPageEvent(event.lastModify) : 'Nenhuma modificação realizada.'}</span>
                                </p>
                            </div>

                        </div>
                    </Component.root>
                </div>
                
                <UploadFile uploadDisabled={disabledUpload} id_event={event.id} id_folder={event.id_folder} id_enterprise={event.id_enterprise} event={event} setEvent={setEvent} />
            </div>

        </div>
    )
}

export default DataEvent