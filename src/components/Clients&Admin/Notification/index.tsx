'use client'
import React, { useContext, useEffect } from 'react'
import { companyContext } from '../../../app/Context/contextCompany'
import { userContext } from '../../../app/Context/contextUser'
import { GetNotifications } from '../../../Utils/Firebase/Notification/GetNotifications'

function Index() {
    const { dataCompany } = useContext(companyContext)
    const { dataUser } = useContext(userContext)
    
    useEffect(() => {
        GetAllNotifications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function GetAllNotifications() {
        const addressee = dataUser.id === '' ? dataCompany.id : dataUser.id

        const result = await GetNotifications({id_company:dataCompany.id, addressee})
    }
}

export default Index