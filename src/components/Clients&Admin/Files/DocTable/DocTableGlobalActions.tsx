import { ReactNode } from "react";

interface CommonProps {
    children: ReactNode
}

type ConditionalProps = 
    | {
        dropdownState: boolean
        setDropdownState: React.Dispatch<React.SetStateAction<boolean>>
    }
    | {        
        dropdownState?: never
        setDropdownState?: never
    };

type DocTableGlobalActionsProps = CommonProps & ConditionalProps;

export function DocTableGlobalActions({ children, dropdownState, setDropdownState }: DocTableGlobalActionsProps) {
    return(
        typeof dropdownState != undefined && setDropdownState != undefined ?
        <>
            <div className={`cursor-pointer flex gap-[20px] max-lg:flex-col ml-auto max-lg:absolute max-lg:right-[0] ${dropdownState ? "" : "max-lg:bg-white/30 dark:max-lg:bg-black/30 backdrop-blur"} max-lg:top-[0] max-lg:px-[5px] max-lg:pb-[5px]`}>
                <button id="MenuTable" aria-label="Botão menu da tabela" onClick={() => setDropdownState(!dropdownState)} className={`flex-col self-center hidden max-lg:flex ${dropdownState ? "mt-[10px]" : "mt-[20px]"}  mb-[10px]`}>
                <div className={`rounded-[10px] w-[30px] max-sm:w-[25px]  h-[3px] bg-black dark:bg-white transition duration-500 max-sm:duration-400  ease-in-out ${dropdownState ? "" : "rotate-45"}`} />
                <div className={`rounded-[10px] w-[30px] max-sm:w-[25px]  h-[3px] bg-black dark:bg-white my-[5px] ${dropdownState ? "" : "hidden"}`} />
                <div className={`rounded-[10px] w-[30px] max-sm:w-[25px]  h-[3px] bg-black dark:bg-white transition duration-500 max-sm:duration-400  ease-in-out ${dropdownState ? "" : "rotate-[135deg] mt-[-3px]"}`} />
                </button>
            </div>
            <div className="flex gap-[20px]">
                { children }
            </div>
        </> :
        <>
            { children }
        </>
    )
}