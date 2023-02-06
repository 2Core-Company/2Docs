'use client'
import { MagnifyingGlassIcon} from '@radix-ui/react-icons';
import React, {useState, useContext, useEffect} from 'react'
import AppContext from '../../Clients&Admin/AppContext';
import {db, auth} from '../../../../firebase'
import { collection, where, getDocs, doc, updateDoc, query } from "firebase/firestore";  
import EditUser from './editUser'
import CreateUser from './createUser'
import axios from 'axios';
import ErrorFirebase from '../../Clients&Admin/ErrorFirebase';
import { toast } from 'react-toastify';
import TableClients from './tableClients';
import {Users, WindowsAction, UsersFilter} from '../../../types/interfaces'
import DeletUser from './deletUser';

function ComponentClients(){
  const context = useContext(AppContext)
  const [users, setUsers] = useState<Users[]>([])
  const [usersFilter, setUsersFilter] = useState<UsersFilter[]>([])
  const [searchUser, setSearchUser] = useState<string>("")
  const [userEdit, setUserEdit] = useState<{}>()
  const [selectUsers, setSelectUsers] = useState<Users[]>([])
  const [windowsAction, setWindowsAction] = useState<WindowsAction>({createUser: false, updateUser: false, deletUser: false})
  const [pages, setPages] = useState<number>(0)
  const [menu, setMenu] = useState<boolean>(true)

  // <--------------------------------- GetUser --------------------------------->
  useEffect(() =>{
    if(context.dataUser){
      context.setLoading(true)
      GetUsers()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[context.dataUser])

  async function GetUsers(){
    const getUsers:Array<{checked?:boolean}> = []
      const q = query(collection(db, "users", context.dataUser.id_company, "Clientes" ), where("permission", "==", 0));
      const querySnapshot = await getDocs(q);
      const a = querySnapshot.forEach((doc) =>  getUsers.push(doc.data()));
    for(var i = 0; i < getUsers.length; i++){
      getUsers[i].checked = false
    }
    setPages(Math.ceil(getUsers.length / 10))
    setUsers(getUsers)
    setUsersFilter(getUsers)
    context.setLoading(false)
  }

  useEffect(() => {
    if(searchUser != null){
      const searchUserFilter:Array<object> = []
      for (var i = 0; i < users.length; i++) {
        if(users[i].name.toLowerCase().includes(searchUser.toLowerCase().trim())){
          searchUserFilter.push(users[i])
        }
      }
      setUsersFilter(searchUserFilter)
    }
  },[searchUser, users])

   // <--------------------------------- Delete User --------------------------------->

  const childToParentDelet = (childdata : Array<{}>) => {
    ResetConfig(childdata)
  }
  // <--------------------------------- Disable User --------------------------------->

  async function DisableUser(){
    const usersHere = [...usersFilter]
    const domain:string = new URL(window.location.href).origin
    if(selectUsers.length > 0){
      const result = await axios.post(`${domain}/api/users/disableUser`, {users: selectUsers, uid: auth.currentUser.uid})
      if(result.data.type === 'success'){
        for (let i = 0; i < selectUsers.length; i++){
          await updateDoc(doc(db, 'users', context.dataUser.id_company, "Clientes", selectUsers[i].id), {
            status: !selectUsers[i].status,
          })
          const index = usersHere.findIndex( element => element.id === selectUsers[i].id)
          usersHere[index].status = !users[index].status
          usersHere[index].checked = false
        }
        setWindowsAction({...windowsAction, createUser: false, updateUser: false, deletUser: false})
        setUsersFilter(usersHere)
        setMenu(true)
        setSelectUsers([])
      } else {
        ErrorFirebase(result.data)
      }
    } else {
      toast.error("Nenhum usuário foi selecionado")
      throw Error
    }
  }

  // <--------------------------------- Select User --------------------------------->

  async function SelectUsers(index:number){
    if(usersFilter.filter(user => user.checked === true).length <= 9){
      const users = [...usersFilter]
      users[index].checked = !users[index].checked
      const userSelect = users.filter(user => user.checked === true);
      setSelectUsers(userSelect)
      setUsersFilter(users)
    } else {
      toast.error("Você só pode selecionar 10 arquivos")
    }
  }

  // <--------------------------------- Create User --------------------------------->
  const childToParentCreate = (childdata:{}) => {
    const users = [...usersFilter]
    users.push(childdata)
    ResetConfig(users)
  }

  const closedWindow = () => {
    setWindowsAction({...windowsAction, createUser: false, updateUser: false})
  }

  // <--------------------------------- Edit User --------------------------------->

  const childToParentEdit = (childdata:{id:string}) => {
    const users = [...usersFilter]
    const index:number = users.findIndex(user => user.id == childdata.id)
    users.splice(index, 1)
    users.push(childdata)
    ResetConfig(users)
  }
  
  function ResetConfig(users:Array<{}>){
    setWindowsAction({...windowsAction, createUser: false, updateUser: false, deletUser: false})
    setUsersFilter(users)
    setPages(Math.ceil(users.length / 10))
    setMenu(true)
    setSelectUsers([])
    setUsers(users)
  }

return (
      <section className="bg-primary w-full h-full min-h-screen pb-[20px] flex flex-col items-center text-black">
        <div className='w-[85%] h-full ml-[100px] max-lg:ml-[0px] max-lg:w-[90%] mt-[50px]'>
          <p className=' font-poiretOne text-[40px]'>Clientes</p>
          <div className=' w-full relative border-[2px] border-terciary mt-[30px] max-md:mt-[15px] rounded-[8px]'>
            <div className='mt-[10px] flex justify-between mx-[20px] max-sm:mx-[5px]'>
              <div className='flex items-center bg-transparent'>
                <p className='mr-[20px] max-sm:mr-[5px] text-[20px] font-[500] max-md:text-[18px] max-sm:text-[16px] max-lsm:text-[14px]'>{users.length} <span className='text-black'>Clientes</span></p>
                <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px]"/>
                <input type="text" value={searchUser} onChange={(Text) => setSearchUser(Text.target.value)}  className='w-[300px] text-black max-lg:w-[250px] max-md:w-[200px] max-sm:w-[120px] max-lsm:w-[100px] bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px]' placeholder='Buscar' ></input>
              </div>
              <div className={`flex gap-[10px] max-lg:flex-col max-lg:absolute max-lg:right-[0] ${menu ? "" : "max-lg:bg-[#b1b0b0]"} max-lg:top-[0] max-lg:px-[5px] max-lg:pb-[5px]`}>
                <button id="MenuTable" aria-label="Botão menu da tabela" onClick={() => setMenu(!menu)} className={`flex-col self-center hidden max-lg:flex ${menu ? "mt-[10px]" : "mt-[20px]"}  mb-[10px]`}>
                  <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "rotate-45"}`}/>
                  <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black my-[8px] max-lsm:my-[5px] ${menu ? "" : "hidden"}`}/>
                  <div className={`w-[35px] max-lsm:w-[30px]  h-[3px] bg-black transition duration-500 max-sm:duration-400  ease-in-out ${menu ? "" : "rotate-[135deg] mt-[-3px]"}`}/>
                </button>
                <DeletUser menu={menu} selectUsers={selectUsers} usersFilter={usersFilter} childToParentDelet={childToParentDelet}/>
                <button onClick={() => toast.promise(DisableUser(),{pending:"Trocando status do usuário.", success:"Status trocado com sucesso.", error:"Não foi possivel trocar o status do usuário"})} className={` border-[2px] ${selectUsers.length > 0 ? "bg-blue/40 border-blue text-white" : "bg-hilight border-terciary text-strong"} p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>Trocar Status</button>
                <button onClick={() => setWindowsAction({...windowsAction, createUser:true})} className={`bg-black text-white p-[5px] rounded-[8px] text-[17px] max-sm:text-[14px] ${menu ? "max-lg:hidden" : ""}`}>+ Cadastrar</button>
              </div>
            </div>
            <TableClients usersFilter={usersFilter} setUsersFilter={setUsersFilter} users={users} pages={pages} searchUser={searchUser} setUserEdit={setUserEdit} setWindowsAction={setWindowsAction} windowsAction={windowsAction} SelectUsers={SelectUsers}/>
          </div>
        </div>
        {windowsAction.createUser ? <CreateUser childToParentCreate={childToParentCreate} closedWindow={closedWindow} /> : <></>}
        {windowsAction.updateUser ? <EditUser user={userEdit} childToParentEdit={childToParentEdit} closedWindow={closedWindow}/> : <></>}
      </section>
  )
  }
export default ComponentClients;
