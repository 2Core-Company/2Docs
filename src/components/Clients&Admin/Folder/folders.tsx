import { GearIcon, LockClosedIcon, LockOpen1Icon, MagnifyingGlassIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';
import { db } from '../../../../firebase';
import { adminContext } from '../../../app/Context/contextAdmin';
import { FolderCfg } from '../../../types/folders';
import { Enterprise, Modal } from '../../../types/others';
import { DataUser } from '../../../types/users';
import ModalDelete from '../../../Utils/Other/modalDelete';
import ModalCreateFolder from './modalCreateFolder';
import DeleteFolder from './DeleteFolder';
import ModalFolderConfig from './modalFolderConfig';

interface Props {
    enterprise: Enterprise
    user: DataUser
    setUser: React.Dispatch<React.SetStateAction<DataUser>>
    setEnterprise: React.Dispatch<React.SetStateAction<Enterprise>>
}

function Folders({ enterprise, user, setUser, setEnterprise }: Props) {
    const params: any = useSearchParams();
    const { dataAdmin } = useContext(adminContext)
    const [textSearch, setTextSearch] = useState<string>("")
    const [folderConfig, setFolderConfig] = useState<FolderCfg>({ status: false, name: "", color: "", isPrivate: false, singleDownload: false, onlyMonthDownload: false, timeFile: 3 });
    const [modal, setModal] = useState<Modal>({ status: false, title: '', subject: '', target: '' });
    const id_user: string = params.get("id_user");
    const toastDeletFolder = { pending: "Deletando pasta.", success: "Pasta deletada.", error: "Não foi possível deletar esta pasta." }
    const messageModal = { status: true, title: "Deletar Pasta", subject: 'a pasta' }
    const [id_DeleteFolder, setId_DeleteFolder] = useState<string>("");
    const admin = dataAdmin.id === '' ? false : true
    const trashId: string | undefined = enterprise.folders.find((folder) => folder.name === 'Lixeira')?.id;

    //Confirmação de deletar pasta
    function ConfirmationDeleteFolder({ name, id_folder }: { name: string, id_folder: string }) {
        setId_DeleteFolder(id_folder);
        setModal({ ...messageModal, target: name });
    }

    const childModal = async () => {
        setModal({ status: false, title: '', subject: '', target: '' });
        toast.promise(DeleteFolder({ user, id_folder: id_DeleteFolder, setUser, enterprise, id_company: dataAdmin.id_company }), toastDeletFolder)
    };

    async function PrivateFolderChange(privateState: boolean, index: number) {
        enterprise.folders[index].isPrivate = !privateState;
        const index2 = user.enterprises.findIndex((data) => enterprise.id === data.id)
        user.enterprises[index2] = enterprise
        try {
            toast.promise(
                updateDoc(
                    doc(db, "companies", dataAdmin.id_company, "clients", user.id),
                    {
                        enterprises: user.enterprises,
                    }
                ),
                {
                    pending: privateState ? "Desprivando pasta." : "Privando pasta.",
                    success: privateState ? "Pasta desprivada." : "Pasta privada.",
                }
            );
        } catch (e) {
            throw toast("Erro ao realizar a ação: " + e)
        }
        setUser({ ...user, enterprises: user.enterprises })
    }

    return (
        <div>
            {folderConfig.status && <ModalFolderConfig user={user} enterprise={enterprise} id={id_user} id_company={dataAdmin.id_company} setFolderConfig={setFolderConfig} folderConfig={folderConfig} setUser={setUser} setEnterprise={setEnterprise} />}

            {modal.status && <ModalDelete modal={modal} setModal={setModal} childModal={childModal} />}
            <p className=" font-poiretOne text-[40px] mt-[20px] max-md:text-[30px] dark:text-white">
                Pastas
            </p>
            <div className="w-[500px] max-md:w-[90%] flex justify-between">
                <label className="flex w-[80%] items-center">
                    <MagnifyingGlassIcon width={25} height={25} className="max-sm:h-[18px] max-sm:w-[18px] dark:text-white" />
                    <input onChange={(text) => setTextSearch(text.target.value)} type="text" placeholder="Buscar" className="w-[90%] text-black dark:text-white bg-transparent text-[20px] outline-none max-sm:text-[14px] max-lsm:text-[12px] border-b-black dark:border-b-white border-b-[1px]" />
                </label>

                {admin && <ModalCreateFolder id_company={dataAdmin.id_company} enterprise={enterprise} id={id_user} user={user} setUser={setUser} />}
            </div>

            <div className="flex flex-wrap mt-[20px] gap-y-[15px]">
                {enterprise?.folders?.filter((folder) => textSearch != "" ? folder.name?.toUpperCase().includes(textSearch.toUpperCase()) : true).length > 0 ? (
                    enterprise.folders
                        .filter((folder) => textSearch != "" ? folder.name?.toUpperCase().includes(textSearch.toUpperCase()) : true)
                        .map((folder, index) => {
                            if (folder.name === 'Lixeira' || folder.isPrivate && !admin) { 
                                return
                            } 
                            return (
                                <div key={folder.name} className='flex items-center'>
                                    <div className="relative group w-[200px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] px-[25px] py-[10px] rounded-[8px] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.1)] max-lg:shadow-[0_5px_10px_5px_rgba(0,0,0,0.1)] duration-100">
                                        {folder.name != "Cliente" && folder.name != "Favoritos" && admin &&
                                            <div className='text-[#AAAAAA]'>
                                                {folder.isPrivate === true ? (
                                                    <LockClosedIcon height={24} width={24} onClick={() => { PrivateFolderChange(folder.isPrivate, index); }} className="hover:text-black duration-100 max-lg:w-[22px] max-sm:w-[20px] max-lsm:w-[18px] aspect-square absolute top-[5px] right-[40px] max-lg:right-[25px] max-lsm:right-[20px] lg:group-hover:block cursor-pointer hidden max-lg:block" />
                                                ) : (
                                                    <LockOpen1Icon height={24} width={24} onClick={() => { PrivateFolderChange(folder.isPrivate, index); }} className="hover:text-black duration-100  max-lg:w-[22px] max-sm:w-[20px] max-lsm:w-[18px] aspect-square absolute top-[5px] right-[40px] max-lg:right-[25px] max-lsm:right-[20px] lg:group-hover:block cursor-pointer hidden max-lg:block" />
                                                )}
                                                <TrashIcon height={25} width={25} onClick={() => ConfirmationDeleteFolder({ name: folder.name, id_folder: folder.id })} className="hover:text-black duration-100 max-lg:w-[22px] max-sm:w-[20px] max-lsm:w-[18px] aspect-square absolute top-[5px] right-[10px] max-lg:right-[3px] lg:group-hover:block cursor-pointer hidden max-lg:block" />
                                                <GearIcon height={25} width={25} onClick={() => setFolderConfig({ status: true, name: folder.name, color: folder.color, isPrivate: folder.isPrivate, singleDownload: folder.singleDownload, onlyMonthDownload: folder.onlyMonthDownload, timeFile: folder.timeFile })} className="hover:text-black duration-100  max-lg:w-[22px] max-sm:w-[20px] max-lsm:w-[18px] aspect-square absolute bottom-[10px] right-[10px] lg:group-hover:block cursor-pointer hidden max-lg:block" />
                                            </div>
                                        }

                                        <Link href={{ pathname: `/Dashboard/${admin ? 'Admin' : 'Clientes'}/Arquivos`, query: { id_folder: folder.id, id_user: id_user, id_enterprise: enterprise.id } }}>
                                            <div className="w-[90px] max-lg:w-[70px] max-sm:w-[60px] max-lsm:w-[50px]">
                                                <svg width="100%" height="100%" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M77.537 15.361H34.4308L29.0135 7.23427C28.7414 6.82757 28.2849 6.58325 27.7963 6.58325H1.46296C0.655407 6.58325 0 7.2372 0 8.04621V16.824V22.6758V65.1062C0 69.1381 3.27704 72.4166 7.30604 72.4166H71.694C75.723 72.4166 79 69.1381 79 65.1062V22.6758V16.824C79 16.015 78.3446 15.361 77.537 15.361ZM76.0741 21.2129H2.92593V18.287H33.6481H76.0741V21.2129ZM2.92593 9.50918H27.0136L30.9153 15.361H2.92593V9.50918ZM76.0741 65.1062C76.0741 67.523 74.1093 69.4907 71.694 69.4907H7.30604C4.89069 69.4907 2.92593 67.523 2.92593 65.1062V24.1388H76.0741V65.1062Z" fill={folder.color} /></svg>
                                            </div>
                                            <p className="font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[80%]  overflow-hidden whitespace-nowrap text-ellipsis">
                                                {folder.name}
                                            </p>
                                        </Link>
                                    </div>
                                    {enterprise.folders.length != 3 && index < (enterprise.folders.length - 1) && <div className='w-[1px] h-[60%] mx-[10px] bg-black' />}
                                    {enterprise.folders.length == 3 && index < (enterprise.folders.length - 2) && <div className='w-[1px] h-[60%] mx-[10px] bg-black' />}
                                </div>
                            );
                        })
                ) : (
                    <></>
                )}
            </div>
            {dataAdmin.id !== '' &&
                <>
                    <p className=" font-poiretOne text-[35px] max-md:text-[30px] mt-[20px] ">Lixeira</p>
                    <div className="px-[25px] py-[10px] mb-[10px] w-[180px] max-md:w-[180px] max-sm:w-[150px] max-lsm:w-[120px] rounded-[8px] dark:hover:shadow-[#414141] hover:shadow-[0_5px_10px_5px_rgba(0,0,0,0.1)] max-lg:shadow-[0_5px_10px_5px_rgba(0,0,0,0.1)] duration-100">
                        <Link
                          href={{
                            pathname: "/Dashboard/Admin/Arquivos",
                            query: { id_folder: trashId, id_user: id_user, id_enterprise: enterprise?.id },
                          }}
                        >
                            <div className="relative w-[90px] max-lg:w-[70px] max-sm:w-[60px] max-lsm:w-[50px]">
                                <svg width="100%" height="100%" viewBox="0 0 79 79" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M77.537 15.361H34.4308L29.0135 7.23427C28.7414 6.82757 28.2849 6.58325 27.7963 6.58325H1.46296C0.655407 6.58325 0 7.2372 0 8.04621V16.824V22.6758V65.1062C0 69.1381 3.27704 72.4166 7.30604 72.4166H71.694C75.723 72.4166 79 69.1381 79 65.1062V22.6758V16.824C79 16.015 78.3446 15.361 77.537 15.361ZM76.0741 21.2129H2.92593V18.287H33.6481H76.0741V21.2129ZM2.92593 9.50918H27.0136L30.9153 15.361H2.92593V9.50918ZM76.0741 65.1062C76.0741 67.523 74.1093 69.4907 71.694 69.4907H7.30604C4.89069 69.4907 2.92593 67.523 2.92593 65.1062V24.1388H76.0741V65.1062Z" fill="#9E9E9E" /></svg>
                            </div>
                            <p className="font-500 text-[18px] max-md:text-[14px] max-sm:text-[12px] w-[90%] overflow-hidden whitespace-nowrap text-ellipsis">Excluídos</p>
                        </Link>
                    </div>
                </>
            }
        </div>
    )
}

export default Folders