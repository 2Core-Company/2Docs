import React, { useState } from 'react'
import { db } from '../../../../firebase'
import { doc, updateDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { DataUser } from '../../../types/interfaces' 
import { v4 as uuidv4 } from 'uuid';

interface Props{
  user:DataUser
  setUser:Function
  setCreateEnterprises:Function
}

function  CreateEnterprises({user, setUser, setCreateEnterprises}:Props) {
  const [nameEmprise, setNameEmprise] = useState("")
  const messageToast = {pending:"Criando uma Empresa.", success:"Uma empresa foi criada com sucesso.", error:"Não foi possivel criar uma empresa."}
  
  async function CreateEnterprise(){
    const enterprises = user.enterprises
    const userHere = user
    enterprises.push({name:nameEmprise, id:uuidv4()})
    try{
      await updateDoc(doc(db, 'companies', user.id_company, "clients", user.id), {
        enterprises:enterprises
      })
      userHere.enterprises = enterprises
      setUser(userHere)
      setCreateEnterprises(false)
    } catch(e) {
      console.log(e)
      throw toast.update("Não foi possivél alterar o nome deste arquivo.", {position: "bottom-right"})
    }
  }

  function OnToast(e: { preventDefault: () => void; }){
    e.preventDefault()
    toast.promise(CreateEnterprise(), messageToast, {position: "bottom-right"})
  }

    return (
      <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black z-50 top-[0px] left-0'>
        <form onSubmit={OnToast} className='bg-primary w-[400px] max-lsm:w-[320px] rounded-[4px] flex flex-col'>
          <div  className='bg-[rgb(138,129,184)] w-full h-[15px] rounded-t-[4px]'/>
          <div className='px-[10px]'>
            <p className='text-[24px] max-lsm:text-[20px] mt-[10px] text-left'>Crie outra empresa</p>
            <div className='mt-[15px] '>
                <p className='self-start text-[20px] max-lsm:text-[18px] justify-self-start text-left'>Empresa:</p>
                <input required onChange={(text) => setNameEmprise(text.target.value)} maxLength={25} className='w-full text-[20px] max-sm:text-[18px] bg-transparent border-[2px] border-black p-[3px] rounded-[4px] ' placeholder='Nome da empresa'/>
            </div>
          </div>
          <div className='flex w-full justify-end gap-4 bg-hilight self-end pr-[10px] py-[10px] rounded-b-[4px] mt-[25px]'>
            <button  onClick={() => setCreateEnterprises(false)} className='bg-strong/40 border-[2px] border-strong hover:scale-[1.10] duration-300 p-[3px]  rounded-[8px] text-[18px] text-white '>Cancelar</button>
            <button type='submit' className={`${nameEmprise.length  ? "bg-[rgba(138,129,184,0.40)] border-[rgba(138,129,184,1)]": "bg-strong/30 border-strong text-white" } border-2 hover:scale-[1.10]  duration-300 py-[3px] px-[10px] rounded-[8px] text-[18px] text-white `}>Criar</button>
          </div>
        </form>
      </div>
    )
}

export default CreateEnterprises