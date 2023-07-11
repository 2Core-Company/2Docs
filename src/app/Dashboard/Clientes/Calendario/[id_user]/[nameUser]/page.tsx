import Calendar from '../../../../../../components/Clients&Admin/Calendar/index'

function Calendario({params}: {params:{id_user:string, nameUser:string}}){
  return (
    <Calendar id_user={params.id_user} nameUser={params.nameUser}/>
  );
};
export default Calendario;