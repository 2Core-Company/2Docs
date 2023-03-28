import React, { useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { HomeIcon, FileTextIcon, PersonIcon } from '@radix-ui/react-icons';
import * as Avatar from '@radix-ui/react-avatar';
import iconExit from '../../../../public/icons/exit.svg'
import Image from 'next/image'
import Modals from '../Modals'
import { usePathname } from 'next/navigation'
import { signOut} from "firebase/auth";
import { auth } from '../../../../firebase'
import { useRouter } from 'next/navigation';
import { Modal } from '../../../types/interfaces'
import { useTheme } from "../../../hooks/useTheme"
import Calendar from '../../../../public/icons/calendar.svg';

interface Props{
    user:string
    image:string
}

function NavBar({user, image}:Props) {
    const path = usePathname()
    const [menu, setMenu] = useState(true)
    const [modal, setModal] = useState<Modal>({status: false, message: ""})
    const router = useRouter()
 
    const childModal = () => {
        signOut(auth).then(() => {
            setModal({status: false, message: ""})
            router.push("/")
        }).catch((error) => {
            console.log(error)
        });
    }

    const { theme, setTheme } = useTheme();

    return (
        <div className='top-0 fixed z-50'>
            <Tooltip.Provider delayDuration={1000} skipDelayDuration={500}>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild className={`max-lg:flex  hidden`}>
                        <button id="Menu" aria-label="Botão menu" onClick={() => setMenu(!menu)} className={`z-10  absolute top-[20px] left-[20px] max-sm:left-[15px] flex flex-col`}>
                            <div className={`w-[40px] max-sm:w-[35px] h-[3px] bg-terciary dark:bg-dterciary transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "rotate-45"}`}/>
                            <div className={`w-[40px] max-sm:w-[35px]  h-[3px] bg-terciary dark:bg-dterciary my-[8px] transition duration-500 max-sm:duration-400 ease-in-out ${menu ? "" : "hidden"} `}/>
                            <div className={`w-[40px] max-sm:w-[35px]  h-[3px] bg-terciary dark:bg-dterciary transition duration-500 max-sm:duration-400 ease-in-out ${menu ? "" : "rotate-[135deg] mt-[-3px]"}`}/>
                        </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content  side="right" sideOffset={10}>
                            <p className='ml-[5px] text-[20px] font-[500] text-black'>{menu ? "Menu" : "Fechar Menu"}</p>
                            <Tooltip.Arrow width={15} height={10}/>
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
            <div className={`w-[80px] relative max-sm:max-w-[70px] h-screen overflow-hidden  ${menu ? "max-lg:left-[-150px]" : "flex"} left-0 duration-300 bg-primary dark:bg-dprimary flex flex-col items-center border-r-2 border-terciary dark:border-dterciary`}> 
                <Tooltip.Provider delayDuration={1000} skipDelayDuration={500}>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild className={`max-lg:mt-[60px] max-sm:mt-[50px] mt-[10px] w-full h-[70px] flex justify-center items-center`}>
                            <Avatar.Root className="flex flex-col items-center justify-center">
                                <Avatar.Image width={80} height={80} className="border-[2px] border-secondary dark:border-dsecondary h-[70px] w-[70px] max-sm:h-[60px] max-sm:w-[60px] rounded-full" src={image} alt="Imagem de perfil"/>
                            </Avatar.Root>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content  side="right" sideOffset={10}>
                                <p className='ml-[2px] text-[18px] font-[500] text-white dark:text-black px-[2px] rounded-[10px] bg-gray-700 dark:bg-gray-200'>Foto de Perfil</p>
                                {theme == "light" ? (
                                    <Tooltip.Arrow width={15} height={10} className='fill-gray-700'/>
                                ) : (
                                    <Tooltip.Arrow width={15} height={10} className='fill-gray-200'/>
                                )}  
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>

                    <div className='w-[90%] h-[3px] bg-terciary mt-[10px] max-sm:mt-[10px] rounded-full self-center justify-self-center'/>

                    <Tooltip.Root>
                        <Tooltip.Trigger asChild className={`mt-[10px] ${path === "/Dashboard/Admin" || path === "/Dashboard/Clientes" ? "bg-gray-300 dark:bg-gray-300/20" : ""} w-full h-[80px] max-sm:h-[70px] flex justify-center items-center`}>
                            <button id="alb" title="Pagina Inicial" aria-labelledby="labeldiv" className="cursor-pointer" onClick={()=>  (setMenu(!menu) ,router.push(user === "Clients" ? "/Dashboard/Clientes" :"/Dashboard/Admin"))}>
                                <HomeIcon className={'w-[50px] h-[50px] max-sm:w-[35px] max-sm:h-[35px] text-black dark:text-white'}/>
                            </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content  side="right" sideOffset={10}>
                                <p className='ml-[2px] text-[18px] font-[500] text-white dark:text-black px-[4px] rounded-[10px] bg-gray-700 dark:bg-gray-200'>Inicial</p>
                                {theme == "light" ? (
                                    <Tooltip.Arrow width={15} height={10} className='fill-gray-700'/>
                                ) : (
                                    <Tooltip.Arrow width={15} height={10} className='fill-gray-200'/>
                                )}  
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>

                    {user === "Clients" ? 
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild className={`mt-[10px] ${path === "/Dashboard/Clientes/Arquivos" || path === "/Dashboard/Clientes/Pastas" ? "bg-gray-300" : ""} w-full h-[80px] max-sm:max-h-[70px] flex justify-center items-center`}>
                                <button className="IconButton" id="alb" title="Pagina De Arquivos" aria-labelledby="labeldiv" onClick={()=> (setMenu(!menu), router.push("/Dashboard/Clientes/Pastas"))}>
                                    <FileTextIcon className={'w-[50px] h-[50px] max-sm:w-[35px] max-sm:h-[35px] text-black dark:text-white cursor-pointer'}/>
                                </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Content  side="right" sideOffset={10}>
                                    <p className='ml-[2px] text-[18px] font-[500] text-white dark:text-black px-[2px] rounded-[10px] bg-gray-700 dark:bg-gray-200'>Arquivos</p>
                                    {theme == "light" ? (
                                        <Tooltip.Arrow width={15} height={10} className='fill-gray-700'/>
                                    ) : (
                                        <Tooltip.Arrow width={15} height={10} className='fill-gray-200'/>
                                    )}  
                                </Tooltip.Content>
                            </Tooltip.Portal>
                        </Tooltip.Root>
                    :
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild className={`mt-[20px] ${path === "/Dashboard/Admin/Clientes" || path === "/Dashboard/Admin/Pastas" || path === "/Dashboard/Admin/Arquivos" ? "bg-gray-300 dark:bg-gray-300/20" : ""} w-full h-[80px] max-sm:max-h-[70px] flex justify-center items-center`}>
                                <button className="cursor-pointer" id="alb" title="Pagina De Clientes" aria-labelledby="labeldiv"  onClick={()=> (setMenu(!menu), router.push("/Dashboard/Admin/Clientes"))}>
                                    <PersonIcon className={'w-[50px] h-[50px] max-sm:w-[35px] max-sm:h-[35px] text-black dark:text-white'}/>
                                </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                                <Tooltip.Content  side="right" sideOffset={10}>
                                    <p className='ml-[2px] text-[18px] font-[500] text-white dark:text-black px-[5px] py-[2px] rounded-[10px] bg-gray-700 dark:bg-gray-200'>Clientes</p>
                                    {theme == "light" ? (
                                        <Tooltip.Arrow width={15} height={10} className='fill-gray-700' />
                                    ) : (
                                        <Tooltip.Arrow width={15} height={10} className='fill-gray-200' />
                                    )}                                    
                                </Tooltip.Content>
                            </Tooltip.Portal>
                        </Tooltip.Root>
                    }

                    <Tooltip.Root>
                        <Tooltip.Trigger asChild className={`mt-[20px] ${path === "/Dashboard/Admin/Calendario" || path === "/Dashboard/Clientes/Calendario"  ? "bg-gray-300 dark:bg-gray-300/20" : ""} w-full h-[80px] max-sm:max-h-[70px] flex justify-center items-center`}>
                            <button className="cursor-pointer" id="alb" title="Pagina De Calendário" aria-labelledby="labeldiv"  onClick={()=> (setMenu(!menu), router.push(window.location.href.includes('Admin') ? '/Dashboard/Admin/Calendario'  : '/Dashboard/Clientes/Calendario'))}>
                                <Image src={Calendar} alt="Calendário" className={`w-[50px] h-[50px] max-sm:w-[35px] max-sm:h-[35px] dark:fill-[#fff]`}/>
                            </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content  side="right" sideOffset={10}>
                                <p className='ml-[2px] text-[18px] font-[500] text-white dark:text-black px-[5px] py-[2px] rounded-[10px] bg-gray-700 dark:bg-gray-200'>Calendário</p>
                                {theme == "light" ? (
                                    <Tooltip.Arrow width={15} height={10} className='fill-gray-700' />
                                ) : (
                                    <Tooltip.Arrow width={15} height={10} className='fill-gray-200' />
                                )}                                    
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>

                    <Tooltip.Root>
                        <div className='w-[90%] h-[3px] bg-terciary dark:bg-dterciary mt-[10px] max-sm:mt-[10px] rounded-full self-center justify-self-center absolute bottom-[70px] max-sm:bottom-[60px]'/>
                        <Tooltip.Trigger asChild className={`absolute bottom-[20px] max-sm:bottom-[10px] w-full flex justify-center`}>
                            <button className="IconButton" onClick={() => setModal({status:true,  message:"Tem certeza que deseja sair da sua conta?"})} >
                                <Image priority src={iconExit} alt="Ícone de sair" className='w-[40px] max-sm:w-[35px] h-[40px] max-sm:h-[35px] cursor-pointer'/> 
                            </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                        <Tooltip.Content  side="right" sideOffset={10}>
                            <p className='ml-[2px] text-[18px] font-[500] px-[5px] py-[2px] rounded-[10px] bg-red text-white'>Sair</p>
                            <Tooltip.Arrow width={15} height={10} className="fill-red"/>
                        </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider>
                </div>
                {modal.status ? <Modals setModal={setModal} message={modal.message} subMessage1={undefined} subMessage2={undefined} childModal={childModal}/> : <></>}
        </div>
    )
}

export default NavBar

