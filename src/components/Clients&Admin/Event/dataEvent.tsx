import { ClockIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import React, { useContext } from 'react'
import { Event } from '../../../types/event'
import { Component } from '../../../Utils/Other/componentRoot'
import UploadFile from './uploadFiles'
import * as Tooltip from '@radix-ui/react-tooltip';
import { FormatDateSmall, FormatDateToPageEvent } from '../../../Utils/Other/FormatDate'
import { adminContext } from '../../../app/Context/contextAdmin'
import OptionsEvent from './optionsEvent'
import { Files } from '../../../types/files'

interface Props {
    files: Files[]
    event: Event
    setEvent: Function
    childModalEvent?: Function
    childConcluedEvent?: Function
    setFiles: React.Dispatch<React.SetStateAction<Files[]>>
}

function DataEvent({ files, event, setEvent, childModalEvent, childConcluedEvent, setFiles }: Props) {
    const { dataAdmin } = useContext(adminContext)
    const styleTextTitle = `text-[24px] max-lg:text-[22px] max-md:text-[20px] max-sm:text-[18px] max-lsm:text-[16px]`
    const styleTextContent = `text-[#686868] text-[22px] max-lg:text-[20px] max-md:text-[18px] max-sm:text-[16px] max-lsm:text-[14px] font-[300] whitespace-pre-line ml-[5px]`
    const data = CalculateStatus(event)
    const disabledUpload = (Number(event.dateEnd) - new Date().getTime()) < 0 && event.limitedDelivery ? true : false || event.complete
    const admin = dataAdmin.id === '' ? false : true
    const messageDisabled = disabledUpload && event.complete ? 'Este evento não pode receber arquivos pois já esta concluido.' : 'Este evento não pode receber arquivos após a data de vencimento.'


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
        <div className='mt-[30px] w-full'>
            <div className='flex gap-x-[30px] gap-y-[20px] w-full max-xl:flex-wrap'>
                <div className='w-full'>
                    <div className='flex items-center'>
                        <p className='text-zinc-700 font-[200] text-[28px] max-sm:text-[25px] truncate'>{event.title}</p>
                        <div className={`ml-[15px] mr-[30px] min-w-[12px] min-h-[12px] rounded-full ${data.styleCircle}`} />
                        <div className='flex items-center ml-auto'>
                            <Tooltip.Provider >
                                <Tooltip.Root disableHoverableContent={!event.limitedDelivery}>
                                    <Tooltip.Trigger asChild className={`${event.limitedDelivery ? '' : 'hidden'}`}>
                                        <ClockIcon className={`min-w-[25px] min-h-[25px] ${data.styleClock}`} />
                                    </Tooltip.Trigger>
                                    <Tooltip.Portal>
                                        <Tooltip.Content sideOffset={5} className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none drop-shadow-[0_5px_5px_rgba(0,0,0,0.20)] will-change-[transform,opacity]">
                                            <p className='text-center'>Este é um evento com entrega limitada à prazo. <br /> Não será possível entregar após o prazo.</p>
                                            <Tooltip.Arrow className="fill-white" />
                                        </Tooltip.Content>
                                    </Tooltip.Portal>
                                </Tooltip.Root>
                            </Tooltip.Provider>
                            {admin && childModalEvent && childConcluedEvent &&
                                <div className='ml-[5px]'>
                                    <OptionsEvent files={files} event={event} childModalEvent={childModalEvent} childConcluedEvent={childConcluedEvent} />
                                </div>
                            }
                        </div>
                    </div>

                    <Component.root className='p-[30px] max-sm:p-[20px] w-full'>
                        <div className='w-[800px] max-2xl:w-[680px] max-lg:w-full gap-y-[20px] flex flex-col'>
                            <div className='flex items-center'>
                                <p className={styleTextTitle}>Status:</p>
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
                                    <span className={styleTextContent} >{`${event.dateEnd ? 'De ' : ''}${FormatDateSmall(event.dateStarted)} ${event.dateEnd ? `Até ${FormatDateSmall(event.dateEnd)}` : ''}`}</span>
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



                {!admin && new Date().getTime() >= event.dateStarted &&
                    <UploadFile uploadDisabled={disabledUpload} messageDisabled={messageDisabled} id_event={event.id} id_folder={event.id_folder} id_enterprise={event.id_enterprise} event={event} setEvent={setEvent} setFiles={setFiles} files={files}/>}
            </div>
            {!admin && <div className='flex items-center justify-center gap-x-[5px] max-md:gap-x-[0px] text-[#21627e] bg-[rgba(46,134,171,0.2)] border-[1px] border-[#21627e] py-[8px] px-[10px] text-center mt-[25px] rounded-[4px]'>
                <InfoCircledIcon className='min-w-[25px] min-h-[25px]' />
                Você só poderá fazer upload neste evento a partir do dia {FormatDateSmall(event.dateStarted)}
            </div>}
        </div>
    )
}

export default DataEvent