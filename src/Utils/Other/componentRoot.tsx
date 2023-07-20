import React from 'react'

interface PropsRoot{
    children:React.ReactNode,
    title?:string
    className?:string
}

export const Component = {
    root: ({children, title, className}:PropsRoot) => {
        return (
            <>
                <p className='text-zinc-700 font-[200] text-[28px] max-sm:text-[25px]'>{title}</p>
                <div className={`bg-primary border-[1px] border-[rgba(158,158,158,0.3)] rounded-[12px] drop-shadow-lg ${className}`}>
                    {children}
                </div>
            </>
        )
    }
}