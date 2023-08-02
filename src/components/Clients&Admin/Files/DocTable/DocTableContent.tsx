import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface DocTableContentProps {
    children: ReactNode
    className?: ComponentProps<'div'>['className']
}

export function DocTableContent({ children, className }: DocTableContentProps) {
    return(
        <div className={twMerge("grid", className)}>
            {children}
        </div>
    )
}