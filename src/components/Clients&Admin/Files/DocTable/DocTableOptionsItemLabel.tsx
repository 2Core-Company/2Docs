import { ComponentProps, HTMLAttributes, InputHTMLAttributes } from "react"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { twMerge } from "tailwind-merge";

interface DocTableOptionsItemLabelProps extends HTMLAttributes<HTMLParagraphElement> {
    children: string
}

export function DocTableOptionsItemLabel({ children, ...rest }: DocTableOptionsItemLabelProps) {
    return(
        <p {...rest} className={twMerge("text-[16px] text-[#686868] group-hover:text-[#fff]", rest.className)}>
            { children }
        </p>
    )
}