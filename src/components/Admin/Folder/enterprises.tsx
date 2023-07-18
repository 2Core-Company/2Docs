import { DotsVerticalIcon, PlusIcon } from '@radix-ui/react-icons'
import React, { useState } from 'react'
import { Enterprise } from '../../../types/others'
import { DataUser } from '../../../types/users'
import ModalCreateEnterprise from './modalCreateEnterprise'
import OptionsEnterprise from './optionsEnterprise'

interface Props {
  user: DataUser
  setUser: React.Dispatch<React.SetStateAction<DataUser>>
}

function Enterprises({ user, setUser }: Props) {
  const [enterprises, setEnterprises] = useState<Enterprise[]>(user?.enterprises)

  return (
    <div className='flex items-center border-b-[#686868] border-b mt-[30px] text-[20px] overflow-x-auto max-w-[900px]'>
      {enterprises?.map((enterprise, index) => {
        return (
          <div key={enterprise.id} className={`border-r-[#686868] border-r p-[3px] gap-x-[10px] flex items-center`}>
            <p className='whitespace-nowrap'>{enterprise.name}</p>
            <div className='cursor-pointer'>
              <OptionsEnterprise user={user} index={index} setUser={setUser}/>
            </div>
          </div>
        )
      })}
      <ModalCreateEnterprise user={user} setUser={setUser} />
    </div>
  )
}

export default Enterprises