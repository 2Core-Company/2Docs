import { getAuth } from '../sdkFirebase'

  export default async function DeleteUser(req, res) {
    const user = await getAuth().getUser(req.body.uid)
    if (user?.customClaims?.permission > 0) {
      try{
        const result = await getAuth().deleteUser(req.body.users.id)
        res.status(200).json('Usuário excluído com sucesso')
      } catch (err){
        console.log(err)
        res.json(err)
      }
    }
  }