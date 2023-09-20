'use client'

import React, { useContext, useEffect, useState } from 'react'
import { companyContext } from '../../../app/Context/contextCompany'
import { getOnlineUsers } from '../../../Utils/Firebase/Company/OnlineUsers'
import { Component } from '../../../Utils/Other/componentRoot'
import Image from 'next/image'
import NoneUser from '../../../../public/icons/noneUser.svg'

type usersStats = {
    img: string
    name: string
}

type usersProps = {
    [key: string]: usersStats
}

function UsersOnline() {
    const { dataCompany } = useContext(companyContext)
    const [onlineUsers, setOnlineUsers] = useState<usersProps>()

    useEffect(() => {
        async function getUsers() {
            await getOnlineUsers({ id_company: dataCompany.id, stateChange: setOnlineUsers })
        }

        getUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div>
            <Component.root title={'Clientes Ativos'} className='p-[30px] max-sm:p-[20px] h-[360px] overflow-y-scroll max-w-[443px] '>
                <div className="flex flex-wrap justify-between items-center gap-x-[25px] max-sm:gap-x-[20px] gap-y-[10px] ">
                    {onlineUsers ?  
                        Object.keys(onlineUsers).map((key) => {
                            return { img: onlineUsers[key].img, name: onlineUsers[key].name }
                        }).map((user, key) => {
                            return (
                                <div key={key} className='flex items-center gap-2'>
                                    <Image src={user.img} alt='User image' width={40} height={40} className='rounded-full aspect-square' />
                                    <p className='flex items-center gap-1 after:w-[10px] after:h-[10px] after:inline-block after:bg-emerald-500 after:rounded-full text-[20px]'>{user.name.length > 9 ? `${user.name.substring(0, 9)}...` : user.name}</p>
                                </div>
                            )
                        })
                        :
                        <div className='flex text-center items-center flex-col mx-auto mt-6 gap-4'>
                            <Image src={NoneUser} priority alt='Nenhum usuário online' />
                            <p className='font-poiretOne text-[28px] max-sm:text-[25px] max-lsm:text-[23px] text-[#686868] text-center max-w-[400px]'>Nenhum usuário ativo no momento.</p>
                        </div>
                    }
                </div>

            </Component.root>
        </div>
    )
}

export default UsersOnline
