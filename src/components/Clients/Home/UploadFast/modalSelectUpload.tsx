import { ArrowLeftIcon } from '@radix-ui/react-icons'
import React, {useState } from 'react'
import Image from 'next/image'
import ModalPathFolder from './modalPathFolder'
import ModalPathEvent from './modalPathEvent'

function ModalSelectPathUpload({ files, setFiles }) {
    const [pathSelected, setPathSelected] = useState<string | undefined>()
    return (
        <div className='min-w-screen w-full h-screen fixed scro flex justify-center items-center text-black dark:text-white z-50 top-[0px] left-[0px] font-[400]'>
            <div onClick={() => setFiles()} className="w-full h-full fixed bg-black/30" />
            <div className='bg-primary dark:bg-dprimary w-[560px] max-sm:w-[350px] rounded-[15px] flex flex-col drop-shadow-[0_5px_5px_rgba(0,0,0,0.40)]'>
                <div className='bg-hilight w-full h-[15px] rounded-t-[15px]' />
                <div className='text-left flex flex-col'>
                    {pathSelected === undefined ?
                        <>
                            <div className='mt-[10px] flex items-center ml-[25px] max-sm:ml-[10px]'>
                                <button>
                                    <ArrowLeftIcon onClick={() => setFiles()} className='text-[#9E9E9E] w-[25px] h-[25px] mr-[10px] cursor-pointer' />
                                </button>
                                <h4 className="font-poppins text-[26px] max-sm:text-[24px] after:w-[40px] after:h-[3px] after:block after:bg-hilight after:rounded-full after:ml-[3px] after:mt-[-3px]">
                                    Upload Rápido
                                </h4>
                            </div>
                            <div className='flex max-sm:flex-col gap-x-[60px] max-sm:gap-[20px] mt-[30px] self-center pb-[30px]'>
                                <button onClick={() => setPathSelected('folder')} className='cursor-pointer bg-primary px-[15px] pb-[30px] drop-shadow-[0_0px_7px_rgba(0,0,0,0.10)] rounded-[15px] flex flex-col items-center hover:bg-[#e6e6e6] duration-100'>
                                    <p className='text-[20px] mt-[10px]'>Para uma pasta</p>
                                    <Image alt='ícone' quality={100} width={160} height={107} src={'/icons/uploadFastSelectFolder.svg'} className='mt-[25px]' />
                                </button>

                                <button onClick={() => setPathSelected('event')} className='cursor-pointer bg-primary px-[15px] pb-[30px] drop-shadow-[0_0px_7px_rgba(0,0,0,0.10)] rounded-[15px] flex flex-col items-center hover:bg-[#e6e6e6] duration-100'>
                                    <p className='text-[20px] mt-[10px]'>Para um evento</p>
                                    <Image alt='ícone' quality={100} width={160} height={107} src={'/icons/uploadFastSelectEvent.svg'} className='mt-[25px]' />
                                </button>
                            </div>
                        </>
                    :
                        pathSelected === 'folder' ?
                            <ModalPathFolder files={files} setFiles={setFiles} setPathSelected={setPathSelected}/>
                            :
                            <ModalPathEvent files={files} setFiles={setFiles} setPathSelected={setPathSelected}/>
                    }
                </div>
            </div>
        </div>
    )
}

export default ModalSelectPathUpload



