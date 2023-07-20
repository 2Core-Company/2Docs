import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface DocTableGlobalActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: string
    dropdownState?: boolean
}

export function DocTableGlobalAction({ children, dropdownState = false, ...rest }: DocTableGlobalActionProps) {
    return(
        <button {...rest} className={twMerge(`hover:brightness-[.85] min-w-[109px] text-center border-[2px] border-[#119E70] py-[8px] px-[8px] rounded-[8px] text-[18px] max-sm:text-[14px] cursor-pointer bg-[#10B981] text-white ${dropdownState ? "max-lg:hidden" : ""}`, rest.className)} >
            { children }
        </button>
    )
}