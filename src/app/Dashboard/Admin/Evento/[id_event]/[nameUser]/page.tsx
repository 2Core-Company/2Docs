import Event from '../../../../../../components/Clients&Admin/Event'

function Evento({params}: {params:{id_event:string, nameUser:string}}){
  return (
    <Event id_event={params.id_event} nameUser={params.nameUser}/>
  );
};
export default Evento;