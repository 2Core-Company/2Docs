import { ClockIcon } from '@radix-ui/react-icons'
import React from 'react'
import { Event } from '../../../types/event'
import { Component } from '../../../Utils/Other/componentRoot'
import UploadFile from './uploadFiles'

function DataEvent({event}:{event:Event}) {
    const styleTextTitle = `text-[24px]`
    const styleTextContent = `text-[#686868] text-[24px] front-[300] whitespace-pre-line ml-[5px]`

  return (
    <div className='mt-[30px]'>
        <div className='flex items-center w-[860px]'>
            <p className='text-zinc-700 font-[200] text-[28px] max-sm:text-[25px]'>{event.title}</p>
            <div className={`ml-[15px] w-[12px] h-[12px] rounded-full bg-hilight`}/>
            <ClockIcon width={25} height={25} className='text-hilight ml-auto'/>
        </div>
        <div className='flex flex-wrap gap-x-[50px]'>
        <Component.root className='p-[30px] max-sm:p-[20px]'>
            <div className='w-[800px] gap-y-[20px] flex flex-col'>
                <div className='flex items-center'>
                    <p className='text-[24px]'>Status:</p>
                    <div className={`border-[1px] border-hilight text-hilight px-[8px] py-[2px]  flex items-center justify-center rounded-[10px]  ml-[10px]`}>
                        <p className='text-[14px]'>Concluído</p>
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
                        <span className={styleTextContent} >{event.lastModify ? event.lastModify : 'Nenhuma modificação realizada.'}</span>
                    </p>
                </div>

            </div>
        </Component.root>
        <UploadFile id_event={event.id}id_folder={event.id_folder} id_enterprise={event.id_enterprise} />
        </div>

    </div>
  )
}

export default DataEvent