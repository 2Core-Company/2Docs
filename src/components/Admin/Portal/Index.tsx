'use client'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CalendarIcon, Component1Icon, HamburgerMenuIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import React, { useState } from 'react'
import Services from './Services'

function Index() {
    const [windowns, setWindowns] = useState({ services: true, notes: false, documentGenerator: false, blog: false })

    const handleOnClickWindow = (windown: string) => {
        switch (true) {
            case windown === "services" && !windowns.services:
                setWindowns({ services: true, notes: false, documentGenerator: false, blog: false })
                break

            case  windown === "notes" && !windowns.notes:
                setWindowns({ services: false, notes: true, documentGenerator: false, blog: false })
                break

            case windown === "documentGenerator" && !windowns.documentGenerator:
                setWindowns({ services: false, notes: false, documentGenerator: true, blog: false })
                break

            case windown === "blog" && !windowns.blog:
                setWindowns({ services: false, notes: false, documentGenerator: false, blog: true })
                break
        }
    }
    return (
        <section>
            <p className="font-poiretOne text-[40px] max-sm:text-[35px] dark:text-white mt-[40px]">Portal do Contador</p>
            <div className='flex items-center overflow-hidden mb-[35px] mt-[15px]'>
                <div className="flex items-center">
                    <Component1Icon height={25} width={25} className='text-secondary' />
                    <p className="text-[18px] flex mr-[5px] max-sm:mr-[0px] max-sm:text-[16px] whitespace-nowrap text-secondary dark:text-dsecondary">
                        {"Portal do contador >"}
                    </p>
                </div>

                <div className="flex items-center">
                    <CalendarIcon className={'min-w-[19px] min-h-[19px] text-secondary'} />
                    <p className='text-[18px] flex mx-[5px] text-secondary dark:text-dsecondary max-sm:text-[16px] whitespace-nowrap'>Serviços</p>
                </div>
            </div>

            <div className='text-[24px] flex items-center justify-between'>
                <div className='gap-x-[30px] max-xl:gap-[20px] flex items-center max-xl:text-[21px] max-lg:hidden'>
                    <button onClick={() => handleOnClickWindow("services")} className={`${windowns.services ? 'w-fit relative text-emerald-500  after:w-full after:h-[3px] after:bg-emerald-500 after:absolute after:left-0 after:bottom-0' : 'hover:text-black text-black/40'}`}>
                        Serviços
                    </button>

                    <button onClick={() => handleOnClickWindow("notes")} className={`${windowns.notes ? 'w-fit relative text-emerald-500  after:w-full after:h-[3px] after:bg-emerald-500 after:absolute after:left-0 after:bottom-0' : 'hover:text-black text-black/40'}`}>
                        Notas Fiscais
                    </button>

                    <button onClick={() => handleOnClickWindow("documentGenerator")} className={`${windowns.documentGenerator ? 'w-fit relative text-emerald-500  after:w-full after:h-[3px] after:bg-emerald-500 after:absolute after:left-0 after:bottom-0' : 'hover:text-black text-black/40'}`}>
                        Gerador de Documentos
                    </button>

                    <button onClick={() => handleOnClickWindow("blog")} className={`${windowns.blog ? 'w-fit relative text-emerald-500  after:w-full after:h-[3px] after:bg-emerald-500 after:absolute after:left-0 after:bottom-0' : 'hover:text-black text-black/40'}`}>
                        Blog
                    </button>
                </div>


                <Link href={""} className='max-xl:text-[21px] max-lsm:text-[20px] hover:text-emerald-600 duration-100 text-emerald-500 cursor-pointer font-light'>
                    {"Solicitações >"}
                </Link>


                <div className='lg:hidden'>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <HamburgerMenuIcon width={25} height={25} />
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content align='end' className='py-[5px] px-[8px] drop-shadow-[0_5px_5px_rgba(0,0,0,0.30)] bg-primary rounded-md flex flex-col gap-y-[5px]'>

                                <DropdownMenu.Item className='hover:outline-none cursor-pointer' onClick={() => handleOnClickWindow("services")}>
                                    <p className={`${windowns.services ? 'w-fit relative text-emerald-500  after:w-full after:h-[2px] after:bg-emerald-500 after:absolute after:left-0 after:bottom-0' : ' text-black/40 hover:text-black duration-100'}`}>Serviços</p>
                                </DropdownMenu.Item>

                                <DropdownMenu.Item className='hover:outline-none cursor-pointer' onClick={() => handleOnClickWindow("notes")}>
                                    <p className={`${windowns.notes ? 'w-fit relative text-emerald-500  after:w-full after:h-[2px] after:bg-emerald-500 after:absolute after:left-0 after:bottom-0' : ' text-black/40 hover:text-black duration-100'}`}>Notas Fiscais</p>
                                </DropdownMenu.Item>

                                <DropdownMenu.Item className='hover:outline-none cursor-pointer' onClick={() => handleOnClickWindow("documentGenerator")}>
                                    <p className={`${windowns.documentGenerator ? 'w-fit relative text-emerald-500  after:w-full after:h-[2px] after:bg-emerald-500 after:absolute after:left-0 after:bottom-0' : ' text-black/40 hover:text-black duration-100 '}`}>Geração de documentos</p>
                                </DropdownMenu.Item>

                                <DropdownMenu.Item className='hover:outline-none cursor-pointer' onClick={() => handleOnClickWindow("blog")}>
                                    <p className={`${windowns.blog ? 'w-fit relative text-emerald-500  after:w-full after:h-[2px] after:bg-emerald-500 after:absolute after:left-0 after:bottom-0' : ' text-black/40 hover:text-black duration-100'}`}>Blog</p>
                                </DropdownMenu.Item>

                                <DropdownMenu.Arrow className='my-[5px]' />
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>

            </div>

            {windowns.services && <Services />}
        </section>
    )
}

export default Index