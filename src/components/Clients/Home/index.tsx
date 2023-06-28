
import { useContext } from 'react'
import { userContext } from '../../../app/Context/contextUser';
import { companyContext } from '../../../app/Context/contextCompany';
import Event from './event';
import StatusOfAccount from './statusOfAccount';


function ComponentHome () {

  return (
    <div className="bg-primary dark:bg-dprimary w-full h-full min-h-screen px-[50px] max-md:px-[10px] flex flex-col text-black dark:text-white">
      <div className='mt-[50px]'>
        <div className='flex items-center'>
          <p  className=' font-poiretOne text-[40px]'>Home</p>
          <StatusOfAccount />
        </div>
        <Event />
      </div>
    </div>
  )
}

export default ComponentHome 