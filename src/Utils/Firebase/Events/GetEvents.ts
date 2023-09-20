import { collection, getDocs, limit, or, orderBy, query, where } from "firebase/firestore";
import { Dispatch } from "react";
import { db } from "../../../../firebase";
import { Event } from "../../../types/event";

interface PropsGetEventsUser {
  id_company: string
  id_user: string
  setEvents: Dispatch<React.SetStateAction<Event[] | undefined>>
}

export async function GetLimitedEventsUser({ id_company, id_user, setEvents }: PropsGetEventsUser) {
  const eventsConcluded: Event[] = []
  const dateNow = new Date().setHours(0, 0, 0, 0)
  const events: Event[] = []
  const q = query(collection(db, "companies", id_company, "events"), where('id_user', '==', id_user), where('dateStarted', '<=', dateNow), orderBy('dateStarted', 'asc'), orderBy('complete', 'asc'), limit(8));

  const querySnapshot: any = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data: Event = {
      id: doc.data()?.id,
      id_user: doc.data()?.id_user,
      id_folder: doc.data()?.id_folder,
      id_enterprise: doc.data()?.id_enterprise,
      userName: doc.data()?.userName,
      nameEnterprise: doc.data()?.nameEnterprise,
      title: doc.data()?.title,
      description: doc.data()?.description,
      complete: doc.data()?.complete,
      dateStarted: doc.data()?.dateStarted,
      dateEnd: doc.data()?.dateEnd,
      definedDate: doc.data()?.definedDate,
      repeatMonths: doc.data()?.repeatMonths,
      limitedDelivery: doc.data()?.limitedDelivery,
      lastModify: doc.data()?.lastModify,
      delivered:doc.data()?.delivered,
      tasks: doc.data()?.tasks,
    }

    if (data.complete) {
      eventsConcluded.push(data)
    } else {
      events.push(data)
    }
  });

  if (events[0]) {
    setEvents(events.concat(eventsConcluded))
  }
}


interface PropsGetEventsOpenToUser {
  id_company: string
  id_user: string
}

export async function GetEventsOpenToUser({ id_company, id_user }: PropsGetEventsOpenToUser) {
  const dateNow = new Date().setHours(0, 0, 0, 0)
  const dateMax = new Date().setHours(23, 59, 59, 59)
  const events: Event[] = []
  const q = query(collection(db, "companies", id_company, "events"), where('id_user', '==', id_user), where('complete', '==', false), where('dateStarted', '<=', dateNow), orderBy('dateStarted', 'asc'));

  const querySnapshot: any = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if(doc.data().limitedDelivery && doc.data().dateEnd < dateMax){
      return
    }
    const data: Event = {
      id: doc.data()?.id,
      id_user: doc.data()?.id_user,
      id_folder: doc.data()?.id_folder,
      id_enterprise: doc.data()?.id_enterprise,
      userName: doc.data()?.userName,
      nameEnterprise: doc.data()?.nameEnterprise,
      title: doc.data()?.title,
      description: doc.data()?.description,
      complete: doc.data()?.complete,
      dateStarted: doc.data()?.dateStarted,
      dateEnd: doc.data()?.dateEnd,
      definedDate: doc.data()?.definedDate,
      repeatMonths: doc.data()?.repeatMonths,
      limitedDelivery: doc.data()?.limitedDelivery,
      lastModify: doc.data()?.lastModify,
      delivered:doc.data()?.delivered,
      tasks: doc.data()?.tasks,
    }
    events.push(data)

  });
  if (events[0]) {
    return events
  }
}


interface PropsGetEventLate {
  id_company: string
  id_user: string
}

