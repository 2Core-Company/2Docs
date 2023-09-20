'use client'
import React, { useContext, useEffect, useState } from 'react'
import { companyContext } from '../../../app/Context/contextCompany'
import { GetSizeCompany } from '../../../Utils/Firebase/Company/GetSizeCompany'
import { Component } from '../../../Utils/Other/componentRoot'

function Storage() {
    const { dataCompany } = useContext(companyContext)
    const [usage, setUsage] = useState(0)

    useEffect(() => {
        GetSizeOfCompany()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function GetSizeOfCompany() {
        const result = await GetSizeCompany({ id_company: dataCompany.id })
        setUsage(result)
    }
    return (
        <div>
            <Component.root title={'Armazenamento'} className='p-[30px] max-sm:p-[20px]'>
                <div className="flex justify-between items-center gap-x-[25px] max-sm:gap-x-[20px]">
                    <div className="rotate-[180deg] w-[160px] max-sm:w-[140px] max-lsm:w-[100px] aspect-square rounded-full flex justify-center items-center ring-offset-[10px] max-sm:ring-offset-[8px] ring-0 ring-offset-[#CACACA] relative before:absolute before:w-[140px] max-sm:before:w-[120px] max-lsm:before:w-[85px] before:aspect-square before:rounded-full before:bg-primary"
                        style={{ background: `conic-gradient(#10b981 ${Math.round(((usage) / dataCompany.maxSize) * 100) * 3.6}deg, #EBEBEB 0deg)` }}>
                        <p className="font-[700] text-[28px] max-sm:text-[26px] max-lsm:text-[24px] z-10 rotate-[180deg] text-[#9E9E9E]">GB</p>
                    </div>
                    <p className="text-[26px] max-sm:text-[24px]  max-lsm:text-[22px] font-[500] text-[#686868]"><span className="text-hilight font-[600]">{usage == 0 ? 0 : (usage / 1073741824).toFixed(2)}GB</span> / {dataCompany.maxSize <  1073741824 ? (dataCompany.maxSize / 1073741824).toFixed(2) : (dataCompany.maxSize / 1073741824)}GB</p>
                </div>
            </Component.root>
        </div>
    )
}

export default Storage