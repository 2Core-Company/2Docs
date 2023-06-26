import { useState } from "react"
import { toast } from "react-toastify"

interface Props {
  message:string,
  name?:string
  subMessage1:string,
  subMessage2:string,
  setModal:Function
  childModal:Function
}
  
  function ModalDelete({message, subMessage1, subMessage2, childModal, setModal, name}:Props) {
    const [textConfirmation, setTextConfirmation] = useState('')

    function VerifyConfirmation(){
      if(textConfirmation === 'Confirmar'){
          childModal()
      } else {
          toast.error('Digite confirmar no campo solicitado.')
      }
    }
  
    return (
      <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black dark:text-white z-50 top-[0px] left-0'>
        <div className='bg-primary dark:bg-dprimary w-[500px] max-sm:w-[350px] rounded-[4px] flex flex-col'>
          <div  className='bg-red w-full h-[15px] rounded-t-[4px]'/>
          <div className='px-[25px] py-[5px] text-left'>
            <div className="flex mt-[10px]">
              <p className='text-[20px] max-sm:text-[18px] text-ellipsis overflow-hidden'>{message} {name ? <span className="font-[600]">{`${name}?`}</span> : <></>}</p>
            </div>


            {subMessage1 != undefined ? 
              <div className='flex items-center mt-[10px] max-sm:items-start'>
                <div className='min-w-[20px] min-h-[20px] bg-[#b9b9b9] dark:bg-dhilight rounded-full max-sm:mt-[3px]'/>
                <p className='text-[18px] ml-[8px] max-sm:text-[16px]'>{subMessage1}</p>
              </div>
            : <></>}

            {subMessage2 != undefined ? 
              <div className='flex items-center mt-[10px] max-sm:items-start'>
                <div className='min-w-[20px] min-h-[20px] bg-[#b9b9b9] dark:bg-dhilight rounded-full max-sm:mt-[3px]'/>
                <p className='text-[18px] ml-[8px] max-sm:text-[16px]'>{subMessage2}</p>
              </div>
            :<></>}

            
            <p className="text-[18px] mt-[10px] max-sm:text-[16px]">Digite Confirmar</p>
            <input onChange={(text) => setTextConfirmation(text.target.value)} placeholder="exemplo: Confirmar" className="outline-none focus:border-[#015f9e] focus:border-[2px] text-neutral-500 w-full bg-transparent border-[#b9b9b9] border-[1px] rounded-[4px] text-[18px] max-sm:text-[16px]- py-[3px] px-[5px] mt-[5px]" />
          </div>
          
          <div className='flex w-full justify-end gap-4 bg-[#D9D9D9] dark:bg-dhilight self-end px-[25px] py-[10px] rounded-b-[4px] mt-[15px]'>
            <button onClick={() => setModal({status: false, message: "", subMessage1: "", subMessage2: "", user:"" })} className='bg-strong dark:bg-dstrong hover:brightness-[.85] duration-100 px-[10px] py-[5px] rounded-[8px] text-[18px] max-sm:text-[16px] text-white cursor-pointer'>Cancelar</button>
            <button onClick={() => VerifyConfirmation()} className={`bg-[rgba(255,0,0,0.30)] border-[1px] border-[#FF0000] hover:brightness-[.85]  duration-100 px-[10px] py-[5px] rounded-[8px] text-[18px] max-sm:text-[16px] text-white cursor-pointer`}>Confirmar</button>
          </div>
        </div>
      </div>
    )
  }
  
  export default ModalDelete