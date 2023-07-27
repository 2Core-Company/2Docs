import FileShare from '@/src/components/Clients&Admin/FileShare';

function SharedFile({params}: {params:{id_share: string, id_company: string, id_user: string}}) {
  return(
    <FileShare id_share={params.id_share} id_company={params.id_company} id_user={params.id_user}/>
  )
}

export default SharedFile;