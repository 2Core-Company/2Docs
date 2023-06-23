interface Props {
  setModal:Function
  childModal:Function
}

function Modal({childModal, setModal}:Props) {
  return (
    <div className='w-screen h-screen fixed bg-black/40 backdrop-blur-[4px] flex justify-center items-center text-black dark:text-white z-50 top-[0px] left-0'>
      <div className='bg-primary dark:bg-dprimary w-[400px] max-lsm:w-[320px] rounded-[4px] flex flex-col text-[18px]'>
        <div  className='bg-red w-full h-[15px] rounded-t-[4px]'/>
        <p className='px-[20px] text-left text-[22px] mt-[20px]'>Tem certeza que deseja sair da sua conta?</p>
        <div className='flex w-full justify-end gap-4 bg-[#D9D9D9] dark:bg-dhilight self-end  pr-[10px] py-[10px] rounded-b-[4px] mt-[25px]'>
          <button onClick={() => setModal(false)} className='bg-strong dark:bg-dstrong duration-100 px-[5px] py-[3px] rounded-[8px]  text-white cursor-pointer hover:brightness-[.85]'>
            Cancelar
          </button>
          
          <button onClick={() => childModal()} style={{border:'1px solid', borderColor:'rgba(255,0,0,0.30)'}} className='bg-[rgba(255,0,0,0.30)] duration-100 px-[5px] py-[3px] rounded-[8px] text-white cursor-pointer hover:brightness-[.85]'>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal