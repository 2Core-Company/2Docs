import { getAuth } from '../sdkFirebase';

export default async function getUserByEmail(req, res) {
    const { email } = req.body;
    try{
    const result = await getAuth().getUserByEmail(email)
        res.send({emailExist:true})
    }catch{
        res.send({emailExist:false})
    };
}
