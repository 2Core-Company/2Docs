import React from 'react'
import { TbShare2 } from 'react-icons/tb'
import { AiOutlinePlusSquare } from 'react-icons/ai'
import { FaTimes } from 'react-icons/fa'
import { ImArrowDown } from 'react-icons/im'


interface Props {
    closePrompt: () => void;
    doNotShowAgain: () => void;
}

export default function AddToIosSafari(props: Props) {
    const { closePrompt, doNotShowAgain } = props;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 pb-12 px-4">
            <div onClick={closePrompt} className='fixed w-screen h-screen bg-black/50 top-0 left-0' />
            <div className="relative bg-primary p-4 h-full rounded-xl flex flex-col justify-around items-center text-center">
                <button className="absolute top-0 right-0 p-3" onClick={closePrompt}>
                    <FaTimes className="text-2xl" />
                </button>
                <p className="text-lg">Para a melhor experiência, recomendamos instalar o aplicativo 2Docs em sua tela inicial!</p>
                <div className="flex gap-2 items-center text-lg mt-[20px]">
                    <p>Clique no Icone</p>
                    <TbShare2 className="text-4xl" />
                </div>
                <div className="flex flex-col gap-2 items-center text-lg w-full px-4 mt-[20px]">
                    <p>Role para baixo e clique em:</p>
                    <div className="bg-zinc-800 flex justify-between items-center w-full px-4 py-2 rounded-lg text-white">
                        <p>Adicionar na Tela Inicial</p>
                        <AiOutlinePlusSquare className="text-2xl" />
                    </div>
                </div>
                <button className="border-2 p-1 mt-[20px] border-black px-[15px] rounded-md" onClick={doNotShowAgain}>Não mostrar novamente</button>
                <ImArrowDown className="text-4xl absolute -bottom-[50px] text-white animate-bounce z-50" />
            </div>
        </div>
    )
}
