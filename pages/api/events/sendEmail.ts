import nodemailer from "nodemailer"
import { FormatDate } from "../../../src/Utils/Other/FormatDate";

// async..await is not allowed in global scope, must use a wrapper
export default async function SendEmail(req, res) {
  const { email, title, description, enterprise, dateStarted } = req.body

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
      to: email, // list of receivers
      subject: "Evento Criado ✔", // Subject line
      text: `Um evento atribuído para você`, // plain text body
      html: `
      <!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
              * {
                  padding: 0;
                  margin: 0;
                  vertical-align: baseline;
                  list-style: none;
                  border: 0
              }
      
              body {
                  display: flex;
                  color: #333333;
                  font-family: Arial, Helvetica, sans-serif;
                  background-color: transparent;
              }
      
              p {
                  font-size: 20px;
              }
          </style>
      </head>
      
      <body>
          <table style="background-color: #ebebeb; padding-top: 15px; margin: 0 auto; max-width: 800px; width: 100%;">
              <tr>
                  <td>
                      <div style="padding-left: 15px; padding-right: 15px;">
                          <img src="https://firebasestorage.googleapis.com/v0/b/docs-dc26e.appspot.com/o/imagesEmail%2Flogo2DocsBlack.png?alt=media&token=222a6c8b-b106-4c91-a019-cabdf4a01288"
                              alt="" width="50" />
                      </div>
                  </td>
              </tr>
      
              <tr>
                  <td>
                      <div style="padding-left: 15px; padding-right: 15px; margin: 40px 0 0 0; text-align: center;">
                          <h1>Um evento foi atríbuido para você!</h1>
                      </div>
                  </td>
              </tr>
      
              <tr>
                  <td>
                      <div style="padding-left: 15px; padding-right: 15px; display: flex; margin: 40px 0 0 0">
                          <img style="margin: auto;"
                              src="https://firebasestorage.googleapis.com/v0/b/docs-dc26e.appspot.com/o/imagesEmail%2FnotifyEvent.png?alt=media&token=63fbfb31-2de6-46c8-adcf-423326d8c5a7"
                              alt="" width="400" />
                      </div>
                  </td>
              </tr>
      
              <tr>
                  <td>
                      <div style="padding-left: 15px; padding-right: 15px; margin: 40px 0 0 0;">
                          <p><span style="font-weight: 600;">Título:</span> ${title}</p>
                      </div>
                  </td>
              </tr>
      
              <tr>
                  <td>
                      <div style="padding-left: 15px; padding-right: 15px; margin: 10px 0 0 0;">
                          <p><span style="font-weight: 600;">Descrição:</span> ${description}</p>
                      </div>
                  </td>
              </tr>
      
              <tr>
                  <td>
                      <div style="padding-left: 15px; padding-right: 15px; margin: 10px 0 0 0;">
                          <p><span style="font-weight: 600;">Data de início:</span>${FormatDate(dateStarted)}</p>
                      </div>
                  </td>
              </tr>
      
              <tr>
                  <td>
                      <div style="padding-left: 15px; padding-right: 15px; margin: 10px 0 0 0;">
                          <p><span style="font-weight: 600;">Empresa:</span> ${enterprise}</p>
                      </div>
                  </td>
              </tr>
      
              <tr>
                  <td>
                      <div
                          style="padding-left: 15px; padding-right: 15px; text-align: center; margin: 40px 0 0 0; cursor: pointer;">
                          <a href="https://2docs-2core.vercel.app/"
                              style="text-decoration: none; background-color: #d6f4e9; border: 2px solid #10b981; border-radius: 8px; padding: 10px 20px; color: #10b981; font-weight: 600; font-size: 14px;"
                              target="_blank">
                              Me leve ao 2Docs
                          </a>
                      </div>
                  </td>
              </tr>
      
              <tr>
                  <td style="background-color: #10b981; display: flex; padding: 20px 0; margin: 40px 0 0 0">
                      <a style="margin: auto;" target="_blank" href="https://www.2core.com.br/">
                          <img src="https://firebasestorage.googleapis.com/v0/b/docs-dc26e.appspot.com/o/imagesEmail%2Flogo2CoreWhite.png?alt=media&token=946d631e-52ae-48b5-83ed-bde5265767a5"
                              alt="" width="45">
                      </a>
                  </td>
              </tr>
          </table>
      </body>
      
      </html>
      `,
    }, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        res.status(200).send({ message: 'Email enviado!' })
        resolve(info);
      }
    });
  })


}

