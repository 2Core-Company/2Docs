'use client'
import React, { useContext, useEffect, useState } from "react";
import ArrowFilter from "../../../../public/icons/arrowFilter.svg";
import Image from "next/image";
import iconNullClient from "../../../../public/icons/nullClient.svg";
import iconSearchUser from "../../../../public/icons/searchUser.svg";
import { DataUser } from "../../../types/users";
import Options from "./options";
import { FilterFixed, FilterAlphabetical, FilterStatus, FilterDate } from "../../../Utils/Other/Filters";
import { FormatDate, FormatDateSmall } from "../../../Utils/Other/FormatDate";
import { GetUsers } from "../../../Utils/Firebase/GetUsers";
import { DisableUser } from "./DisableUser";
import { WindowsAction } from "../../../types/others";
import { toast } from "react-toastify";
import { userContext } from '../../../app/Context/contextUser';
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import EditUser from "./editUser";
import CreateUser from "./createUser";

function TableClients() {
  const [showItens, setShowItens] = useState<{ min: number; max: number }>({min: -1,max: 10,});
  const [filter, setFilter] = useState<{name: boolean;date: boolean;status: boolean;}>({ name: false, date: false, status: false });
  const { dataUser } = useContext(userContext);
  const [users, setUsers] = useState<DataUser[]>([]);
  const [userEdit, setUserEdit] = useState<any>();
  const [selectUsers, setSelectUsers] = useState<DataUser[]>([]);
  const [windowsAction, setWindowsAction] = useState<WindowsAction>({createUser: false, updateUser: false});
  const [pages, setPages] = useState<number>(0);
  const [menu, setMenu] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("")
  const toastDisable = {pending: "Trocando status do usuário.", success: "Status trocado com sucesso."};

  // <--------------------------------- GetUser --------------------------------->
  useEffect(() => {
    if (dataUser) {
      GetUsers({id_company:dataUser.id_company, setPages:setPages, setUsers:setUsers});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUser]);

  // <--------------------------------- Disable User --------------------------------->
  async function GetFunctionDisableUser() {
    await DisableUser({users, selectUsers, id_company:dataUser.id_company, setMenu, setSelectUsers, setUsers})
  }

  // <--------------------------------- Select User --------------------------------->
  async function SelectUsers(index: number) {
    if (users.filter((user) => user.checked === true).length <= 9) {
      const allUsers = [...users];
      allUsers[index].checked = !allUsers[index].checked;
      const userSelect = allUsers.filter((user) => user.checked === true);
      setSelectUsers(userSelect);
      setUsers(allUsers);
    } else {
      toast.error("Você só pode selecionar 10 usuários");
    }
  }

  // <--------------------------------- Create User --------------------------------->
  const childToParentCreate = (childdata: DataUser) => {
    const allUsers = [...users];
    allUsers.push(childdata);
    ResetConfig(allUsers);
  };

  const closedWindow = () => {
    setWindowsAction({createUser: false,updateUser: false});
  };

  // <--------------------------------- Edit User --------------------------------->
  const childToParentEdit = (childdata: DataUser) => {
    const allUsers = [...users];
    const index: number = allUsers.findIndex((user) => user.id == childdata.id);
    allUsers.splice(index, 1);
    allUsers.push(childdata);
    ResetConfig(allUsers);
  };

  function ResetConfig(users: DataUser[]) {
    closedWindow()
    setPages(Math.ceil(users.length / 10));
    setMenu(true);
    setSelectUsers([]);
    setUsers(users);
  }

  function formatDate(date: string) {
    if (window.screen.width > 1250) {
      return FormatDate(date)
    } else {
      return FormatDateSmall(date);
    }
  }

  return (
    <div className="min-h-[400px] w-full flex flex-col  border-[2px] border-terciary dark:border-dterciary mt-[30px] max-md:mt-[15px] rounded-[8px]">
      {windowsAction.createUser ? <CreateUser contextUser={dataUser} childToParentCreate={childToParentCreate} closedWindow={closedWindow} /> : <></>}
      {windowsAction.updateUser ? <EditUser contextUser={dataUser} user={userEdit} childToParentEdit={childToParentEdit} closedWindow={closedWindow}/> : <></>}

      <div className="mt-[10px] flex justify-between mx-[20px] max-sm:mx-[5px]">
        <div className="flex items-center bg-transparent">
          <p className="mr-[20px] max-sm:mr-[5px] text-[20px] font-[500] max-md:text-[18px] max-sm:text-[16px] max-lsm:text-[14px] dark:text-white">
            {users.length}
            <span className="text-black dark:text-white"> Clientes</span>
          </p>
          <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px] dark:text-white"/>
          <input type="text" onChange={(text) => setSearchText(text.target.value)}  placeholder="Buscar"className="w-[300px] dark:text-white text-black max-lg:w-[250px] max-md:w-[200px] max-sm:w-[120px] max-lsm:w-[100px] bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px] dark:placeholder:text-gray-500" />
        </div>
        
        <div className={`text-center flex gap-[10px] max-lg:flex-col max-lg:absolute max-lg:px-[5px] max-lg:pb-[5px] ${menu ? "max-lg:right-[10px] max-lg:top-[5px]" : "max-lg:right-[0px] max-lg:top-[0px] max-lg:bg-[#b1b0b0] dark:max-lg:bg-[#2b2b2b]"}`}>
          <button id="MenuTable" aria-label="Botão menu da tabela" onClick={() => setMenu(!menu)} className={`cursor-pointer flex-col self-center hidden max-lg:flex mb-[10px] ${menu ? "mt-[10px]" : "mt-[20px]"}`}>
            <div className={`rounded-[10px] w-[30px] max-lsm:w-[30px] h-[3px] bg-black dark:bg-white transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "rotate-45"}`}/>
            <div className={`rounded-[10px] w-[30px] max-lsm:w-[30px] h-[3px] bg-black dark:bg-white my-[4px] transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "hidden"}`}/>
            <div className={`rounded-[10px] w-[30px] max-lsm:w-[30px] h-[3px] bg-black dark:bg-white transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "rotate-[135deg] mt-[-3px]"}`}/>
          </button>

          <button onClick={() => toast.promise( GetFunctionDisableUser(), toastDisable)} className={`cursor-pointer border-[2px] p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${selectUsers.length > 0 ? "bg-blue/40 border-blue text-white": "bg-hilight border-terciary text-strong"} ${menu ? "max-lg:hidden" : ""}`}>
            Trocar Status
          </button>
          <button onClick={() => setWindowsAction({ ...windowsAction, createUser: true })} className={`bg-black text-white p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] cursor-pointer ${menu ? "max-lg:hidden" : ""}`}>
            + Cadastrar
          </button>
        </div>
      </div>
          
      {users.filter((user) =>  searchText != "" ?  user.name?.toUpperCase().includes(searchText.toUpperCase()) : true).length > 0 ? (
        <div>
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
                  <div key={index} className={`w-full gap-y-[5px] grid grid-cols-[20px__repeat(2,1fr)_200px_70px_60px] max-lg:grid-cols-[20px__repeat(2,1fr)_70px_60px] max-md:grid-cols-[20px__1fr_65px_60px] border-b-[1px] border-b-neutral-400 px-[5px] gap-x-[15px] text-[18px] font-[500] items-center py-[5px] ${user.fixed ? 'bg-neutral-300' : ''}`}>
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
                      (<p className="w-full bg-red/20 border-red text-[#c50000] border-[1px] max-sm:text-[16px] rounded-[5px] text-center">Inativo</p>) 
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
                      />
                    </div>
                  </div>
                );
              }
            })}
        </div> 
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
        <div className="flex items-center justify-between w-full px-[5px] my-[5px] mt-auto">
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
