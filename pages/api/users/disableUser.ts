import { getAuth } from '../sdkFirebase'

export default async function disableUser(req, res) {
    console.log("a")
    const user = await getAuth().getUser(req.body.uid)
        console.log(user)
    if (user?.customClaims?.permission > 0 ) {
      try {
        for(var i = 0; i < req.body.users.length; i++){
          const response = await getAuth()
            .updateUser(req.body.users[i].id, {
              disabled: !req.body.users[0].disabled
            })
        }
        return res.json({type: "success"})
      } catch (e) {
        console.log(e)
        return res.json(e)
      }
    } else {
      res.json({error: 'Usuario não permitido'})
    }
    
}
