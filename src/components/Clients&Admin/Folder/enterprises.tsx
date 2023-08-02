import { DotsVerticalIcon, PlusIcon } from '@radix-ui/react-icons'
import React, { useContext, useState } from 'react'
import { adminContext } from '../../../app/Context/contextAdmin'
import { Enterprise } from '../../../types/others'
import { DataUser } from '../../../types/users'
import ModalCreateEnterprise from './modalCreateEnterprise'
import OptionsEnterprise from './optionsEnterprise'

interface Props {
  user: DataUser
  enterprise: Enterprise
  setUser: React.Dispatch<React.SetStateAction<DataUser>>
  setEnterprise: React.Dispatch<React.SetStateAction<Enterprise>>
}

function Enterprises({ user, enterprise, setUser, setEnterprise }: Props) {
  const { dataAdmin } = useContext(adminContext)
  const admin = dataAdmin.id === '' ? false : true

  return (
    <div className='max-w-[900px] overflow-auto'>
      <div className='flex items-center mt-[30px] text-[20px] max-sm:text-[18px]'>
        {user?.enterprises.map((enterpriseMap, index) => {
          return (
            <div key={enterpriseMap?.id} className={`duration-100 cursor-pointer border-b-[#686868] border-r-[#686868] border-b border-r gap-x-[10px] px-[10px] flex items-center hover:text-[rgba(0,0,0,0.5)] ${enterpriseMap.id === enterprise.id && 'bg-[#DBDBDB]'} ${index === 0 && 'rounded-tl-[8px]'} ${!admin && index  === (user?.enterprises.length - 1) && 'rounded-tr-[8px]'} ${!admin && index === (user.enterprises.length - 1)  && 'border-r-[0px]'}`}>
              <p onClick={() => setEnterprise(enterpriseMap)} className='whitespace-nowrap py-[4px] pl-[5px]'>{enterpriseMap.name}</p>
              {admin && enterpriseMap.id === enterprise.id && <OptionsEnterprise user={user} enterprise={enterprise} index={index} setUser={setUser} setEnterprise={setEnterprise} /> }
            </div>
          )
        })}
        {admin && <ModalCreateEnterprise user={user} setUser={setUser} /> }
      </div>
    </div>
  )
}

export default Enterprises