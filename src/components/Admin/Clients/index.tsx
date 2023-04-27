"use client";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import React, { useState, useContext, useEffect } from "react";
import { userContext } from '../../../app/Context/contextUser';
import EditUser from "./editUser";
import CreateUser from "./createUser";
import { toast } from "react-toastify";
import TableClients from "./tableClients";
import { DataUser } from "../../../types/users";
import { WindowsAction } from "../../../types/others";
import DeletUser from "./deletUser";
import LightModeSwitch from "../../Clients&Admin/LightModeSwitch";
import { GetUsers } from "../../../Utils/Firebase/GetUsers";
import { DisableUser } from "./DisableUser";

function ComponentClients() {
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

  // <--------------------------------- Delete User --------------------------------->
  const childToParentDelet = (childdata: DataUser[]) => {
    ResetConfig(childdata);
  };

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

  return (
    <section className="bg-primary dark:bg-dprimary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black">

      <LightModeSwitch />
      <div className="w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]">
        <p className="font-poiretOne text-[40px] dark:text-white">Clientes</p>
        <div className=" w-full relative border-[2px] border-terciary dark:border-dterciary mt-[30px] max-md:mt-[15px] rounded-[8px]">
          <div className="mt-[10px] flex justify-between mx-[20px] max-sm:mx-[5px]">
            <div className="flex items-center bg-transparent">
              <p className="mr-[20px] max-sm:mr-[5px] text-[20px] font-[500] max-md:text-[18px] max-sm:text-[16px] max-lsm:text-[14px] dark:text-white">
                {users.length}{" "}
                <span className="text-black dark:text-white">Clientes</span>
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
              <DeletUser menu={menu} selectUsers={selectUsers} users={users} childToParentDelet={childToParentDelet}/>
              <button onClick={() => toast.promise( GetFunctionDisableUser(), toastDisable)} className={`cursor-pointer border-[2px] p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${selectUsers.length > 0 ? "bg-blue/40 border-blue text-white": "bg-hilight border-terciary text-strong"} ${menu ? "max-lg:hidden" : ""}`}>
                Trocar Status
              </button>
              <button onClick={() => setWindowsAction({ ...windowsAction, createUser: true })} className={`bg-black text-white p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] cursor-pointer ${menu ? "max-lg:hidden" : ""}`}>
                + Cadastrar
              </button>
            </div>
          </div>
          
          <TableClients
            searchText={searchText}
            users={users}
            pages={pages}
            windowsAction={windowsAction}
            SelectUsers={SelectUsers}
            setUserEdit={setUserEdit}
            setWindowsAction={setWindowsAction}
            setUsers={setUsers}
          />
        </div>
      </div>

      {windowsAction.createUser ? 
      ( 
        <CreateUser contextUser={dataUser} childToParentCreate={childToParentCreate} closedWindow={closedWindow} />
      ) : (
        <></>
      )}

      {windowsAction.updateUser ? 
      (
        <EditUser contextUser={dataUser} user={userEdit} childToParentEdit={childToParentEdit} closedWindow={closedWindow}/>
      ) : (
        <></>
      )}
    </section>
  );
}
export default ComponentClients;
