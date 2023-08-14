import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { DataUser, DataUserContext } from "../../../types/users";
import { getAdmins } from "../../../Utils/Firebase/Users/GetUsers";
import { Cross2Icon, PlusIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import { db } from "../../../../firebase";
import { deleteField, doc, updateDoc } from "firebase/firestore";
import * as Tooltip from '@radix-ui/react-tooltip';


type Props = {
    setModalAdminOptions: Function,
    user: DataUser,
    dataAdmin: DataUserContext,
    setUsers: Function,
    users: DataUser[],
}

const toastUpdateCfg = { pending: "Salvando atribuições.", success: "Salvamento concluído." }

function SetAdminOptions({ setModalAdminOptions, user, dataAdmin, setUsers, users }: Props) {
    const [allAdmins, setAllAdmins] = useState<DataUserContext[]>([])
    const [actualUser, setActualUser] = useState<DataUser>(user)

    useEffect(() => {
        async function getAllAdmins() {
            const result = await getAdmins({ id_company: dataAdmin.id_company});
            if(result){
                setAllAdmins(result)
            }
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
                    admins: actualUser.admins.length > 0 ? actualUser.admins : deleteField()
                }
            )

            setModalAdminOptions(false);
        } catch (e) {
            throw toast.error("Erro ao realizar a ação: " + e)
        }
    }


    return (
        <div className="fixed bg-black/30 backdrop-blur-sm w-screen h-screen bottom-0 z-50 text-black flex flex-col items-center justify-center left-0 max-md:px-[20px] max-sm:px-[10px]">
            <div className="max-w-[600px] w-full flex flex-col bg-primary rounded-[18px] relative">
                <div className="w-full rounded-t-[18px] h-[17px] bg-emerald-500" />
                <div className="px-[30px] max-sm:px-[20px] max-lsm:px-[15px]">
                    <div className="flex gap-[10px] items-center mt-[15px]" >
                        <p className="text-[26px] max-md:text-[25px] max-sm:text-[23px] max-lsm:text-[21px] font-[500] dark:text-white after:w-[50px] after:h-[3px] after:bg-emerald-500 after:block after:rounded-full after:mt-[-5px]">
                            Atribuição Pessoal de Admins
                        </p>
                        <Tooltip.Provider>
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                    <button className="text-[#10B981]">
                                        <InfoCircledIcon width={16} height={16} />
                                    </button>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                    <Tooltip.Content
                                        className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none rounded bg-primary p-[10px] text-[14px] font-[400] leading-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] z-50"
                                        align='end'
                                    >
                                        Você precisa de admins cadastrados no 2Dash para o funcionamento dessa atribuição.<br /><span className="text-red">Admins de nível 3 não serão reconhecidos por terem acesso total.</span>
                                        <Tooltip.Arrow className="fill-primary" />
                                    </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    </div>

                    <div className="mt-[20px] flex items-center gap-x-[8px]">
                        <Image src={actualUser.photo_url} quality={100} width={35} height={35} alt="Foto de Perfil" className="rounded-full h-[35px] w-[35px]" />
                        <p className="text-[20px] max-sm:text-[19px] max-lsm:text-[18px] dark:text-white ">{actualUser.name}</p>
                    </div>


                    <div className="border-terciary border rounded-[11px] mt-[20px]">
                        <div className="w-full p-[10px]">
                            <p className="text-[17px]">Admins designados:</p>
                            <div className="flex gap-4 flex-wrap min-h-[50px] items-start">
                                {allAdmins?.
                                    map((admin, index) => {
                                        if (actualUser.admins.length === 0 && index === 0) {
                                            return (
                                                <p key={admin.id} className="text-[16px] self-center font-normal text-neutral-500 text-center w-full">Nenhum admin atribuído para esse cliente...</p>
                                            )
                                        } else {
                                            if (actualUser.admins.findIndex((id) => id === admin.id) !== -1 && admin.permission !== 3) {
                                                return (
                                                    <div key={admin.id} onClick={() => setActualUser({ ...actualUser, admins: actualUser.admins.filter((id) => id !== admin.id) })} className="flex gap-2 p-1 hover:bg-secondary/25 rounded-[18px] items-center transition-[background-color] duration-200 select-none cursor-pointer border border-secondary/30">
                                                        <Image src={admin.photo_url!} width={500} height={500} alt="Foto de perfil Admin" className="rounded-full w-[25px] h-[25px]" />
                                                        {admin.name}
                                                        <Cross2Icon width={20} height={20} />
                                                    </div>
                                                )
                                            }
                                        }
                                    })}
                            </div>
                        </div>

                        <hr className="border-secondary" />

                        <div className="w-full p-[10px]">
                            <p className="text-[17px]">Admins disponíveis:</p>
                            <div className="flex gap-4 flex-wrap min-h-[50px] items-start">
                                {allAdmins?.
                                    map((admin, index) => {
                                        if (actualUser.admins.length === allAdmins.filter((admin) => admin.permission < 3).length && index === 0) {
                                            return (
                                                <p key={admin.id} className="text-[16px] font-normal text-neutral-500 self-center text-center w-full">Nenhum admin disponível para atribuição...</p>
                                            )
                                        } else {
                                            if (actualUser.admins.findIndex((id) => id === admin.id) === -1 && admin.permission !== 3) {
                                                return (
                                                    <div key={admin.id} onClick={() => setActualUser({ ...actualUser, admins: [...actualUser.admins, admin.id] })} className="flex gap-x-2 p-1 hover:bg-secondary/25 rounded-full items-center transition-[background-color] duration-200 select-none cursor-pointer border border-secondary/30">
                                                        <Image src={admin.photo_url!} width={500} height={500} alt="Foto de perfil Admin" className="rounded-full w-[25px] h-[25px]" />
                                                        {admin.name}
                                                        <PlusIcon width={20} height={20} />
                                                    </div>
                                                )
                                            }
                                        }
                                    })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between px-[30px] bg-[#D9D9D9] font-[500] py-[15px] mt-[30px] border border-[#AAAAAA] rounded-b-[11px]">
                    <button onClick={() => { setModalAdminOptions(false) }} className="cursor-pointer hover:bg-[#cecbcb] duration-100 px-[10px] py-[8px] border border-[rgba(104,104,104,0.7)] rounded-[8px] text-[#5C5C5C]">
                        Cancelar
                    </button>
                    <button onClick={() => toast.promise(updateAdmins(), toastUpdateCfg)} className="cursor-pointer bg-[rgba(16,185,129,0.3)] border border-greenV hover:bg-[rgba(16,185,129,0.5)] duration-100 px-[10px] py-[8px] rounded-[8px] text-[#117856] ">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SetAdminOptions;