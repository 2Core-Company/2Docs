import nodemailer from "nodemailer"
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function SendFeed(req: NextApiRequest, res: NextApiResponse) {

    const {email, id_user, id_company} = req.body

    let transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
        user: 'contato@2core.com.br', // generated ethereal user
        pass: process.env.PUBLIC_EMAIL_PASS // generated ethereal password
        },
    });

    await new Promise((resolve, reject) => { 
        transporter.verify((error) => {
        if (error) {
            reject(error);
        } else {
            resolve(true);
        }
        });
    }); 

    await new Promise((resolve, reject) => {
        transporter.sendMail({
            from: '"2Docs" <contato@2core.com.br>', // sender address
            to: `${email}`, // list of receivers
            subject: "`Email de confirmação 2Docs ✔", // Subject line
            text: `Email de confirmação 2Docs.`, // plain text body
            html: `
                <h2>Clique no link:</h2>
                <a href='https://2dash.vercel.app/convite?id_user=${id_user}&id_company=${id_company}'>Confirmar Email</a>
            `, 
        }, (err, info) => {
            if (err) {
                reject(err);
            } else {
                res.status(200).send({message:'Feedback enviado!'})
                resolve(info);
            }
        });
    })
}