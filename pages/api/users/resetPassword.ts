import { getAuth } from '../sdkFirebase';
import sendEmail from '@/src/Utils/Other/sendEmail';

export default async function resetPassWord(req, res) {
    const { email } = req.body;

    await getAuth().generatePasswordResetLink(email).then(async (link) => {
        const html  = `
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
    </style>
</head>

<body>

    <table style="background-color: #ebebeb; padding-top: 15px; margin: 0 auto; max-width: 800px; width: 100%;">
        <tr>
            <td>
                <div style="padding-left: 15px; padding-right: 15px;">
                    <img src="https://firebasestorage.googleapis.com/v0/b/docs-dc26e.appspot.com/o/imagesEmail%2Flogo2DocsBlack.png?alt=media&token=5a0f7977-47fa-474e-ae92-c9cf9184bd5b"
                        alt="" width="50" />
                </div>
            </td>
        </tr>

        <tr>
            <td>
                <div style="padding-left: 15px; padding-right: 15px; margin: 40px 0 0 0; text-align: center;">
                    <h1>Foi solicitado uma redefinição de <br/> senha para sua conta</h1>
                </div>
            </td>
        </tr>

        <tr>
            <td>
                <div style="padding-left: 15px; padding-right: 15px; display: flex; margin: 40px 0 0 0">
                    <img style="margin: auto;"
                        src="https://firebasestorage.googleapis.com/v0/b/docs-dc26e.appspot.com/o/imagesEmail%2FresetPassWord.png?alt=media&token=3dad652d-9f97-4725-92dd-a379ad9e95f9"
                        alt="" width="315">
                </div>
            </td>
        </tr>

        <tr>
            <td>
                <div style="padding-left: 15px; padding-right: 15px; text-align: center; margin: 40px 0 0 0;">
                    <h2>Clique no botão abaixo para <br /> redefinir sua senha </h2>
                </div>
            </td>
        </tr>

        <tr>
            <td>
                <div style="padding-left: 15px; padding-right: 15px; text-align: center; margin: 40px 0 0 0; cursor: pointer;">
                    <a href="${link}" style="text-decoration: none; background-color: #d6f4e9; border: 2px solid #10b981; border-radius: 8px; padding: 10px 20px; color: #10b981; font-weight: 600; font-size: 14px;" target="_blank">
                        Redefinir Senha
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
`

        const result = await sendEmail({email, subject:'Trocar Senha ✔', text:'Foi solicitado uma redefinição de senha para sua conta', html:html})
        if(result === 'success'){
            res.send('success')
        } else {
            res.send('error')
        }
    })
    .catch((error) => {
        res.send(error)
    })
}

