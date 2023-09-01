import React from 'react'
import Link from 'next/link'
import { FaTimes } from 'react-icons/fa';


interface Props {
    closePrompt: () => void;
    doNotShowAgain: () => void;
}

export default function AddToOtherBrowser(props: Props) {
    const { closePrompt, doNotShowAgain } = props;
    const searchUrl = `https://www.google.com/search?q=add+to+home+screen+for+common-mobile-browsers`;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 pb-12 px-4 flex flex-col items-center justify-around">
            <div onClick={closePrompt} className='fixed w-screen h-screen bg-black/50 top-0 left-0' />
            <div className="relative bg-primary p-4 h-full rounded-xl flex flex-col justify-around items-center text-center">
                <button className="absolute top-0 right-0 p-3" onClick={closePrompt}>
                    <FaTimes className="text-2xl" />
                </button>
                <p className="text-lg mt-[20px]">Para a melhor experiência, recomendamos instalar o aplicativo 2Docs em sua tela inicial!</p>
                <div className="flex flex-col gap-4 items-center text-lg mt-[20px]">
                    <p>Infelizmente, não foi possível determinar qual navegador você está usando. Por favor, pesquise como instalar um aplicativo da web para o seu navegador.</p>
                    <Link className="text-blue-300 bg-zinc-800 w-full py-[10px] rounded-lg text-white" href={searchUrl} target='_blank'>Tente achar aqui</Link>
                </div>
                <button className="border-2 p-1 mt-[20px] border-black px-[15px] rounded-md " onClick={doNotShowAgain}>Não mostrar novamente</button>
            </div>

        </div>
    )
}