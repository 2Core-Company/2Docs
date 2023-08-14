import React, { useContext, useEffect, useState } from 'react'
import { userContext } from '../../../app/Context/contextUser'
import { GetLimitedEventsUser } from '../../../Utils/Firebase/Events/GetEvents'
import { Event } from '../../../types/event'
import ShowEvents from '../../Clients&Admin/Calendar/showEvents'

function Events() {
    const { dataUser } = useContext(userContext)
    const [events, setEvents] = useState<Event[]>([])
    
    useEffect(() => {
        GetEvents()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function GetEvents() {
        await GetLimitedEventsUser({ id_company: dataUser.id_company, id_user: dataUser.id, setEvents })
    }


    return (
        <div className='mt-[20px] max-sm:mt-[10px] '>
            <p className='text-zinc-700 font-[200] text-[28px] max-sm:text-[25px]'>Eventos disponíveis</p>
            <ShowEvents events={events} from={'dashboard'} id_user={dataUser.id} nameUser={undefined}/>
        </div>
    )
}

export default Events
