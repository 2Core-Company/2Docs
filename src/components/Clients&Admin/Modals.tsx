interface Props{
  message:string
  subMessage1?:string
  subMessage2?:string
  user?:string
  childModal?:Function
  setModal?:Function
}

function Modal({message, subMessage1, subMessage2, user, childModal, setModal}:Props) {
    return (
      <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black z-50 top-[0px] left-0'>
        <div className='bg-primary w-[500px] max-lsm:w-[320px] rounded-[4px] flex flex-col'>
          <div  className='bg-red w-full h-[15px] rounded-t-[4px]'/>
          <div className=' px-[10px]'>
            <p className='text-[26px] mt-[10px]'>{message}</p>
            <p className='font-[600] text-[26px] font-poppins overflow-hidden whitespace-nowrap text-ellipsis w-full'>{user}</p>
            {subMessage1 != undefined ? 
              <div className='flex items-start mt-[20px]'>
                <div className='min-w-[20px] min-h-[20px] bg-hilight rounded-full ml-[20px]'/>
                <p className='text-[20px] ml-[8px]'>{subMessage1}</p>
              </div>
            :<></>}

            {subMessage2 != undefined ? 
              <div className='flex items-start mt-[20px]'>
                <div className='min-w-[20px] min-h-[20px] bg-hilight rounded-full ml-[20px]'/>
                <p className='text-[20px] ml-[8px]'>{subMessage2}</p>
              </div>
            :<></>}
          </div>
          <div className='flex w-full justify-end gap-4 bg-hilight self-end  pr-[10px] py-[10px] rounded-b-[4px] mt-[25px]'>
            <button onClick={() => setModal({status: false, message: "", subMessage1: "", subMessage2: "", user:"" })} className='bg-strong hover:scale-[1.10] duration-300 p-[5px]  rounded-[8px] text-[20px] text-white '>Cancelar</button>
            <button onClick={() => childModal()} className='bg-red/40 border-2 border-red hover:scale-[1.10]  duration-300 p-[5px] rounded-[8px] text-[20px] text-white '>Confirmar</button>
          </div>
        </div>
      </div>
    )
}

export default Modal