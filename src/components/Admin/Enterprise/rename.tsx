import React, { useState } from 'react'
import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { DataUser } from '../../../types/users'

interface Props{
    user:DataUser,
    index:number
    setUser:Function
    setRename:Function
}

function  Rename({user, index, setUser, setRename}:Props) {
  const [nameEnterprise, setNameEnterprise] = useState(user.enterprises[index].name)
  
  async function ChangeName(){
    const enterprises = [...user.enterprises]
    const index2 = enterprises.findIndex((enterprise) => enterprise.name === nameEnterprise)
    if(index2 > -1){
      throw toast.error('Uma empresa não pode ter o mesmo nome de outra empresa.-')
    }
    enterprises[index].name = nameEnterprise
    try{
      await updateDoc(doc(db, 'companies', user.id_company, "clients", user.id), {
        enterprises: enterprises
      })
      setUser({...user, enterprises:enterprises})
      setRename(false)
    } catch(e) {
      console.log(e)
      throw toast.error("Não foi possivél alterar o nome desta empresa.", {position: "bottom-right"})
    }
  }

  function OnToast(){
    if(nameEnterprise.trim().length > 2){
      if(nameEnterprise === user.enterprises[index].name){
        return setRename(false)
      }
      return toast.promise(ChangeName(), {pending:"Alterando nome da empresa.", success:"O nome da empresa foi alterado com sucesso."}, {position: "bottom-right"})
    }
    toast.error('O nome de uma empresa precisa ter no minímo 3 letras.')
  }

  return (
    <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black z-50 top-[0px] left-0'>
      <div className='bg-primary w-[400px] max-lsm:w-[320px] rounded-[4px] flex flex-col'>
        <div  className='bg-[rgba(126,181,163,1)] w-full h-[15px] rounded-t-[4px]'/>
        <div className='px-[10px]'>
          <p className='text-[24px] max-lsm:text-[20px] mt-[10px] text-left'>Altere o nome da sua empresa</p>
          <div className='mt-[15px] '>
              <p className='self-start text-[20px] max-lsm:text-[18px] justify-self-start text-left'>Nome da empresa:</p>
              <input required value={nameEnterprise} maxLength={25} onChange={(text) => setNameEnterprise(text.target.value)} className='w-full text-[20px] max-sm:text-[18px] bg-transparent border-[2px] border-black p-[3px] rounded-[4px] ' placeholder='Digite o novo nome'/>
          </div>
        </div>
        <div className='flex w-full justify-end gap-4 bg-hilight self-end pr-[10px] py-[10px] rounded-b-[4px] mt-[25px]'>
          <button onClick={() => setRename(false)} className='bg-strong/40 border-[2px] border-strong hover:scale-[1.10] duration-300 p-[3px]  rounded-[8px] text-[18px] text-white '>Cancelar</button>
          <button onClick={() => OnToast()} className={`${nameEnterprise.trim().length > 0 ? "bg-[rgba(126,181,163,0.40)] border-[rgba(126,181,163,1)]": "bg-strong/30 border-strong text-white" } border-2 hover:scale-[1.10]  duration-300 py-[3px] px-[10px] rounded-[8px] text-[18px] text-white `}>Alterar</button>
        </div>
      </div>
    </div>
  )
}

export default Rename