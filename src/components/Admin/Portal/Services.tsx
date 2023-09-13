import Icon from '@/lib/LucideIcons'
import LucideIcons from '@/lib/LucideIcons'
import { ModelService } from '@/src/types/services'
import { GearIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import React from 'react'

function Services() {

  const services: Array<ModelService> = [
    {
      id: "asddsasda",
      icon: "line-chart",
      type: "Declaração IRPF",
      description: "Agende sua declaração de imposto de renda de pessoa física.",
      charge: false,
      price: "string",
      qrCodePix: false,
      keyPix: false,
      questions: [
        {
          id: "string",
          question: "string",
          type: "multipleChoice",
          required: true,
          answers: ["zzzz"]
        }
      ]
    },

    {
      id: "asddsasda",
      icon: "line-chart",
      type: "Declaração IRPF",
      description: "Agende sua declaração de imposto de renda de pessoa física.",
      charge: false,
      price: "string",
      qrCodePix: false,
      keyPix: false,
      questions: [
        {
          id: "string",
          question: "string",
          type: "multipleChoice",
          required: true,
          answers: ["zzzz"]
        }
      ]
    },

    {
      id: "asddsasda",
      icon: "line-chart",
      type: "Declaração IRPF",
      description: "Agende sua declaração de imposto de renda de pessoa física.",
      charge: false,
      price: "string",
      qrCodePix: false,
      keyPix: false,
      questions: [
        {
          id: "string",
          question: "string",
          type: "multipleChoice",
          required: true,
          answers: ["zzzz"]
        }
      ]
    },

    {
      id: "asddsasda",
      icon: "line-chart",
      type: "Declaração IRPF",
      description: "Agende sua declaração de imposto de renda de pessoa física.",
      charge: false,
      price: "string",
      qrCodePix: false,
      keyPix: false,
      questions: [
        {
          id: "string",
          question: "string",
          type: "multipleChoice",
          required: true,
          answers: ["zzzz"]
        }
      ]
    },

    {
      id: "asddsasda",
      icon: "line-chart",
      type: "Declaração IRPF",
      description: "Agende sua declaração de imposto de renda de pessoa física.",
      charge: false,
      price: "string",
      qrCodePix: false,
      keyPix: false,
      questions: [
        {
          id: "string",
          question: "string",
          type: "multipleChoice",
          required: true,
          answers: ["zzzz"]
        }
      ]
    },

    {
      id: "asddsasda",
      icon: "line-chart",
      type: "Declaração IRPF",
      description: "Agende sua declaração de imposto de renda de pessoa física.",
      charge: false,
      price: "string",
      qrCodePix: false,
      keyPix: false,
      questions: [
        {
          id: "string",
          question: "string",
          type: "multipleChoice",
          required: true,
          answers: ["zzzz"]
        }
      ]
    },

    {
      id: "asddsasda",
      icon: "line-chart",
      type: "Declaração IRPF",
      description: "Agende sua declaração de imposto de renda de pessoa física.",
      charge: false,
      price: "string",
      qrCodePix: false,
      keyPix: false,
      questions: [
        {
          id: "string",
          question: "string",
          type: "multipleChoice",
          required: true,
          answers: ["zzzz"]
        }
      ]
    },

    {
      id: "asddsasda",
      icon: "line-chart",
      type: "Declaração IRPF",
      description: "Agende sua declaração de imposto de renda de pessoa física.",
      charge: false,
      price: "string",
      qrCodePix: false,
      keyPix: false,
      questions: [
        {
          id: "string",
          question: "string",
          type: "multipleChoice",
          required: true,
          answers: ["zzzz"]
        }
      ]
    },

    {
      id: "asddsasda",
      icon: "line-chart",
      type: "Declaração IRPF asda sd asdasda sdas dasd asd asd ",
      description: "Agende sua declaração de imposto de renda de pessoa física adasd asda sdasd asd asd asd asdas dasd asd asd asd as dad asd ad s adsasda asdasbd absdbas dbasdbad babhsdkl basdblbaldsb basd ad .",
      charge: false,
      price: "string",
      qrCodePix: false,
      keyPix: false,
      questions: [
        {
          id: "string",
          question: "string",
          type: "multipleChoice",
          required: true,
          answers: ["zzzz"]
        }
      ]
    },
  ]


  return (
    <div className='px-[160px] max-2xl:px-[50px] max-xl:px-[20px] max-md:px-[0px] mt-[40px]'>
      <button className='flex items-center text-[#666666] hover:text-black duration-100'>
        <GearIcon width={20} height={20} />
        <p className='font-light ml-[8px] text-[24px] max-sm:text-[20px]'>Configurações de Serviço</p>
      </button>

      <div className='flex items-center max-md:justify-center flex-wrap gap-[50px] max-xl:gap-[20px] max-sm:gap-[10px] mt-[40px] pb-[20px]'>
        {services?.map((service) => {
          return (
            <div key={service.id} className="opacity-[0.5] hover:opacity-[1] duration-200  w-[275px] max-xl:w-[230px] max-sm:w-[200px] max-lsm:w-[160px] h-[327px] max-sm:h-[300px] max-lsm:h-[250px] rounded-md bg-gradient-to-b from-emerald-500 to-emerald-500/30 p-[1px] cursor-pointer ">
              <div className='w-full h-full rounded-md  bg-primary flex flex-col items-center py-[20px] px-[40px] max-xl:px-[30px] max-md:px-[20px] max-sm:py-[20px]'>
                <Icon name={service.icon} className='max-md:w-[35px] max-md:h-[35px] max-lsm:w-[30px] max-lsm:h-[30px]' size={40}/>
                <p className='mt-[15px] text-[24px] max-md:text-[20px] max-lsm:text-[18px] overflow-hidden text-ellipsis line-clamp-3 '>{service.type}</p>
                <p className='text-[14px] max-lsm:text-[12px] mt-[30px] max-md:mt-[20px] max-lsm:mt-[10px] overflow-hidden text-ellipsis line-clamp-5 max-lsm:line-clamp-4'>{service.description}</p>
              </div>
            </div>
          )
        })}


        <div className="opacity-[0.5] hover:opacity-[1] duration-200  w-[275px] max-xl:w-[230px] max-sm:w-[200px] max-lsm:w-[160px] h-[327px] max-sm:h-[300px] max-lsm:h-[250px] rounded-md bg-gradient-to-b from-[#686868] to-[rgba(104,104,104,0.3)] p-[1px] cursor-pointer ">
          <div className='w-full h-full rounded-md  bg-primary flex items-center justify-center'>
            <PlusCircledIcon className='w-[50px] h-[50px] text-[#5A5A5A]' />
          </div>
        </div>

      </div>
    </div>

  )
}

export default Services