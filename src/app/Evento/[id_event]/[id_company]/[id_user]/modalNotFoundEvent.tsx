import Image from "next/image"
import Link from "next/link"

function ModalDelete() {
    return (
        <div className='cursor-default w-screen h-screen fixed  flex justify-center items-center text-black dark:text-white z-50 top-[0px] left-[0px] font-[400]'>
            <div className="fixed w-screen h-screen bg-black/70 backdrop-blur-sm" />
            <div className='bg-primary dark:bg-dprimary w-[500px] max-sm:w-[350px] rounded-[15px] flex flex-col items-center justify-center drop-shadow-[0_5px_5px_rgba(0,0,0,0.40)]'>
                <div className='bg-red w-full h-[15px] rounded-t-[15px]' />
                <div className="flex flex-col items-center justify-center p-[20px]">
                    <h1 className="text-red text-[25px] text-center">Não foi possivel encontrar este evento!</h1>
                    <Image src='/image/eventNotFound.png' alt="Erro 404" width={400} height={0} priority />
                    <p className="ml-[15px] relative list-disc text-[18px] text-center">
                        Peça para o administrador gerar o link novamente ou acesse a este evento entrando no
                        <Link href={'/'} className="font-[600] text-[20px] underline ml-[5px]">
                            2Docs
                        </Link></p>
                </div>
            </div>
        </div>
    )
}

export default ModalDelete
