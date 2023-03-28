import { getAuth } from '../sdkFirebase'

  export default async function DeleteUser(req, res) {
    const user = await getAuth().getUser(req.body.uid)
    if (user.customClaims.admin) {
      try{
        const result = await getAuth().deleteUser(req.body.users[0].id)
        res.status(200)
      } catch (err){
        res.json(err)
      }
    }
  }