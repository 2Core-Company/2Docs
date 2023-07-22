import { useState, InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface DocTableFileCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    checked?: boolean
}

export function DocTableFileCheckbox({ checked = false, ...rest }: DocTableFileCheckboxProps) {
    return(
        <div className="flex justify-center items-center w-full h-full">
            <input {...rest} aria-label="Checkbox Arquivo" type="checkbox" checked={checked} className={twMerge(`w-[20px] h-[20px] cursor-pointer ${checked ? "" : "appearance-none"} accent-gray-600 rounded border-[1px] border-[#666]`, rest.className)}/>
        </div>
    )
}