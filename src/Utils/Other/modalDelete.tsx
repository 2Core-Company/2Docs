import { useState } from "react"
import { toast } from "react-toastify"
import { Modal } from "../../types/others"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

interface Props {
  modal:Modal
  setModal:Function
  childModal:Function
}
  
  function ModalDelete({modal, childModal, setModal}:Props) {
    const [textConfirmation, setTextConfirmation] = useState('')
    
    function VerifyConfirmation(){
      if(textConfirmation === 'confirmar'){
          childModal()
      } else {
          toast.error('Digite confirmar no campo solicitado.')
      }
    }
  
    return (
      <div className='cursor-default w-screen h-screen fixed  flex justify-center items-center text-black dark:text-white z-50 top-[0px] left-[0px] font-[400]'>
        <div onClick={() => setModal({status: false, title:'', subject:'', target:''})} className="w-screen h-screen top-[0px] left-[0px] fixed bg-black/30"/>
        <div className='bg-primary dark:bg-dprimary w-[500px] max-sm:w-[350px] rounded-[15px] flex flex-col drop-shadow-[0_5px_5px_rgba(0,0,0,0.40)]'>
          <div  className='bg-red w-full h-[15px] rounded-t-[15px]'/>
          <div className='px-[25px] max-sm:px-[20px] py-[5px] text-left'>
            <h4 className="mt-[10px] font-poppins text-[26px] max-sm:text-[24px] font-[500] after:w-[40px] after:h-[3px] after:block after:bg-red after:rounded-full after:ml-[3px] after:mt-[-5px]">
              {modal?.title}
            </h4>

            <p className="text-[18px] max-sm:text-[16px] text-[#5C5C5C] mt-[20px]">
              Tem certeza que deseja excluir {modal?.subject}
              <span className="font-[500]"> {modal?.target} </span>
              e todos os seus <span className="font-[500]"> documentos? </span>
            </p>

            <div className="mt-[10px] bg-[rgba(228,152,152,0.40)] rounded-[8px] flex items-center px-[15px] py-[8px] max-sm:px-[5px] max-sm:text-[14px]">
              <ExclamationTriangleIcon className="text-[#BE0000] font-[500] min-w-[18px] min-h-[18px] mr-[7px]"/>
              <p className="text-[#C43B3B]">
                <span className="text-[#BE0000] font-[500]"> Perigo: </span>
                Esta ação é irreversível.
              </p>
            </div>
          </div>
          <div className="px-[25px] mt-[15px] py-[15px] bg-[#E2E2E2] border-y-[#AAAAAA] border-y-[1px]">
            <p className="text-[#9E9E9E] max-sm:text-[14px]">Digite <span className="font-[500] text-[#838383]">confirmar</span> para continuar:</p>
            <input type='text' id='confirmation' onChange={(text) => setTextConfirmation(text.target.value)} placeholder="Exemplo: confirmar" className="bg-primary text-[18px] max-sm:text-[16px] px-[10px] py-[7px] w-full mt-[10px] border-[1px] border-[#A9A9A9] rounded-[8px]  focus:outline-none focus:ring-[#A9A9A9] focus:ring-[2px]  focus:border-[#565656]"/>
          </div>
          
          <div className='flex justify-between bg-[#D9D9D9] dark:bg-dhilight px-[25px] py-[10px] rounded-b-[15px]'>
            <button onClick={() => setModal({status: false, title:'', subject:'', target:''})} className='border-[#8B8B8B] border-[1px] duration-100 px-[12px] py-[7px] rounded-[8px] text-[#5C5C5C] cursor-pointer font-[500] focus:outline-none  focus:ring-[#686868] focus:ring-[2px] focus:border-transparent hover:bg-[#b9b9b9] max-sm:text-[14px]'>
              Cancelar
            </button>

            <button onClick={() => VerifyConfirmation()} className={`border-[#FF0000] border-[1px] bg-[#E49898] duration-100 px-[12px] py-[7px] rounded-[8px] text-[#BE0000] cursor-pointer focus:outline-none focus:ring-[2px] focus:ring-[#FF0000] focus:border-transparent font-[500] hover:bg-[#EA7777] max-sm:text-[14px]`}>
              Confirmar
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default ModalDelete
