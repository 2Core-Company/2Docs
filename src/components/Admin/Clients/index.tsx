import React, { Suspense } from "react";
import TableClients from "./tableClients";
import 'react-loading-skeleton/dist/skeleton.css'


function ComponentClients() {
  return (
    <section className="bg-primary dark:bg-dprimary text-black">
      <p  className="font-poiretOne text-[40px] max-sm:text-[35px] dark:text-white mt-[40px]">Clientes</p>
      <Suspense fallback={<SkeletonTableClients />}>
        <TableClients/>
      </Suspense>
    </section>
  );
}
export default ComponentClients;



export function SkeletonTableClients(){
  const array = [1, 2, 3 ,4, 5, 6, 7, 8, 9, 10]
  return (
    <div className="py-[5px] min-h-[400px] w-full flex flex-col  border-[2px] border-terciary dark:border-dterciary mt-[30px] max-md:mt-[15px] rounded-[8px]">
      <div className="mt-[5px] flex justify-between mx-[20px] max-sm:mx-[5px]">
        <div className={'w-[15%] h-[25px] bg-terciary rounded-[4px] animate-pulse'}  />
        <div className={'w-[50%] h-[25px] bg-terciary rounded-[4px] animate-pulse'}  />
        <div className={'w-[15%] h-[25px] bg-terciary rounded-[4px] animate-pulse'}  />
        <div className={'w-[15%] h-[25px] bg-terciary rounded-[4px] animate-pulse'}  />
      </div>

      {array.map((index) => {
        return (
          <>
            <div  className="w-full h-[2px] bg-terciary mt-[10px] animate-pulse"/>
            <div key={index} className="mt-[10px] flex justify-between mx-[20px] max-sm:mx-[5px] border-top">
              <div className={'w-[25px] h-[25px] bg-terciary rounded-[4px] animate-pulse'}  />
              <div className={'w-[15%] h-[25px] bg-terciary rounded-[4px] animate-pulse'}  />
              <div className={'w-[25%] h-[25px] bg-terciary rounded-[4px] animate-pulse'}  />
              <div className={'w-[15%] h-[25px] bg-terciary rounded-[4px] animate-pulse'}  />
              <div className={'w-[15%] h-[25px] bg-terciary rounded-[4px] animate-pulse'}  />
              <div className={'w-[15%] h-[25px] bg-terciary rounded-[4px] animate-pulse'}  />
            </div>
          </>

        )
      })}

      <div className="flex justify-between mx-[20px] max-sm:mx-[5px] mt-[20px]">
        <div className={'w-[10%] h-[25px] bg-terciary rounded-[4px] animate-pulse'}  />
        <div className={'w-[25%] h-[25px] bg-terciary rounded-[4px] animate-pulse'}  />
        <div className={'w-[10%] h-[25px] bg-terciary rounded-[4px] animate-pulse'}  />
      </div>
    </div>
  )
}
