"use client";
import Image from "next/image";
import { PersonIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useContext, useState } from "react";
import { adminContext } from "../../../app/Context/contextAdmin";
import Link from "next/link";
import { DataUser } from "../../../types/users";
import { Files } from "../../../types/files";
import { Enterprise } from "../../../types/others";
import Enterprises from "./enterprises";
import { useRouter } from "next/navigation";
import { getRecentFilesOfEnterprise } from "../../../Utils/Firebase/Files/getFiles";
import RecentFiles from "./recentFiles";
import Folders from "./folders";
import { userContext } from "../../../app/Context/contextUser";
import { GetUser } from "../../../Utils/Firebase/Users/GetUsers";

function ComponentFolder() {
  const params: any = useSearchParams();
  const id_user: string = params.get("id_user");
  const id_enterprise: string = params.get("id_enterprise");
  const { dataAdmin } = useContext(adminContext);
  const { dataUser } = useContext(userContext)
  const [recentFiles, setRecentFiles] = useState<Files[]>([]);
  const [user, setUser] = useState<DataUser>({ id: "", name: "", email: "", phone: "", verifiedEmail: true, id_company: "", permission: 0, photo_url: '', created_date: 0, pendencies: 0, enterprises: [], admins: [] });
  const [enterprise, setEnterprise] = useState<Enterprise>({ id: "", name: "", folders: [] });
  const router = useRouter()
  const admin = dataAdmin.id === '' ? false : true

  useEffect(() => {
    if (enterprise?.id != "") {
      const from = admin ? 'user' : 'admin'
      const id_company = admin ? dataAdmin.id_company : dataUser.id_company
      const id_userHere = admin ? id_user : dataUser.id
      getRecentFilesOfEnterprise({ id_company: id_company, id_user: id_userHere, id_enterprise: enterprise.id, from: from, setRecentFiles })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterprise]);

  useEffect(() => {
    if (admin) {
      GetUserHere()
    } else {
      setUser(dataUser)
      var enterprise = dataUser?.enterprises!.find((enterprise) => enterprise.id === id_enterprise)
      if (enterprise) {
        enterprise.folders = enterprise?.folders.filter((folder) => folder.isPrivate === false)
        setEnterprise(enterprise);
      } else {
        var enterpriseHere: Enterprise = dataUser.enterprises![0]
        enterpriseHere.folders = enterpriseHere?.folders.filter((folder) => folder.isPrivate === false)
        setEnterprise(enterpriseHere);
      }
    }

    async function GetUserHere() {
      const result = await GetUser({ id_company: dataAdmin.id_company, id_user })
      setUser(result)
      const enterprise = result?.enterprises!.find((enterprise) => enterprise.id === id_enterprise)
      if (enterprise) {
        setEnterprise(enterprise);
      } else {
        setEnterprise(result.enterprises![0]);
      }
      if (result?.admins!.length !== 0 && result?.admins.findIndex((id) => id === dataAdmin.id) === -1 && dataAdmin.permission < 3) {
        router.replace('/Dashboard/Admin/')
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-[40px]">
      <p className="font-poiretOne text-[40px] mt-[40px]">
        Empresas
      </p>

      <div className="flex items-center text-[#AAAAAA] text-[18px] max-sm:text-[16px] mt-[5px]">
        <PersonIcon className='min-w-[17px] min-h-[17px] mr-[5px]' />
        {admin ?
          <Link href={'/Dashboard/Admin/Clientes'}>{user.name}</Link>
          :
          <Link href={'/Dashboard/Clientes'}>Pessoal</Link>
        }

        <p className='mx-[8px]'>{'>'}</p>

        <Image src={'/icons/folder.svg'} priority width={15} height={15} alt='' className='h-auto mr-[5px] aspect-square' />
        <p>Pastas</p>
      </div>

      <Enterprises user={user} enterprise={enterprise} setUser={setUser} setEnterprise={setEnterprise} />

      <RecentFiles recentFiles={recentFiles} admin={admin} setRecentFiles={setRecentFiles}/>

      <Folders enterprise={enterprise} user={user} setUser={setUser} setEnterprise={setEnterprise} />
    </div>
  );
}

export default ComponentFolder;
