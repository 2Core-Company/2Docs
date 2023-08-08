import nodemailer from "nodemailer"

interface Props {
    email: string
    subject: string
    text: string
    html: string
}

export default async function sendEmail({ email, subject, text, html }: Props) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'contato@2core.com.br', // generated ethereal user
            pass: process.env.PUBLIC_EMAIL_PASS // generated ethereal password
        },
    });
    
    await transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        }
    });

    try{
        const info = await transporter.sendMail({
            from: '"2Docs" <contato@2core.com.br>', // sender address
            to: `${email}`, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html,
        });
        if(info?.messageId){
            return "success"
        }
    } catch(e){
        console.log(e)
        return "error"
    }
}
