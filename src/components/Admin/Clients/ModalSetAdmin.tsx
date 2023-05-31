import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { DataUser, DataUserContext } from "../../../types/users";
import { getAdmins } from "../../../Utils/Firebase/GetUsers";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import { db } from "../../../../firebase";
import { doc, updateDoc } from "firebase/firestore";


type Props = {
    setModalAdminOptions: Function,
    user: DataUser,
    dataAdmin: DataUserContext,
    setUsers: Function,
    users: DataUser[],
}

const toastUpdateCfg = {pending: "Salvando atribuições.", success: "Salvamento concluído."}

function SetAdminOptions({setModalAdminOptions, user, dataAdmin, setUsers, users}: Props) {
    const [allAdmins, setAllAdmins] = useState<DataUserContext[]>([])
    const [actualUser, setActualUser] = useState<DataUser>(user)

    useEffect(() => {
        async function getAllAdmins() {
            await getAdmins({id_company: dataAdmin.id_company, setAllAdmins});
        }

        getAllAdmins();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function updateAdmins() {
        try {
            let indexUser = users.findIndex((usersUser) => usersUser.id === user.id)
            let mock = users
            mock[indexUser].admins = actualUser.admins
            setUsers([...mock])

            updateDoc(
                doc(db, "companies", dataAdmin.id_company, "clients", actualUser.id),
                {
                    admins: actualUser.admins
                }
            )

            setModalAdminOptions(false);
        } catch (e) {
            throw toast.error("Erro ao realizar a ação: " + e)
        }
    }

    return(
        <div className="fixed bg-black/30 backdrop-blur-sm w-screen h-screen bottom-0 z-50 text-black flex flex-col items-center justify-center left-0">
            <div className="max-w-[600px] w-full flex flex-col bg-primary pb-[10px] rounded-[8px] relative">
                <div onClick={() => setModalAdminOptions(false)} className="w-[30px] h-[30px] absolute top-[10px] right-[10px] cursor-pointer flex justify-center">
                    <div className="w-[2px] h-[30px] rounded-[4px] bg-black rotate-45 after:w-[2px] after:h-[30px] after:block after:bg-black after:rounded-[4px] after:rotate-90"></div>
                </div>
                <div className="px-[10px] pl-[20px]">
                    <p className="text-[26px] mt-[10px] font-[500] dark:text-white">
                        Atribuição Pessoal de Admins
                    </p>
                </div>
                <div className="px-[10px] pl-[20px] my-6 flex gap-4 items-center">
                    <Image src={actualUser.photo_url} width={500} height={500} alt="Foto de Perfil" className="rounded-full w-[45px] h-[45px]" />
                    <p className="text-[20px] dark:text-white ">{actualUser.name}</p>
                </div>
                <div className="my-6 py-3 flex flex-col gap-4 justify-center mx-10 border-terciary border rounded-md">
                    <div className="w-full px-[10px] pl-[20px]">
                    <p className="mb-2" onClick={() => console.log(actualUser)}>Admins designados:</p>
                    <div className="flex gap-4 flex-wrap">
                        {allAdmins?.
                        map((admin, index) => 
                        {
                            if(actualUser.admins.length === 0 && index === 0) {
                                return(
                                    <p key={admin.id} className="text-[16px] font-normal text-neutral-500 mt-3">Nenhum admin designado ainda 😦</p>
                                )
                            } else {                                
                                if(actualUser.admins.findIndex((id) => id === admin.id) !== -1 && admin.permission !== 3) {
                                    return(
                                        <div key={admin.id} onClick={() => setActualUser({...actualUser, admins: actualUser.admins.filter((id) => id !== admin.id)})} className="flex gap-2 p-1 hover:bg-secondary/25 rounded-[18px] items-center transition-[background-color] duration-200 select-none cursor-pointer border border-secondary/30">
                                            <Image src={admin.photo_url!} width={500} height={500} alt="Foto de perfil Admin" className="rounded-full w-[25px] h-[25px]" />
                                            {admin.name}
                                            <Cross2Icon width={22} height={22} className="text-[150px]" />
                                        </div>
                                    )
                                }
                            }
                        })}
                    </div>
                    </div>
                    <hr className="border-secondary width-[75%]"/>
                    <div className="w-full px-[10px] pl-[20px]">
                    <p className="mb-2">Admins disponíveis:</p>
                    <div className="flex gap-4 flex-wrap">
                        {allAdmins?.
                            map((admin, index) => 
                            {
                                if(actualUser.admins.length === allAdmins.filter((admin) => admin.permission < 3).length && index === 0) {
                                    return(
                                        <p key={admin.id} className="text-[16px] font-normal text-neutral-500 mt-3">Nenhum admin disponível 😦</p>
                                    )
                                } else {
                                    if(actualUser.admins.findIndex((id) => id === admin.id) === -1 && admin.permission !== 3) {
                                        return(
                                            <div key={admin.id} onClick={() => setActualUser({...actualUser, admins: [...actualUser.admins, admin.id]})} className="flex gap-2 p-1 hover:bg-secondary/25 rounded-[18px] items-center transition-[background-color] duration-200 select-none cursor-pointer border border-secondary/30">
                                                <Image src={admin.photo_url!} width={500} height={500} alt="Foto de perfil Admin" className="rounded-full w-[25px] h-[25px]" />
                                                {admin.name}
                                                <PlusIcon width={22} height={22} className="text-[150px]" />
                                            </div>                                    
                                        )
                                    }
                                }
                            })}
                    </div>
                    </div>
                </div>
                    <div className="flex gap-5 mb-6 mt-8 mr-6 justify-end">
                        <button onClick={() => {setModalAdminOptions(false)}} className="cursor-pointer bg-strong dark:bg-dstrong hover:scale-[1.10] duration-300 p-[5px] border-2 border-strong rounded-[8px] text-[20px] max-sm:text-[18px] text-white">
                            Cancelar
                        </button>
                        <button onClick={() => toast.promise(updateAdmins(), toastUpdateCfg)} className="cursor-pointer bg-greenV/40 border-2 border-greenV hover:scale-[1.10] duration-300 p-[5px] rounded-[8px] text-[20px] max-sm:text-[18px] text-white ">
                            Atualizar
                        </button>
                </div>
            </div>
        </div>
    )
}

export default SetAdminOptions;