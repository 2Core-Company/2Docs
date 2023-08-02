import React, { useContext } from "react";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { toast } from "react-toastify";
import { DataUser } from "../../../types/users";
import * as Switch from "@radix-ui/react-switch";
import { themeContext } from "../../../hooks/useTheme";
import { Enterprise } from "../../../types/others";
import { Folders } from "../../../types/folders";
import { v4 as uuidv4 } from 'uuid';
import * as Dialog from '@radix-ui/react-dialog';
import { PlusIcon } from "@radix-ui/react-icons";
import { loadingContext } from "../../../app/Context/contextLoading";
import { adminContext } from "@/src/app/Context/contextAdmin";

interface Props {
  user: DataUser;
  enterprise: Enterprise;
  id: string;
  id_company: string;
  setUser: Function;
}

function CreateFolder({ user, enterprise, id, id_company, setUser }: Props) {
  const { loading, setLoading } = useContext(loadingContext)
  const folders: Folders[] = enterprise.folders;
  const [dataFolder, setDataFolder] = useState({ color: '#005694', name: '' })
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [createFolder, setCreateFolder] = useState<boolean>(false);
  const toastCreateFolder = { pending: "Criando pasta...", success: "Pasta criada." }
  const { theme } = useContext(themeContext);
  const { dataAdmin } = useContext(adminContext);

  async function VerifyDataFolder() {
    if (dataFolder.name.toLocaleUpperCase() === 'MEUS') {
      return toast.error('Você não pode criar uma pasta com o nome "Meus"')
    }

    if (folders.find((folder) => folder.name === dataFolder.name)) {
      return toast.error("Já existe uma pasta com esse nome.");
    }

    if (!dataFolder.color) {
      return toast.error("Escolha uma cor para a pasta.");
    }

    if (dataFolder.name.length < 4) {
      return toast.error("Dê um nome com no minímo 4 caracteres.");
    }

    const result = await toast.promise(CreateFolder(), toastCreateFolder)
  }

  //Função de criar pasta
  async function CreateFolder() {
    folders.push({
      name: dataFolder.name,
      color: dataFolder.color,
      isPrivate: isPrivate,
      singleDownload: false,
      onlyMonthDownload: false,
      timeFile: 3, //Permanent
      id: uuidv4()
    });

    const index = user.enterprises.findIndex((data) => enterprise.id === data.id)
    user.enterprises[index] = enterprise

    try {
      setLoading(true)
      await updateDoc(doc(db, "companies", id_company, "clients", id), {
        enterprises: user.enterprises,
      });
      setUser({ ...user, enterprises: user.enterprises });
      setCreateFolder(false);
    } catch (err) {
      console.log(err);
    }

    setLoading(false)
  }


  return (
    <Dialog.Root open={createFolder} onOpenChange={setCreateFolder}>
      <Dialog.Trigger disabled={loading || dataAdmin.permission < 2} className={`bg-emerald-500 border border-[#119E70] dark:bg-white cursor-pointer text-white dark:text-black p-[5px] flex justify-center items-center rounded-[8px] text-[17px] max-sm:text-[14px] max-lsm:text-[12px] duration-100 hover:bg-emerald-600`}>
        <PlusIcon width={18} height={18} className='mr-[5px]' />
        Criar
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 z-20" />
        <Dialog.Content className="bg-primary data-[state=open]:animate-contentShow fixed top-[50%] rounded-[15px] left-[50%] w-[500px] max-lsm:w-[320px] overflow-hidden  translate-x-[-50%] translate-y-[-50%] focus:outline-none z-20 max-h-[95%] overflow-y-auto">
          <div className={`bg-[${dataFolder.color}] w-full h-[15px] rounded-t-[4px]`} />
          <div className="px-[30px] py-[20px]">
            <p className="text-[26px] font-[500] dark:text-white">
              Criar Nova Pasta
            </p>
            <p className="text-[20px] mt-[15px] font-[500] dark:text-white">
              Alterar nome da pasta:
            </p>
            <input placeholder="Digite o nome da pasta" onChange={(text) => setDataFolder({ ...dataFolder, name: text.target.value })} maxLength={20} className="mt-[5px] w-[80%] bg-transparent border-black dark:border-white border-[1px] rounded-[8px] text-[20px] max-sm:text-[18px] dark:text-white dark:placeholder:text-gray-500 max-lsm:text-[16px] px-[15px] py-[8px] outline-none" />
            <p className="text-[20px] mt-[15px] font-[500] dark:text-white">
              Cor da pasta:
            </p>
            <div className="gap-x-[10px] flex items-center mt-[5px]">
              <div onClick={() => setDataFolder({ ...dataFolder, color: "#005694" })} className={`w-[30px] h-[30px] bg-[#005694] rounded-[4px] hover:scale-105 cursor-pointer ${dataFolder.color === "#005694" ? "border-[#0093FF] border-[3px]" : <></>}`} />
              <div onClick={() => setDataFolder({ ...dataFolder, color: "#C7A03C" })} className={`w-[30px] h-[30px] bg-[#C7A03C] rounded-[4px] hover:scale-105 cursor-pointer ${dataFolder.color === "#C7A03C" ? "border-[#0093FF] border-[3px]" : <></>}`} />
              <div onClick={() => setDataFolder({ ...dataFolder, color: "#248B2E" })} className={`w-[30px] h-[30px] bg-[#248B2E] rounded-[4px] hover:scale-105 cursor-pointer ${dataFolder.color === "#248B2E" ? "border-[#0093FF] border-[3px]" : <></>}`} />
              <div onClick={() => setDataFolder({ ...dataFolder, color: "#BE0000" })} className={`w-[30px] h-[30px] bg-[#BE0000] rounded-[4px] hover:scale-105 cursor-pointer ${dataFolder.color === "#BE0000" ? "border-[#0093FF] border-[3px]" : <></>}`} />
              <div onClick={() => setDataFolder({ ...dataFolder, color: "#E135D0" })} className={`w-[30px] h-[30px] bg-[#E135D0] rounded-[4px] hover:scale-105 cursor-pointer ${dataFolder.color === "#E135D0" ? "border-[#0093FF] border-[3px]" : <></>}`} />
              <div onClick={() => setDataFolder({ ...dataFolder, color: "#000000" })} className={`w-[30px] h-[30px] bg-[#000000] rounded-[4px] hover:scale-105 cursor-pointer ${dataFolder.color === "#000000" ? "border-[#0093FF] border-[3px]" : <></>}`} />
              <div onClick={() => setDataFolder({ ...dataFolder, color: "#9E9E9E" })} className={`w-[30px] h-[30px] bg-[#9E9E9E] rounded-[4px] hover:scale-105 cursor-pointer ${dataFolder.color === "#9E9E9E" ? "border-[#0093FF] border-[3px]" : <></>}`} />
            </div>
            <div className="flex mt-5 items-center">
              {theme == "light" ? (
                <Switch.Root
                  className="w-[42px] h-[25px] bg-blackA9 rounded-full relative shadow-[0_2px_10px] shadow-blackA7 focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black outline-none cursor-pointer"
                  id="airplane-mode"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                  onClick={() => setIsPrivate((value) => !value)}
                  checked={isPrivate}
                >
                  <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA7 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                </Switch.Root>
              ) : (
                <Switch.Root
                  className="w-[42px] h-[25px] bg-white/30 rounded-full relative shadow-[0_2px_10px] shadow-blackA7 focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-white outline-none cursor-pointer"
                  id="airplane-mode"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                  onClick={() => setIsPrivate((value) => !value)}
                  checked={isPrivate}
                >
                  <Switch.Thumb
                    className={`block w-[21px] h-[21px] bg-black rounded-[50%] shadow-[0_2px_2px] shadow-blackA7 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]`}
                  />
                </Switch.Root>
              )}
              <p className="text-[20px] ml-3 font-[500] dark:text-white">
                Pasta Privada?
              </p>
            </div>
          </div>

          <div className="flex justify-between px-[30px] bg-[#D9D9D9] font-[500] py-[15px] border border-[#AAAAAA] rounded-b-[15px]">
            <Dialog.Close className="cursor-pointer hover:bg-[#cecbcb] duration-100 px-[10px] py-[8px] border border-[rgba(104,104,104,0.7)] rounded-[8px] text-[#5C5C5C]">
              Cancelar
            </Dialog.Close>

            <button onClick={() => VerifyDataFolder()} className="cursor-pointer bg-[rgba(16,185,129,0.3)] border border-greenV hover:bg-[rgba(16,185,129,0.5)] duration-100 px-[10px] py-[8px] rounded-[8px] text-[#117856] ">
              Confirmar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>

  );
}

export default CreateFolder;

