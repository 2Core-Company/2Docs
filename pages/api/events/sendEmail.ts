import nodemailer from "nodemailer"
import { FormatDate } from "../../../src/Utils/Other/FormatDate";

// async..await is not allowed in global scope, must use a wrapper
export default async function SendEmail(req, res) {
//   const {title, observation, from, dateSelected} = red.body
  const dataEvent = req.body

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
        console.log(error);
        reject(error);
      } else {
        resolve('Email enviado');
      }
    });
  }); 

  await new Promise((resolve, reject) => {
    transporter.sendMail({
      from: '"Site 2Docs" <contato@2core.com.br>', // sender address
      to: "lucasgeansantos@gmail.com", // list of receivers
      subject: "Evento Criado ✔", // Subject line
      text: `Notificação do evento criado no 2docs`, // plain text body
      html: `
        <h2>Um evento foi criado, verifique na sua conta do 2Docs</h1>
        <h2>Titúlo:</h1><h3>${dataEvent.title}</h3>
        <h2>Observação:</h1> <h3>${dataEvent.observation}</h3>
        <h2>Empresa:</h1> <h3>${dataEvent.enterprise}</h3>
        <h2>Data de entrega:</h1> <h3>${FormatDate(dataEvent.dateSelected)}</h3>
      `, 
    }, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        res.status(200).send({message:'Email enviado!'})
        resolve(info);
      }
  });
  })


}