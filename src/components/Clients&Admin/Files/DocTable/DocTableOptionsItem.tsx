import { ComponentProps, HTMLAttributes, ReactNode } from "react"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { twMerge } from "tailwind-merge";

interface DocTableOptionsItemProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
    dropdownClassName?: ComponentProps<'div'>['className']
}

export function DocTableOptionsItem({ children, dropdownClassName, ...rest }: DocTableOptionsItemProps) {
    return(
        <DropdownMenu.Item className={twMerge("group cursor-pointer hover:outline-none hover:bg-[#10B981] mx-[3px] rounded", dropdownClassName)}>
            <div {...rest} className='flex items-center gap-[4px] px-[7px] py-[2px]'>
                { children }
            </div>
        </DropdownMenu.Item>
    )
}