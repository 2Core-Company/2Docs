import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React from 'react'
import { db } from '../../../../firebase';
import { Notification } from '../../../types/notification';

interface PropsGetNotifications {
    id_company:string
    addressee:string
}

export async function GetNotifications({id_company, addressee}:PropsGetNotifications) {
    const notifications: Notification[] = []
    const dateNow = new Date().setHours(0, 0, 0, 0)
    const q = query(collection(db, "notifications", id_company, addressee), where('date', '>=', dateNow), orderBy('date', 'asc'));
  
    const querySnapshot: any = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data: Notification = {
        id: doc.data()?.id,
        photo_url:doc.data()?.photo_url,
        nameSender:doc.data()?.nameSender,
        description:doc.data()?.description,
        date:doc.data()?.date
      }
        notifications.push(data)
    });
    return notifications
}

