interface Props {
  setModal:Function
  childModal:Function
}

function Modal({childModal, setModal}:Props) {
  return (
    <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black dark:text-white z-50 top-[0px] left-0'>
      <div className='bg-primary dark:bg-dprimary w-[500px] max-lsm:w-[320px] rounded-[4px] flex flex-col'>
        <div  className='bg-red w-full h-[15px] rounded-t-[4px]'/>
        <div className=' px-[10px] text-left'>
          <p className='text-[26px] mt-[10px]'>Tem certeza que deseja sair da sua conta?</p>
        </div>
        <div className='flex w-full justify-end gap-4 bg-hilight dark:bg-dhilight self-end  pr-[10px] py-[10px] rounded-b-[4px] mt-[25px]'>
          <button onClick={() => setModal(false)} className='bg-strong dark:bg-dstrong hover:scale-[1.10] duration-300 p-[5px] rounded-[8px] text-[20px] text-white cursor-pointer'>Cancelar</button>
          <button onClick={() => childModal()} className='bg-red/40 border-2 border-red hover:scale-[1.10]  duration-300 p-[5px] rounded-[8px] text-[20px] text-white cursor-pointer'>Confirmar</button>
        </div>
      </div>
    </div>
  )
}

export default Modal