import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface DocTableFileProps {
    children: ReactNode
    className?: ComponentProps<'div'>['className']
}

export function DocTableFile({ children, className }: DocTableFileProps) {
    return(
        <div className={twMerge("w-full grid gap-x-[15px] border-b-[1px] border-b-[#d2d2d2] py-[18px] items-center max-sm:gap-x-[10px]", className)}>
            { children }
        </div>
    )
}