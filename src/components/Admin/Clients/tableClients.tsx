'use client'
import React, { use, useContext, useEffect, useState } from "react";
import ArrowFilter from "../../../../public/icons/arrowFilter.svg";
import Image from "next/image";
import { DataUser } from "../../../types/users";
import Options from "./options";
import { FilterFixed, FilterAlphabetical, FilterStatus, FilterDate } from "../../../Utils/Other/Filters";
import { FormatDate, FormatDateSmall } from "../../../Utils/Other/FormatDate";
import { GetUsers } from "../../../Utils/Firebase/Users/GetUsers";
import { DisableUser } from "./DisableUser";
import { WindowsAction } from "../../../types/others";
import { toast } from "react-toastify";
import { adminContext } from '../../../app/Context/contextAdmin';
import { MagnifyingGlassIcon, DrawingPinFilledIcon } from "@radix-ui/react-icons";
import EditUser from "./editUser";
import CreateUser from "./createUser";
import * as HoverCard from '@radix-ui/react-hover-card';
import ModalEvent from "../Calendar/modalEvent";

function TableClients() {
  const [showItens, setShowItens] = useState<{ min: number; max: number }>({ min: -1, max: 10 });
  const [loading, setLoading] = useState(false)
  const { dataAdmin } = useContext(adminContext);
  const [users, setUsers] = useState<DataUser[]>([]);
  const [userEdit, setUserEdit] = useState<any>();
  const [windowsAction, setWindowsAction] = useState<WindowsAction>({ createUser: false, updateUser: false });
  const [pages, setPages] = useState<number>(0);
  const [menu, setMenu] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("")
  const domain = window.location.origin
  const [actionFilters, setActionFilters] = useState<{ name: 'desc' | 'asc', date: 'desc' | 'asc', status: 'desc' | 'asc' }>({ name: 'desc', date: 'desc', status: 'desc' })
  const [modalEvent, setModalEvent] = useState(false)

  // <--------------------------------- GetUser --------------------------------->
  useEffect(() => {
    if (dataAdmin) {
      GetAllUser()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataAdmin]);

  useEffect(() => {
    if (searchText.length > 0) {
      setPages(Math.ceil(users.filter((user) => user.name.toUpperCase().includes(searchText.toUpperCase())).length / 10));
      setShowItens({ min: -1, max: 10 })
    } else {
      setPages(Math.ceil(users.length / 10));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  async function GetAllUser() {
    const result = await GetUsers({ id_company: dataAdmin.id_company, permission: dataAdmin.permission, admin_id: dataAdmin.id });
    if (result) {
      setPages(Math.ceil(result.length / 10));
      setUsers(FilterFixed(result));
    }
  }

  // <--------------------------------- Create User --------------------------------->
  const childToParentCreate = (childdata: DataUser) => {
    const allUsers = [...users];
    allUsers.push(childdata);
    ResetConfig(allUsers);
  };

  const closedWindow = () => {
    setWindowsAction({ createUser: false, updateUser: false });
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
    setUsers(users);
  }

  function formatDate(date) {
    if (window.innerWidth > 1280) {
      return FormatDate(date)
    } else {
      return FormatDateSmall(date);
    }
  }

  function FilterName() {
    const result = FilterAlphabetical({ data: users, action: actionFilters.name })
    var type
    if (actionFilters.name === 'asc') {
      type = 'desc'
    } else if (actionFilters.name === 'desc') {
      type = 'asc'
    }
    setUsers(result)
    setActionFilters({ name: type, date: 'desc', status: 'desc' })
  }

  function FilterDateHere() {
    const result = FilterDate({ data: users, action: actionFilters.date })
    var type
    if (actionFilters.date === 'asc') {
      type = 'desc'
    } else if (actionFilters.date === 'desc') {
      type = 'asc'
    }
    setUsers(result)
    setActionFilters({ name: 'desc', date: type, status: 'desc' })
  }

  function FilterStatusHere() {
    const result = FilterStatus({ data: users, action: actionFilters.status })
    var type
    if (actionFilters.status === 'asc') {
      type = 'desc'
    } else if (actionFilters.status === 'desc') {
      type = 'asc'
    }
    setUsers(result)
    setActionFilters({ name: 'desc', date: 'desc', status: type })
  }

  return (
    <>
      {modalEvent && <ModalEvent action={"create"} modalEvent={modalEvent} setModalEvent={setModalEvent} />}
      {windowsAction.createUser ? <CreateUser contextAdmin={dataAdmin} childToParentCreate={childToParentCreate} closedWindow={closedWindow} /> : <></>}
      {windowsAction.updateUser ? <EditUser contextAdmin={dataAdmin} user={userEdit} childToParentEdit={childToParentEdit} closedWindow={closedWindow} /> : <></>}
      <div className="relative min-h-[600px] w-full flex flex-col max-sm:text-[16px]  border-[2px] border-terciary dark:border-dterciary mt-[30px] max-md:mt-[15px] rounded-[8px] mb-[10px]">
        <div className="my-[15px] flex justify-between px-[25px] max-sm:px-[20px] max-lsm:px-[10px] ">
          <div className="text-[18px] max-sm:text-[17px] flex items-center bg-transparent">
            <p className="mr-[20px] max-sm:mr-[20px] font-[500] dark:text-white whitespace-nowrap">
              {users.length}
              <span className="text-[#AAA] dark:text-white"> Clientes</span>
            </p>
            <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px] dark:text-white" />
            <input type="text" onChange={(text) => setSearchText(text.target.value)} placeholder="Buscar" className="px-[10px] w-[250px] outline-[#646464] dark:text-white text-black max-sm:w-[200px] max-lsm:w-[150px] bg-transparent dark:placeholder:text-gray-500" />
          </div>

          <div className={`text-center flex gap-[10px] max-lg:absolute max-lg:flex-col max-lg:px-[5px] max-lg:pb-[5px] max-lg:right-[0px] max-lg:top-[0px] ${menu ? 'max-lg:bg-trasparent' : 'max-lg:bg-[#e2e2e2]'} dark:max-lg:bg-[#2b2b2b] rounded-[8px]`}>
            <button id="MenuTable" aria-label="Botão menu da tabela" onClick={() => setMenu(!menu)} className={`cursor-pointer flex-col hidden max-lg:flex absolute right-[15px] ${menu ? 'mt-[15px]' : 'mt-[20px]'} `}>
              <div className={`rounded-[100px] w-[25px] h-[3px] bg-[#6B6B6B] dark:bg-white ${menu ? "" : "rotate-45"}`} />
              <div className={`rounded-[100px] w-[25px] h-[3px] bg-[#6B6B6B] dark:bg-white my-[4px] ${menu ? "" : "hidden"}`} />
              <div className={`rounded-[100px] w-[25px] h-[3px] bg-[#6B6B6B]  dark:bg-white ${menu ? "" : "rotate-[135deg] mt-[-3px]"}`} />
            </button>

            <button disabled={dataAdmin?.permission < 2} onClick={() => setModalEvent(true)} className={`flex items-center border hover:bg-emerald-600  bg-emerald-500 boder-[1px] border-emerald-600 py-[6px] px-[10px] rounded-[8px] max-sm:text-[14px] duration-100 max-lg:mt-[40px] text-white ${menu ? "max-lg:hidden" : ""}`}>
              Novo Evento
            </button>

            <button disabled={dataAdmin?.permission < 2 || loading ? true : false} onClick={() => setWindowsAction({ ...windowsAction, createUser: true })} className={`hover:bg-emerald-600 duration-100 bg-emerald-500 border-[1px] border-emerald-600  text-white py-[6px] px-[10px] rounded-[8px] max-sm:text-[14px] cursor-pointer ${menu ? "max-lg:hidden" : ""}`}>
              Cadastrar
            </button>
          </div>
        </div>

        {users.filter((user) => searchText != "" ? user.name?.toUpperCase().includes(searchText.toUpperCase()) : true).length > 0 ? (
          <div>
            {/* <--------------------------------- HeadTable ---------------------------------> */}
            <div className="w-full grid grid-cols-[repeat(2,1fr)_250px_130px_100px]
              max-2xl:grid-cols-[repeat(2,1fr)_200px_100px_80px]
              max-xl:grid-cols-[repeat(2,1fr)_100px_100px_60px]
              max-lg:grid-cols-[repeat(2,1fr)_100px_90px_50px]
              max-md:grid-cols-[repeat(2,1fr)_90px_50px]
              max-sm:grid-cols-[repeat(1,1fr)_90px_50px]
              max-lsm:grid-cols-[repeat(1,1fr)_65px_50px]
              gap-x-[30px] max-lg:gap-x-[10px] font-[500] border-y-[1px] border-y-neutral-400  bg-[#DDDDDD] items-center px-[15px] max-md:px-[10px] max-sm:px-[5px]">

              <div>
                <button onClick={() => FilterName()} className="hover:opacity-[.65] text-left flex items-center cursor-pointer  py-[15px] ">
                  <p className="dark:text-white">Nome</p>
                  <Image alt="Imagem de uma flecha" className={`ml-[2px] ${actionFilters.name === 'asc' ? "rotate-180" : ""}`} src={ArrowFilter} />
                </button>
              </div>


              <p className="text-left dark:text-white max-sm:hidden"> Email </p>

              <div className="max-md:hidden">
                <button onClick={() => FilterDateHere()} className="hover:opacity-[.65] flex items-center cursor-pointer  py-[15px] ">
                  <p className="text-left dark:text-white hidden xl:block">Data de cadastro</p>
                  <p className="text-left dark:text-white hidden max-xl:block">Data</p>
                  <Image alt="Imagem de uma flecha" className={`ml-[2px] ${actionFilters.date === 'asc' ? "rotate-180" : ""}`} src={ArrowFilter} />
                </button>
              </div>

              <div>
                <button onClick={() => FilterStatusHere()} className="hover:opacity-[.65] flex items-center cursor-pointer  py-[15px] ">
                  <p className="dark:text-white">Status</p>
                  <Image alt="Imagem de uma flecha" className={`ml-[2px]  ${actionFilters.status === 'asc' ? "rotate-180" : ""}`} src={ArrowFilter} />
                </button>
              </div>

              <p className="dark:text-white py-[15px] text-center">Ações</p>
            </div>


            {/* <--------------------------------- BodyTable ---------------------------------> */}
            {users
              .filter((user) => searchText != "" ? user.name?.toUpperCase().includes(searchText.toUpperCase()) : true)
              .map((user: DataUser, index: number) => {
                var checked = user.checked;
                if (showItens.min < index && index < showItens.max) {
                  return (
                    <div key={index} className={`text-[#686868] w-full py-[10px] grid 
                      grid-cols-[repeat(2,1fr)_250px_130px_100px]
                      max-2xl:grid-cols-[repeat(2,1fr)_200px_100px_80px]
                      max-xl:grid-cols-[repeat(2,1fr)_100px_100px_60px]
                      max-lg:grid-cols-[repeat(2,1fr)_100px_90px_50px]
                      max-md:grid-cols-[repeat(2,1fr)_90px_50px]
                      max-sm:grid-cols-[repeat(1,1fr)_100px_50px]
                      max-lsm:grid-cols-[repeat(1,1fr)_80px_50px]
                      border-b-[1px] border-b-neutral-400 px-[15px] max-md:px-[10px] max-sm:px-[5px] gap-x-[30px] max-lg:gap-x-[10px] max-sm:gap-x-[5px] font-[500] items-center max-xl:text-[16px]`}>

                      <div className="min-w-full flex items-center">
                        {user.fixed && <DrawingPinFilledIcon className="w-[16px] h-[16px] text-[#666666] mr-[5px]" />}
                        <Image src={user.photo_url} width={35} height={35} alt="Perfil" className="rounded-full w-[35px] h-[35px] mr-[10px] max-md:w-[30px] max-md:h-[30px]" />
                        <p className="text-black overflow-hidden whitespace-nowrap text-ellipsis dark:text-white">
                          {user.name}
                        </p>
                      </div>

                      <p className="text-left overflow-hidden whitespace-nowrap text-ellipsis dark:text-white max-sm:hidden">
                        {user.email}
                      </p>

                      <p className="w-full max-md:hidden text-left dark:text-white text-ellipsis overflow-hidden whitespace-nowrap">
                        {formatDate(user.created_date!)}
                      </p>

                      {user.verifiedEmail ?
                        user.disabled ?
                          <div className="w-full max-w-[90px] bg-red/20 border-red text-[#c50000] border-[1px] text-[17px] max-lg:text-[16px] rounded-[5px] text-center max-lsm:w-[20px] max-lsm:h-[20px] max-lsm:justify-self-center max-lsm:rounded-full max-lsm:bg-red">
                            <p className="max-lsm:hidden">Inativo</p>
                          </div>

                          :

                          <div className="w-full max-w-[90px] bg-greenV/20 border-greenV text-[#00920f] border-[1px] text-[17px]  max-lg:text-[16px] rounded-[5px] text-center max-lsm:w-[20px] max-lsm:h-[20px] max-lsm:justify-self-center max-lsm:rounded-full max-lsm:bg-greenV">
                            <p className="max-lsm:hidden">Ativo</p>
                          </div>
                        :
                        <HoverCard.Root>
                          <HoverCard.Trigger className="w-full max-w-[90px] bg-[rgba(224,187,0,0.2)] border-[#E0BC00] text-[#9A8200] border-[1px] text-[17px]  max-lg:text-[16px] rounded-[5px] text-center max-lsm:w-[20px] max-lsm:h-[20px] max-lsm:justify-self-center max-lsm:rounded-full max-lsm:bg-[#E0BC00]">
                            <p className="max-lsm:hidden">Pendente</p>
                          </HoverCard.Trigger>
                          <HoverCard.Portal>
                            <HoverCard.Content className="bg-primary drop-shadow-[0_5px_5px_rgba(0,0,0,0.40)] rounded-[5px] px-[15px] py-[10px]">
                              <p className="text-black">Este usuário não verificou o email.</p>
                              <HoverCard.Arrow className="fill-primary" />
                            </HoverCard.Content>
                          </HoverCard.Portal>
                        </HoverCard.Root>
                      }

                      <div className="w-full flex justify-center items-center">
                        <Options
                          loading={loading}
                          domain={domain}
                          idUser={user.id}
                          windowsAction={windowsAction}
                          user={user}
                          users={users}
                          FilterFixed={FilterFixed}
                          setUserEdit={setUserEdit}
                          setWindowsAction={setWindowsAction}
                          setUsers={setUsers}
                          ResetConfig={ResetConfig}
                          setLoading={setLoading}
                          dataAdmin={dataAdmin}
                        />
                      </div>
                    </div>
                  );
                }
              })
            }
          </div>
        ) : (
          <div className="w-full h-[550px] flex justify-center items-center flex-col">
            {users.length <= 0 ?
              <>
                <Image src={'/icons/nullClient.svg'} width={80} height={80} onClick={() => setWindowsAction({ ...windowsAction, createUser: true })} alt="" className="cursor-pointer w-[170px] h-[170px]" />
                <p className="font-poiretOne text-[40px] max-sm:text-[30px] text-[#686868]  text-center dark:text-white">
                  Nada por aqui... <br />Cadastre seu primeiro cliente!
                </p>
              </>

              :
              <>
                <Image src={'/icons/notFoundSearch.svg'} width={80} height={100} alt="" className="w-[200px] h-[250px]" />
                <p className="font-poiretOne text-[40px] max-sm:text-[30px] text-[#686868]  text-center dark:text-white">
                  Nenhum resultado foi encontrado.
                </p>
              </>
            }

          </div>
        )}


        {/* <--------------------------------- NavBar table ---------------------------------> */}
        {users.filter((user) => searchText != "" ? user.name?.toUpperCase().includes(searchText.toUpperCase()) : true).length > 0 ? (
          <div className="flex items-center justify-between w-full px-[15px] max-md:px-[10px] max-sm:px-[5px] py-[10px] mt-auto">
            <button onClick={() => { showItens.max / 10 != 1 ? setShowItens({ min: showItens.min - 10, max: showItens.max - 10 }) : toast.error('Não existe paginas inferiores.') }}
              className={`hover:brightness-[.85] border-[1px] rounded-[8px] px-[10px] py-[3px] cursor-pointer ${showItens.max / 10 == 1 ? "bg-[#D9D9D9] dark:bg-dhilight border-[#9E9E9E] dark:border-dterciary text-[#AAAAAA] dark:text-dterciary" : "bg-hilight dark:bg-white text-white dark:text-black"}`}>
              Anterior
            </button>

            <p className="text-[#686868] dark:text-white flex items-center">{`Página ${showItens.max / 10} de ${pages}`}</p>

            <button onClick={() => { showItens.max / 10 != pages ? setShowItens({ min: showItens.min + 10, max: showItens.max + 10 }) : toast.error('Não existe paginas superiores.') }}
              className={`hover:brightness-[.85] border-[1px] rounded-[8px] px-[10px] py-[3px] cursor-pointer ${showItens.max / 10 == pages ? " bg-[#D9D9D9] dark:bg-dhilight border-[#9E9E9E] dark:border-dterciary text-[#AAAAAA] dark:text-dterciary" : "bg-hilight dark:bg-white text-white dark:text-black"}`}>
              Proximo
            </button>
          </div>

        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default TableClients;