export async function GetEventLate({ id_company, id_user }: PropsGetEventLate) {
  const dateNow = new Date().getTime()
  const events: Event[] = []
  const q = query(collection(db, "companies", id_company, "events"), where('id_user', '==', id_user), where('dateEnd', '<', dateNow), where('delivered', '==', false), limit(1));

  const querySnapshot: any = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data: Event = {
      id: doc.data()?.id,
      id_user: doc.data()?.id_user,
      id_folder: doc.data()?.id_folder,
      id_enterprise: doc.data()?.id_enterprise,
      userName: doc.data()?.userName,
      nameEnterprise: doc.data()?.nameEnterprise,
      title: doc.data()?.title,
      description: doc.data()?.description,
      complete: doc.data()?.complete,
      dateStarted: doc.data()?.dateStarted,
      dateEnd: doc.data()?.dateEnd,
      definedDate: doc.data()?.definedDate,
      repeatMonths: doc.data()?.repeatMonths,
      limitedDelivery: doc.data()?.limitedDelivery,
      lastModify: doc.data()?.lastModify,
      delivered:doc.data()?.delivered,
      tasks: doc.data()?.tasks,
    }
    events.push(data)
  });
  return events
}

interface PropsGetEventsInOneMonth {
  id_company: string
  id_user: string
  dateMin: number
  dateMax: number
}

export async function GetEventsInOneMonth({ id_company, id_user, dateMin, dateMax }: PropsGetEventsInOneMonth) {
  const dateMaxWithLastSeconds = new Date(dateMax).setHours(23, 59, 59, 59)
  const eventsConcluded: Event[] = []
  const events: Event[] = []
  const q = query(collection(db, "companies", id_company, "events"), where('id_user', '==', id_user), where('dateStarted', '>=', dateMin), where('dateStarted', '<=', dateMaxWithLastSeconds), orderBy('dateStarted', 'asc'), orderBy('complete', 'asc'));
  try {
    const querySnapshot: any = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data: Event = {
        id: doc.data()?.id,
        id_user: doc.data()?.id_user,
        id_folder: doc.data()?.id_folder,
        id_enterprise: doc.data()?.id_enterprise,
        userName: doc.data()?.userName,
        nameEnterprise: doc.data()?.nameEnterprise,
        title: doc.data()?.title,
        description: doc.data()?.description,
        complete: doc.data()?.complete,
        dateStarted: doc.data()?.dateStarted,
        dateEnd: doc.data()?.dateEnd,
        definedDate: doc.data()?.definedDate,
        repeatMonths: doc.data()?.repeatMonths,
        limitedDelivery: doc.data()?.limitedDelivery,
        lastModify: doc.data()?.lastModify,
        delivered:doc.data()?.delivered,
        tasks: doc.data()?.tasks,
      }

      if (data.complete) {
        eventsConcluded.push(data)
      } else {
        events.push(data)
      }
    });

    if (events[0]) {
      return events.concat(eventsConcluded)
    }
  } catch (e) {
    throw e
  }
}


interface PropsGetEvent{
  id_company: string
  id_event: string
}

export async function GetEvent({ id_company, id_event}: PropsGetEvent) {
  const events: Event[] = []
  const q = query(collection(db, "companies", id_company, "events"), where('id', '==', id_event));

  const querySnapshot: any = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data: Event = {
      id: doc.data()?.id,
      id_user: doc.data()?.id_user,
      id_folder: doc.data()?.id_folder,
      id_enterprise: doc.data()?.id_enterprise,
      userName: doc.data()?.userName,
      nameEnterprise: doc.data()?.nameEnterprise,
      title: doc.data()?.title,
      description: doc.data()?.description,
      complete: doc.data()?.complete,
      dateStarted: doc.data()?.dateStarted,
      dateEnd: doc.data()?.dateEnd,
      definedDate: doc.data()?.definedDate,
      repeatMonths: doc.data()?.repeatMonths,
      limitedDelivery: doc.data()?.limitedDelivery,
      lastModify: doc.data()?.lastModify,
      delivered:doc.data()?.delivered,
      tasks: doc.data()?.tasks
    }
    events.push(data)
  });

  if (events[0]) {
    return events[0]
  }
}