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
import axios from 'axios';
import { useTheme } from "../../../hooks/useTheme"


function NavBar(props:{user:string, image:string}) {
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

    async function setAdminAuth(){
        const id = "2hbPDdfRIuZPa5tmfnmKMKTQhPw2"
        const domain = new URL(window.location.href).origin
        const result = await axios.post(`${domain}/api/users/setAdmin`, {user: id})
    }

    const { theme, setTheme } = useTheme();

    return (
        <div className='left-[0px] fixed z-50'>
            <Tooltip.Provider delayDuration={1000} skipDelayDuration={500}>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild className={`max-lg:flex  hidden`}>
                        <button id="Menu" aria-label="Botão menu" onClick={() => setMenu(!menu)} className={`z-10  absolute top-[20px] left-[20px] max-sm:left-[15px] flex flex-col`}>
                            <div className={`w-[40px] max-sm:w-[35px] h-[3px] bg-terciary dark:bg-dterciary transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "rotate-45"}`}/>
                            <div className={`w-[40px] max-sm:w-[35px]  h-[3px] bg-terciary dark:bg-dterciary my-[8px] ${menu ? "" : "hidden"}`}/>
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
            <div className={`w-[80px] fixed max-sm:max-w-[70px] h-full  ${menu ? "max-lg:left-[-150px]" : "flex"} left-0 duration-300 bg-primary flex flex-col items-center border-r-2 border-terciary`}> 
                <Tooltip.Provider delayDuration={1000} skipDelayDuration={500}>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild className={`max-lg:mt-[60px] max-sm:mt-[50px] mt-[10px] w-full h-[70px] flex justify-center items-center`}>
                            <Avatar.Root className="flex flex-col items-center justify-center">
                                <Avatar.Image onClick={() => setAdminAuth()} width={80} height={80} className="border-[2px] border-secondary dark:border-dsecondary h-[70px] w-[70px] max-sm:h-[60px] max-sm:w-[60px] rounded-full" src={props.image} alt="Imagem de perfil"/>
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
                        <Tooltip.Trigger asChild className={`mt-[10px] ${path === "/Admin" || path === "/Clientes" ? "bg-gray-300" : ""} w-full h-[80px] max-sm:h-[70px] flex justify-center items-center`}>
                            <button id="alb" title="Pagina Inicial" aria-labelledby="labeldiv" className="cursor-pointer" onClick={()=>  (setMenu(!menu) ,router.push(props.user === "Clients" ? "/Clientes" :"/Admin"))}>
                                <HomeIcon className={'w-[50px] h-[50px] max-sm:w-[35px] max-sm:h-[35px] text-black dark:text-white'}/>
                            </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content  side="right" sideOffset={10}>
                                <p className='ml-[2px] text-[18px] font-[500] text-white dark:text-black px-[2px] rounded-[10px] bg-gray-700 dark:bg-gray-200'>Pagina Inicial</p>
                                {theme == "light" ? (
                                    <Tooltip.Arrow width={15} height={10} className='fill-gray-700'/>
                                ) : (
                                    <Tooltip.Arrow width={15} height={10} className='fill-gray-200'/>
                                )}  
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>

                    {props.user === "Clients" ? 
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild className={`mt-[10px] ${path === "/Clientes/Arquivos" || path === "/Clientes/Pastas" ? "bg-gray-300" : ""} w-full h-[80px] max-sm:max-h-[70px] flex justify-center items-center`}>
                                <button className="IconButton" id="alb" title="Pagina De Arquivos" aria-labelledby="labeldiv" onClick={()=> (setMenu(!menu), router.push("/Clientes/Pastas"))}>
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
                            <Tooltip.Trigger asChild className={`mt-[20px] ${path === "/Admin/Clientes" || path === "/Admin/Pastas" || path === "/Admin/Arquivos" ? "bg-gray-300" : ""} w-full h-[80px] max-sm:max-h-[70px] flex justify-center items-center`}>
                                <button className="cursor-pointer" id="alb" title="Pagina De Clientes" aria-labelledby="labeldiv"  onClick={()=> router.push("/Admin/Clientes")}>
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
                        <div className='w-[90%] h-[3px] bg-terciary mt-[10px] max-sm:mt-[10px] rounded-full self-center justify-self-center absolute bottom-[70px] max-sm:bottom-[60px]'/>
                        <Tooltip.Trigger asChild className={`absolute bottom-[20px] max-sm:bottom-[10px] w-full flex justify-center`}>
                            <button className="IconButton" onClick={() => setModal({status:true,  message:"Tem certeza que deseja sair da sua conta cursor-pointer"})} >
                                <Image src={iconExit} alt="Ícone de sair" className='w-[40px] max-sm:w-[35px] h-[40px] max-sm:h-[35px]'/> 
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

