import { useState } from "react"
import { toast } from "react-toastify"

interface Props {
    message:string,
    subMessage1?:string,
    subMessage2?:string,
    confirmation:boolean
    setModal:Function
    childModal:Function
  }
  
  function ModalDelete({message, subMessage1, subMessage2, confirmation, childModal, setModal}:Props) {
        const [textConfirmation, setTextConfirmation] = useState('')

        function VerifyConfirmation(){
          if(confirmation === false){
            return childModal()
          }

          if(textConfirmation === 'Confirmar'){
              childModal()
          } else {
              toast.error('Digite confirmar no campo solicitado.')
          }
        }
    
      return (
        <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black dark:text-white z-50 top-[0px] left-0'>
          <div className='bg-primary dark:bg-dprimary w-[500px] max-lsm:w-[320px] rounded-[4px] flex flex-col'>
            <div  className='bg-red w-full h-[15px] rounded-t-[4px]'/>
            <div className=' px-[10px] text-left'>
              <p className='text-[26px] mt-[10px] text-ellipsis overflow-hidden'>{message}</p>

              {subMessage1 != undefined ? 
                <div className='flex items-start mt-[20px]'>
                  <div className='min-w-[20px] min-h-[20px] bg-hilight dark:bg-dhilight rounded-full ml-[20px]'/>
                  <p className='text-[20px] ml-[8px]'>{subMessage1}</p>
                </div>
              : <></>}
  
              {subMessage2 != undefined ? 
                <div className='flex items-start mt-[20px]'>
                  <div className='min-w-[20px] min-h-[20px] bg-hilight dark:bg-dhilight rounded-full ml-[20px]'/>
                  <p className='text-[20px] ml-[8px]'>{subMessage2}</p>
                </div>
              :<></>}
            </div>
            
            {confirmation && 
              <div className="w-full px-[30px] mt-[15px]">
                <p className="text-[18px]">Digite Confirmar</p>
                <input onChange={(text) => setTextConfirmation(text.target.value)} placeholder="exemplo: Confirmar" className="outline-none text-neutral-500 w-full bg-transparent border-black border-[1px] rounded-[4px] text-[20px] py-[2px] px-[3px]" />
              </div>
            }

            <div className='flex w-full justify-end gap-4 bg-hilight dark:bg-dhilight self-end  pr-[10px] py-[10px] rounded-b-[4px] mt-[25px]'>
              <button onClick={() => setModal({status: false, message: "", subMessage1: "", subMessage2: "", user:"" })} className='bg-strong dark:bg-dstrong hover:brightness-[.85] duration-300 p-[5px] rounded-[8px] text-[20px] text-white cursor-pointer'>Cancelar</button>
              <button onClick={() => VerifyConfirmation()} className={`bg-red/40 border-2 border-red hover:brightness-[.85]  duration-300 p-[5px] rounded-[8px] text-[20px] text-white cursor-pointer`}>Confirmar</button>
            </div>
          </div>
        </div>
      )
  }
  
  export default ModalDelete