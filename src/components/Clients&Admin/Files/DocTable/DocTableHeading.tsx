import { ReactNode, ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface DocTableHeading {
    children: ReactNode
    className?: ComponentProps<'div'>['className']
}

export function DocTableHeading({ children, className }: DocTableHeading) {
    return(
        <div className={twMerge("w-full grid gap-x-[15px] text-[18px] font-[500] border-y-[1px] border-y-[#9e9e9e] bg-[#dddddd] items-center", className)}>
            {children}
        </div>
    )
}