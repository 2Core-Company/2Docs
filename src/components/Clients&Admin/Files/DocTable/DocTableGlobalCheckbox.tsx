import { InputHTMLAttributes, useState } from "react";
import { twMerge } from "tailwind-merge";
import iconMiddleLine from "public/icons/checkboxmiddleline.svg";

interface DocTableGlobalCheckboxProps extends InputHTMLAttributes<HTMLInputElement>{
    handle: boolean
    half: boolean
}

export function DocTableGlobalCheckbox({handle, half, ...rest}: DocTableGlobalCheckboxProps) {
    return(
        <div className="flex justify-center items-center border-[1px] border-r-[#9E9E9E] w-full h-full">
            <input {...rest} type="checkbox" aria-label="Checkbox Global" className={twMerge(`relative peer w-[20px] h-[20px] cursor-pointer ${handle ? "" : "appearance-none"} accent-gray-600 shrink-0 rounded border-[2px] border-[#666]`, rest.className)} />
            {half &&
                <svg width="14" height="2" className={`absolute pointer-events-none fill-gray-600`} viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line y1="1" x2="14" y2="1" stroke="#666666" strokeWidth="2"/>
                </svg>
            }
        </div>
    )
}