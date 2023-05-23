import { getAuth } from '../sdkFirebase'

export default async function CreateUser(req, res) {
  const user = await getAuth().getUser(req.body.uid)
  if (user?.customClaims?.permission > 0) {
    try {
      const response = await getAuth()
      .createUser({
        email: req.body.data.email,
        password: req.body.data.password,
        displayName:req.body.data.id_company,
        emailVerified:true
      })
      getAuth().setCustomUserClaims(response.uid, {permission:0})
      return res.json(response)
    } catch (e) {
      return res.json(e)
    }
  } else {
    res.json({error: 'Usuario não permitido'})
  }
}