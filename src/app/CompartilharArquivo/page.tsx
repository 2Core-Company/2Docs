import React from 'react'
import Image from 'next/image'
import DrawerFile from '../../../public/icons/drawerFile.svg'

function ShareFile() {
  return (
    <div className='flex flex-col items-center'>
      <div className='mt-[20px] w-[60%] max-2xl:w-[75%] max-xl:w-[80%] max-lg:w-[85%] max-sm:w-[90%] flex flex-col items-center'>
        <p className='text-[50px] max-2xl:text-[45px] max-xl:text-[40px] max-lg:text-[35px] max-md:text-[30px] max-sm:text-[25px]  text-black font-poiretOne font-[700] text-center'>Este arquivo foi compartilhado com você, clique no botão abaixo para fazer download.</p>
        <Image src={DrawerFile} width={150} height={50} alt="Gaveta com documentos" className='mt-[20px] max-xl:w-[140px] max-lg:w-[130px] max-md:w-[120px] max-sm:w-[110px] max-lsm:w-[100px]'/>
        <div className='text-[20px] max-lsm:text-[18px] w-full max-w-[500px] bg-hilight mt-[20px] px-[15px] py-[5px] rounded-[10px] shadow-[0_2px_10px_1px_rgba(0,0,0,0.5)] flex flex-col'>
          <p className='text-black text-ellipsis w-full overflow-hidden'><span className='font-[600]'>Nome: </span>Arquivo de fatura</p>
          <p className='text-black text-ellipsis w-full overflow-hidden'><span className='font-[600]'>Compartilhado por: </span>2Core</p>
          <p className='text-black text-ellipsis w-full overflow-hidden'><span className='font-[600]'>Data de Upload: </span> 12 de Fevereiro</p>
          <Image src={`/icons/${'images'}.svg`} alt="Imagem simbolizando o tipo de arquivo" width={70} height={40} className="self-center mt-[15px] max-sm:w-[60px] max-lsm:w-[50px]"/>
          <div className='flex justify-center mt-[15px]'>
            <button className='bg-[rgba(3,238,46,0.20)] px-[10px] max-lsm:px-[8px] py-[5px] max-lsm:py-[3px] max-lsm:text-[16px] rounded-[8px] hover:scale-105 text-black border-[1px] border-greenV'>Download</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShareFile