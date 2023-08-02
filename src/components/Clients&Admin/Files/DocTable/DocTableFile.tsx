import { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface DocTableFileProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

export function DocTableFile({ children, ...rest }: DocTableFileProps) {
    return(
        <div {...rest} className={twMerge("w-full grid gap-x-[15px] border-b-[1px] border-b-[#d2d2d2] py-[18px] items-center max-sm:gap-x-[10px]", rest.className)}>
            { children }
        </div>
    )
}