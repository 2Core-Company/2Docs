import React, { useState } from "react";
import ArrowFilter from "../../../../public/icons/arrowFilter.svg";
import Image from "next/image";
import iconNullClient from "../../../../public/icons/nullClient.svg";
import iconSearchUser from "../../../../public/icons/searchUser.svg";
import { DataUser, DataUserContext } from "../../../types/users";
import Options from "./options";
import { FilterFixed, FilterAlphabetical, FilterStatus, FilterDate } from "../../../Utils/Other/Filters";
import { FormatDate, FormatDateSmall } from "../../../Utils/Other/FormatDate";
import { toast } from "react-toastify";
import { WindowsAction } from "../../../types/others";

interface Props {
  users: DataUser[];
  searchText:string;
  pages: number;
  windowsAction: WindowsAction;
  SelectUsers: Function;
  setUserEdit: Function;
  setUsers:Function;
  setWindowsAction: Function;
  ResetConfig:Function;
  dataAdmin: DataUserContext;
}

function TableClients({users, searchText, pages, windowsAction, setUsers, SelectUsers, setUserEdit, setWindowsAction, ResetConfig, dataAdmin}: Props) {
  const [showItens, setShowItens] = useState<{ min: number; max: number }>({min: -1,max: 10,});
  const [filter, setFilter] = useState<{name: boolean;date: boolean;status: boolean;}>({ name: false, date: false, status: false });

  function formatDate(date: string) {
    if (window.screen.width > 1250) {
      return FormatDate(date)
    } else {
      return FormatDateSmall(date);
    }
  }

  return (
    <div>
      {users.filter((user) =>  searchText != "" ?  user.name?.toUpperCase().includes(searchText.toUpperCase()) : true).length > 0 ? (
        <>
          {/* <--------------------------------- HeadTable ---------------------------------> */}
          <div className="w-full mt-[10px] grid grid-cols-[20px__repeat(2,1fr)_200px_65px_60px] max-lg:grid-cols-[20px__repeat(2,1fr)_65px_60px] max-md:grid-cols-[20px__1fr_65px_60px] px-[5px] gap-x-[15px] text-[18px] font-[500] border-y-[1px] border-y-neutral-400  bg-neutral-300  items-center py-[5px]">
            <input aria-label="checkbox demonstrativo" type="checkbox" disabled={true} className="w-[20px] h-[20px]"/>

            <button onClick={() => (setFilter({...filter, name: !filter.name, status: false, date: false}), FilterAlphabetical({dataFilter:users, filter:filter, setReturn:setUsers}))} className="text-left flex items-center cursor-pointer">
              <p className="dark:text-white">Nome</p>
              <Image alt="Imagem de uma flecha" className={`ml-[2px] ${filter.name ? "rotate-180" : ""}`}  src={ArrowFilter} />
            </button>

            <p className="text-left max-md:hidden dark:text-white "> Email </p>

            <button onClick={() => (setFilter({...filter, date: !filter.date, status: false, name: false}), FilterDate({dataFilter:users, filter:filter, setReturn:setUsers}))} className="max-lg:hidden flex items-center cursor-pointer">
              <p className="text-left dark:text-white">Data de cadastro</p>
              <Image alt="Imagem de uma flecha" className={`ml-[2px] ${filter.date ? "rotate-180" : ""}`} src={ArrowFilter}/>
            </button>

            <button onClick={() => ( setFilter({...filter, status: !filter.status, name: false, date: false}), FilterStatus({dataFilter:users, filter:filter, setReturn:setUsers}))} className="flex items-center cursor-pointer">
              <p className="dark:text-white">Status</p>
              <Image alt="Imagem de uma flecha" className={`ml-[2px]  ${filter.status ? "rotate-180" : ""}`} src={ArrowFilter}/>
            </button>

            <p className="dark:text-white">Ações</p>
          </div>


            {/* <--------------------------------- BodyTable ---------------------------------> */}
            {users
            .filter((user) =>  searchText != "" ?  user.name?.toUpperCase().includes(searchText.toUpperCase()) : true)
            .map((user: any, index:number) => {
              var checked = user.checked;
              if (showItens.min < index && index < showItens.max) {
                return (
                  <div key={index} className={`w-full gap-y-[5px] grid grid-cols-[20px__repeat(2,1fr)_200px_65px_60px] max-lg:grid-cols-[20px__repeat(2,1fr)_65px_60px] max-md:grid-cols-[20px__1fr_65px_60px] border-b-[1px] border-b-neutral-400 px-[5px] gap-x-[15px] text-[18px] font-[500] items-center py-[5px] ${user.fixed ? 'bg-neutral-300' : ''}`}>
                    <input aria-label="Selecionar Usuário" type="checkbox" checked={checked} onChange={(e) => (checked = e.target.value === "on" ? true : false)} onClick={() => SelectUsers(index)} className="cursor-pointer  w-full h-[20px]"/>

                    <div className="max-w-[350px] max-2xl:max-w-[250px] max-md:max-w-[380px] max-sm:max-w-[200px] max-lsm:max-w-[130px] flex items-center">
                      <Image src={user.photo_url} width={35} height={35} alt="Perfil" className="rounded-full w-[35px] h-[35px] mr-[5px] max-md:w-[30px] max-md:h-[30px]"/>
                      <p className="overflow-hidden whitespace-nowrap text-ellipsis dark:text-white">
                        {user.name}
                      </p>
                    </div>

                    <p className="text-left max-md:hidden overflow-hidden whitespace-nowrap text-ellipsis dark:text-white">
                      {user.email}
                    </p>

                    <p className="w-full max-lg:hidden text-left dark:text-white">
                      {formatDate(user.created_date)}
                    </p>

                    {
                      user.status ? 
                      ( <p className="w-full bg-red/20 border-red text-[#c50000] border-[1px] max-sm:text-[16px] rounded-[5px] text-center">Inativo</p>) 
                    : 
                      (<p className="w-full bg-greenV/20 border-greenV text-[#00920f] border-[1px] max-sm:text-[16px] rounded-[5px] text-center"> Ativo </p>)
                    }

                    <div className="w-full flex justify-center items-center">
                      <Options
                        idUser={user.id}
                        windowsAction={windowsAction}
                        user={user}
                        users={users}
                        FilterFixed={FilterFixed}
                        setUserEdit={setUserEdit}
                        setWindowsAction={setWindowsAction}
                        setUsers={setUsers}
                        ResetConfig={ResetConfig}
                        dataAdmin={dataAdmin}
                      />
                    </div>
                  </div>
                );
              }
            })}
        </> 
      ) : (
        <div className="w-full h-full flex justify-center items-center flex-col">
          <Image src={users.length <= 0 ? iconNullClient : iconSearchUser} width={80} height={80} onClick={() => setWindowsAction({ ...windowsAction, createUser: true })} alt="Foto de uma mulher, clique para cadastrar um cliente" className="cursor-pointer w-[170px] h-[170px]"/>
          <p className="font-poiretOne text-[40px] max-sm:text-[30px] text-center dark:text-white">
            Nada por aqui... <br />{" "}
            {users.length <= 0 ? "Cadastre seu primeiro cliente!" : "Nenhum resultado foi encontrado."}
          </p>
        </div>
      )}
      

      {/* <--------------------------------- NavBar table ---------------------------------> */}
      {users.filter((user) =>  searchText != "" ?  user.name?.toUpperCase().includes(searchText.toUpperCase()) : true).length > 0 ? (
        <div className="flex items-center justify-between w-full px-[5px] my-[5px]">
          <button onClick={() => { showItens.max / 10 != 1 ?  setShowItens({min: showItens.min - 10, max: showItens.max - 10}): toast.error('Não existe paginas inferiores.')}}
            className={`rounded-[4px] px-[5px] py-[2px] text-[18px] max-sm:text-[16px] max-lsm:text-[14px] cursor-pointer ${showItens.max / 10 == 1 ? "bg-hilight dark:bg-dhilight border-terciary dark:border-dterciary text-terciary dark:text-dterciary" : "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black" }`}>
            Anterior
          </button>
          <p className="dark:text-white flex items-center">{`Página ${showItens.max / 10} de ${pages}`}</p>
          <button onClick={() => {showItens.max / 10 != pages ? setShowItens({min: showItens.min + 10, max: showItens.max + 10}) : toast.error('Não existe paginas superiores.')}}
            className={`rounded-[4px] px-[5px] py-[2px] text-[18px] max-sm:text-[16px] max-lsm:text-[14px] cursor-pointer ${showItens.max / 10 == pages ? " bg-hilight dark:bg-dhilight border-terciary dark:border-dterciary text-terciary dark:text-dterciary" : "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black"}`}>
            Proximo
          </button>
        </div>

      ) : (
        <></>
      )}
    </div>
  );
}

export default TableClients;
