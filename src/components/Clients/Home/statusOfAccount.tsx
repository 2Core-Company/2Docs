import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../../app/Context/contextUser'
import { GetEventLate } from '../../../Utils/Firebase/Events/GetEvents'

function StatusOfAccount() {
    const { dataUser } = useContext(userContext)
    const [eventLate, setEventLate] = useState<{status:boolean | undefined, loading:boolean}>({status:undefined, loading: true})
    useEffect(() => {
        VerifyEventLate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    async function VerifyEventLate(){
        const result = await GetEventLate({id_user:dataUser.id, id_company:dataUser.id_company}) 
        if(result[0]){
            setEventLate({status: true, loading:false})
        } else {
            setEventLate({status: false, loading:false})
        }
    }


  return (
    <>
        {eventLate.loading === false && eventLate.status === true ?
            <div className='ml-[30px] max-md:ml-[25px] max-sm:ml-[20px] border-[2px] border-[#BE0000] rounded-full px-[20px] max-md:px-[18px] max-sm:px-[16px] py-[10px] max-md:py-[9px] max-sm:py-[8px] bg-[#F1A5A5]'>
                <p className='text-[18px] font-[500] text-[#BE0000] max-md:text-[16px] max-sm:text-[14px]'>Docs. Atrasados</p> 
            </div>
        :
            eventLate.status != undefined && 
                <div className='ml-[30px] max-md:ml-[25px] max-sm:ml-[20px] border-[2px] border-[#087E14] rounded-full px-[20px] max-md:px-[18px] max-sm:px-[16px] py-[10px] max-md:py-[9px] max-sm:py-[8px] bg-[#ADD5B1]'>
                    <p className='text-[18px] font-[500] text-[#087E14]'>Tudo em dia!</p> 
                </div>

        }
    </>

  )
}

export default StatusOfAccount