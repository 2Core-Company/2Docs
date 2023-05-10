import React, {useState} from 'react'
import Image from 'next/image'
import Arrow from '../../../../public/icons/arrow.svg'
import CreateEnterprises from '../../Admin/Enterprise/createEnterprises'
import { DataUser } from '../../../types/users'
import Options from '../../Admin/Enterprise/options'
import { usePathname } from 'next/navigation'



interface Props{
    enterprises:{name:string, id:string}[]
    user:DataUser
    enterprise:{name:string, id:string}
    from:string
    setEnterprise: Function
    setUser: Function
}

function Enterprises({enterprises, enterprise, user, setUser, setEnterprise, from}:Props) {
    const [changeEnterprise, setChangeEnterprise] = useState(false)
    const [createEnterprises, setCreateEnterprises] = useState(false)
    const pathName = usePathname()
  return (
        <div className='absolute right-[20px] top-[10px] bg-neutral-200 dark:bg-neutral-200/20 border-[2px] border-black dark:border-white rounded-[4px] pt-[3px]'>
            {createEnterprises ? <CreateEnterprises user={user} setUser={setUser} setCreateEnterprises={setCreateEnterprises}/> : <></>}
            <div className='flex items-center px-[7px] justify-between' onClick={() => setChangeEnterprise(!changeEnterprise)}>
                <p className='max-w-[150px] overflow-hidden text-ellipsis' >{enterprise.name}</p>
                <div className='flex ml-[10px] '>
                    <div className='w-[20px] h-[20px] rounded-full border-black dark:border-white p-[2px] border-[2px]'>
                        <div className='bg-black dark:bg-white w-full h-full rounded-full'></div>
                    </div>
                    <Image src={Arrow} alt="flecha" className={`cursor-pointer w-[15px] ml-[5px] duration-200 dark:invert ¨${changeEnterprise ? " rotate-180" : ""}`}/>
                </div>
            </div>

            <div className={`${changeEnterprise ? "" : "hidden"} duration-500`}>
                {enterprises.map((data, index) =>{
                    if(data.id == enterprise.id) return ""
                    return (
                        <div key={data.id} className="hover:bg-neutral-300 flex itens-center mt-[5px] justify-between px-[7px]">
                            <p onClick={() => (setEnterprise(enterprises[index]), setChangeEnterprise(false))} className="cursor-pointer w-[100%] max-w-[150px] overflow-hidden text-ellipsis">{data.name}</p>
                            {from === "user" ? 
                                <div onClick={() => (setEnterprise(enterprises[index]), setChangeEnterprise(false))} className='cursor-pointer min-w-[20px] h-[20px] rounded-full border-black dark:border-white p-[2px] border-[2px]' />
                            : 
                                <Options user={user} index={index} setUser={setUser} setEnterprise={setEnterprise}/>
                            }
                        </div>
                    )
                })}

                {pathName === '/Dashboard/Admin/Pastas' ? 
                    <button onClick={() => setCreateEnterprises(true)} className='flex items-center text-center w-full justify-center mt-[10px] hover:bg-neutral-300 dark:hover:bg-neutral-300/10 border-t-[2px] cursor-pointer border-black dark:border-white'>
                        <p>Criar</p>
                    </button> 
                : 
                <></>}
            </div>
        </div>
    )
}

export default Enterprises