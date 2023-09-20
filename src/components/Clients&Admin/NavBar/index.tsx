import React, { useContext, useRef, useState } from 'react';
import { DashboardIcon, FileTextIcon, PersonIcon, CalendarIcon, ChevronUpIcon, ExternalLinkIcon, MoonIcon, SunIcon, TriangleDownIcon, Component1Icon } from '@radix-ui/react-icons';
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from "firebase/auth";
import { auth } from '../../../../firebase'
import { useRouter } from 'next/navigation';
import { themeContext } from "../../../hooks/useTheme"
import Logo2Docs from 'public/icons/Logo2Docs.svg';
import style from './navBar.module.css'
import * as Popover from '@radix-ui/react-popover';
import Link from 'next/link';
import { userContext } from '../../../app/Context/contextUser';
import { adminContext } from '@/src/app/Context/contextAdmin';
import { Component } from '@/src/Utils/Other/componentRoot';

interface Props {
    permission: number
    image: string
    name: string
}

function NavBar({ permission, image, name }: Props) {
    const { dataUser } = useContext(userContext)
    const path = usePathname()
    const [menu, setMenu] = useState(true)
    const router = useRouter()
    const styleDivIconNavBar = "h-[40px] lg:group-hover:h-[35px] max-lg:h-[35px] mt-[25px] relative lg:w-full flex justify-center lg:group-hover:px-[30px] max-lg:px-[20px] lg:group-hover:justify-start item-center cursor-pointer group/button"
    const styleIconNavBar = "w-[32px] h-[32px] lg:group-hover:w-[24px] lg:group-hover:h-[24px] max-lg:w-[24px] max-lg:h-[24px] group-hover/button:opacity-[.65]"
    const styleIcon2NavBar = "w-[32px] h-[38px] lg:group-hover:w-[24px] lg:group-hover:h-[28px] max-lg:w-[24px] max-lg:h-[28px] group-hover/button:opacity-[.65]"
    const styleSubLineIcon = "h-full w-[4px] bg-hilight rounded-full left-0 top-[-5px] absolute"
    const styleTextIcons = "lg:hidden lg:group-hover:block ml-[10px] group-hover/button:opacity-[.65]"
    const popoverRef = useRef<any>();
    const arrowIconRef = useRef<any>();

    const leaveHover = () => {
        popoverRef.current?.click();
    };

    const actionPopOver = (action) => {
        if (action) {
            arrowIconRef?.current?.classList.add('rotate-180')
        } else {
            arrowIconRef?.current?.classList.remove('rotate-180')
        }
    }

    function ExitAccount() {
        signOut(auth).
            then(() => {
                router.replace('/')
            }).catch((error) => {
                console.log(error)
            });
    }

    return (
        <div className='lg:min-w-[100px] text-black'>
            <div onClick={() => setMenu(true)} className={`z-10 fixed w-screen h-screen top-0 left-0 backdrop-blur-[2px] ${menu ? 'hidden' : ''}`} />
            <button id="Menu" aria-label="Botão menu" onClick={() => setMenu(!menu)} className={`lg:hidden outline-none w-[30px] h-[25px] cursor-pointer  fixed top-[10px] left-[10px] flex flex-col items-center justify-center ${menu ? 'z-10 bg-primary' : 'z-20'}`}>
                <div className={`rounded-[30px] w-[30px] max-sm:w-[28px] h-[3px] bg-terciary dark:bg-dterciary ${menu ? "" : "rotate-45"}`} />
                <div className={`rounded-[30px] w-[30px] max-sm:w-[28px] h-[3px] bg-terciary dark:bg-dterciary my-[5px] ${menu ? "" : "hidden"} `} />
                <div className={`rounded-[30px] w-[30px] max-sm:w-[28px] h-[3px] bg-terciary dark:bg-dterciary ${menu ? "" : "rotate-[135deg] mt-[-3px]"}`} />
            </button>

            {/*  '}  */}
            <div onMouseLeave={leaveHover} className={`${menu ? 'max-lg:left-[-250px]' : 'max-lg:left-[0px]'} group lg:w-[100px] lg:hover:w-[250px] max-lg:w-[220px] h-screen overflow-hidden 
            left-0 flex flex-col items-center border-r-[1px] border-terciary lg:hover:items-start fixed max-lg:items-start z-10 bg-primary duration-300`}>

                <div className='flex justify-between mt-[50px] items-center lg:group-hover:px-[30px] max-lg:px-[20px]'>
                    <Image src={Logo2Docs} quality={100} priority alt='Logo App' className='w-[48px] h-[56px]' />
                    <div className='min-w-[2px] h-[35px] bg-black mx-[10px] hidden lg:group-hover:block max-lg:block' />
                    <p className='text-[25px] hidden lg:group-hover:block max-lg:block'>2Docs</p>
                </div>


                <button onClick={() => (setMenu(true), permission > 0 ? router.push('/Dashboard/Admin') : router.push('/Dashboard/Clientes'))} className={`${styleDivIconNavBar} mt-[60px]`}>
                    <div className={`${path === '/Dashboard/Admin' || path === '/Dashboard/Clientes' ? 'text-hilight' : 'text-black'} flex items-center`}>
                        <DashboardIcon className={styleIconNavBar} />
                        <p className={styleTextIcons}>Dashboard</p>
                    </div>
                    {path === '/Dashboard/Admin' || path === '/Dashboard/Clientes' ?
                        <div className={styleSubLineIcon} />
                        : <></>}
                </button>

                {permission > 0 &&
                    <button onClick={() => (setMenu(true), router.push('/Dashboard/Admin/Clientes'))} className={`${styleDivIconNavBar}`}>
                        <div className={`${permission > 0 && path === '/Dashboard/Admin/Clientes' || path === '/Dashboard/Admin/Pastas' || path === '/Dashboard/Admin/Arquivos' ? 'text-hilight' : 'text-black'} flex items-center`}>
                            <PersonIcon className={`${permission === 0 ? 'hidden' : ''} ${styleIcon2NavBar}`} />
                            <p className={`${styleTextIcons} whitespace-nowrap`}>Seus Clientes</p>
                        </div>
                        {permission > 0 && path === '/Dashboard/Admin/Clientes' || path === '/Dashboard/Admin/Pastas' || path === '/Dashboard/Admin/Arquivos' ?
                            <div className={styleSubLineIcon} />
                            : <></>}
                    </button>
                }

                {permission === 0 &&
                    <button onClick={() => (setMenu(true), router.push('/Dashboard/Clientes/Pastas'))} className={`${styleDivIconNavBar}`}>
                        {path === '/Dashboard/Clientes/Pastas' || path === '/Dashboard/Clientes/Arquivos' ?
                            <div className={styleSubLineIcon} />
                            : <></>}

                        <div className={`${path === '/Dashboard/Clientes/Pastas' || path === '/Dashboard/Clientes/Arquivos' ? 'text-hilight' : 'text-black'} flex items-center`}>
                            <FileTextIcon className={styleIcon2NavBar} />
                            <p className={styleTextIcons}>Documentos</p>
                        </div>
                    </button>
                }


                {permission === 0 &&
                    <button onClick={() => (setMenu(true), router.push(`/Dashboard/Clientes/Calendario/${dataUser.id}/${undefined}`))} className={`${styleDivIconNavBar}`}>
                        {path?.includes('/Dashboard/Clientes/Calendario') &&
                            <div className={styleSubLineIcon} />
                        }

                        <div className={`${path?.includes('/Dashboard/Clientes/Calendario' || '/Dashboard/Clientes/Evento') || path?.includes('/Dashboard/Clientes/Evento') ? 'text-hilight' : 'text-black'} flex items-center`}>
                            <CalendarIcon className={styleIconNavBar} />
                            <p className={styleTextIcons}>Calendário</p>
                        </div>
                    </button>
                }

                {/* {
                    <button onClick={() => (setMenu(true), router.push(`/Dashboard/${permission === 0 ? 'Clientes' : 'Admin'}/Portal`))} className={`${styleDivIconNavBar}`}>
                        {path?.includes('/Dashboard/Clientes/Portal') || path?.includes('/Dashboard/Admin/Portal') &&
                            <div className={styleSubLineIcon} />
                        }

                        <div className={`${path?.includes('/Dashboard/Clientes/Portal') || path?.includes('/Dashboard/Admin/Portal') ? 'text-hilight' : 'text-black'} flex items-center`}>
                            <Component1Icon className={styleIconNavBar} />
                            <p className={styleTextIcons}>Portal</p>
                        </div>
                    </button>
                } */}


                <Popover.Root onOpenChange={actionPopOver}>
                    <Popover.Trigger className='mt-auto  lg:group-hover:px-[30px] max-lg:px-[20px] cursor-pointer'>
                        <div className='flex items-center mb-[40px] max-lg:mb-[20px] relative'>
                            <ChevronUpIcon ref={arrowIconRef} className='w-[18px] h-[18px] absolute bottom-[-2px] left-[-4px] bg-[#D9D9D9] rounded-full duration-300' />
                            <Image src={image} alt='Perfil' quality={100} width={55} height={55} className='w-[45px] h-[45px] max-lg:w-[40px] max-lg:h-[40px] rounded-full' />
                            <p className={`${styleTextIcons} text-ellipsis whitespace-nowrap max-w-[200px] max-lg:max-w-[170px] overflow-hidden`}>{name}</p>
                        </div>
                    </Popover.Trigger>

                    <Popover.Content id={style.PopoverContent} className='gap-y-[10px] z-10 bg-primary ml-[30px] max-lg:ml-[15px] px-[20px] text-[#686868] py-[15px] text-[14px] rounded-[5px] flex flex-col relative mb-[15px] drop-shadow-[0_5px_5px_rgba(0,0,0,0.30)] outline-none'>
                        {permission > 0 &&
                            <Link href={'https://www.2docs.app/dashboard'} className='flex items-center cursor-pointer hover:brightness-[.65] duration-100'>
                                <p className='underline'>Ir para o painel de Admin </p>
                                <ExternalLinkIcon className='text-hilight ml-[5px] w-[20px] h-[20px]' />
                            </Link>
                        }

                        <button onClick={() => ExitAccount()} className='bg-[rgba(255,0,0,0.16)] border-[1px] border-[#FF0000] rounded-[5px] px-[15px] py-[2px] hover:brightness-[.65] duration-100 self-end'>
                            <p className='text-[#BE0000]'>Sair</p>
                        </button>

                        <TriangleDownIcon className='w-[40px] h-[40px] text-primary absolute bottom-[-23px] left-[-3px]' />
                    </Popover.Content>
                    <Popover.Close ref={popoverRef} />
                </Popover.Root>

            </div>
        </div>
    )
}

export default NavBar

