import { getAuth } from '../sdkFirebase'

export default async function disableUser(req, res) {
  const user = await getAuth().getUser(req.body.uid)
  if (user?.customClaims?.permission > 0) {
    try {
      const response = await getAuth()
        .updateUser(req.body.user.id, {
          disabled: !req.body.user.disabled
        })
      return res.json({ type: "success" })
    } catch (e) {
      console.log(e)
      return res.json(e)
    }
  } else {
    res.json({ error: 'Usuario não permitido' })
  }
}
