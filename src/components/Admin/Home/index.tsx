import Storage from "./storage"
import EventsActives from "./eventsActives"
import UsersOnline from "./onlineUsers"
// import getToken from "@/messagingGetToken";

function ComponentHome() {
  return (
    <div className="bg-primary dark:bg-dprimary text-black dark:text-white">
      <p className='font-poiretOne text-[40px] mt-[40px] mb-[30px]'>Home</p>
      <div className="flex gap-x-[150px] ml-[20px] max-sm:ml-[10px] flex-wrap mb-[20px]">
        <div className="xl:h-[711px] flex flex-col justify-between gap-[20px] mb-[20px]">
          <Storage />
          <UsersOnline />
        </div>
        <EventsActives />
      </div>
    </div>
  )
}

export default ComponentHome 