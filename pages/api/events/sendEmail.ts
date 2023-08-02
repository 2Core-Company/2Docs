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
      to: dataEvent.email, // list of receivers
      subject: "Evento Criado ✔", // Subject line
      text: `Um evento atribuído para você`, // plain text body
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta content="width=device-width, initial-scale=1" name="viewport">
<meta name="x-apple-disable-message-reformatting">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="telephone=no" name="format-detection">
<title>Trigger Newsletter 2</title><!--[if (mso 16)]>
<style type="text/css">
a {text-decoration: none;}
</style>
<![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
<xml>
<o:OfficeDocumentSettings>
<o:AllowPNG></o:AllowPNG>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
<style type="text/css">
.rollover:hover .rollover-first {
max-height:0px!important;
display:none!important;
}
.rollover:hover .rollover-second {
max-height:none!important;
display:inline-block!important;
}
.rollover div {
font-size:0px;
}
u ~ div img + div > div {
display:none;
}
#outlook a {
padding:0;
}
span.MsoHyperlink,
span.MsoHyperlinkFollowed {
color:inherit;
mso-style-priority:99;
}
a.es-button {
mso-style-priority:100!important;
text-decoration:none!important;
}
a[x-apple-data-detectors] {
color:inherit!important;
text-decoration:none!important;
font-size:inherit!important;
font-family:inherit!important;
font-weight:inherit!important;
line-height:inherit!important;
}
.es-desk-hidden {
display:none;
float:left;
overflow:hidden;
width:0;
max-height:0;
line-height:0;
mso-hide:all;
}
.es-header-body a:hover {
color:#1376c8!important;
}
.es-content-body a:hover {
color:#0b5394!important;
}
.es-footer-body a:hover {
color:#333333!important;
}
.es-infoblock a:hover {
color:#cccccc!important;
}
.es-button-border:hover {
border-color:#3d5ca3 #3d5ca3 #3d5ca3 #3d5ca3!important;
background:#ffffff!important;
}
.es-button-border:hover a.es-button,
.es-button-border:hover button.es-button {
background:#ffffff!important;
}
.es-button-border:hover a.es-button {
background:#ffffff!important;
}
td .es-button-border-1843:hover {
border-color:#10b981!important;
background:#a3f0d2!important;
}
td .es-button-border:hover a.es-button-2846 {
background:#a3f0d2!important;
border-color:#a3f0d2!important;
color:#10b981!important;
}
@media only screen and (max-width:600px) {*[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } .es-header-body p { } .es-content-body p { } .es-footer-body p { } .es-infoblock p { } h1 { font-size:20px!important; text-align:center; line-height:120%!important } h2 { font-size:16px!important; text-align:left; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:20px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:16px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body a { font-size:10px!important } .es-content-body p, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body a { font-size:12px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img, .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important } .es-m-txt-r .rollover div, .es-m-txt-c .rollover div, .es-m-txt-l .rollover div { line-height:0!important; font-size:0!important } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:14px!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important; display:table-row!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .es-social td { padding-bottom:10px } .h-auto { height:auto!important } .es-text-2437, .es-text-2437 p, .es-text-2437 a, .es-text-2437 h1, .es-text-2437 h2, .es-text-2437 h3, .es-text-2437 h4, .es-text-2437 h5, .es-text-2437 h6, .es-text-2437 ul, .es-text-2437 ol { font-size:36px!important } p, ul li, ol li, a { font-size:16px!important } h2 a { text-align:left } a.es-button { border-left-width:0px!important; border-right-width:0px!important } a.es-button, button.es-button { display:inline-block!important } .es-button-border { display:inline-block!important } }
</style>
</head>
<body style="width:100%;height:100%;padding:0;Margin:0">
<div class="es-wrapper-color" style="background-color:#FAFAFA"><!--[if gte mso 9]>
<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
<v:fill type="tile" color="#fafafa"></v:fill>
</v:background>
<![endif]-->
<table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">
<tr>
<td valign="top" style="padding:0;Margin:0">
<table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
<tr>
<td class="es-adaptive" align="center" style="padding:0;Margin:0">
<table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#3d5ca3;width:600px" cellspacing="0" cellpadding="0" bgcolor="#3d5ca3" align="center">
<tr>
<td style="padding:15px;Margin:0;background-color:#EBEBEB" bgcolor="#EBEBEB" align="left">
<table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
<tr>
<td align="left" style="padding:0;Margin:0;width:570px">
<table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr>
<td align="left" style="padding:0;Margin:0;font-size:0"><img class="adapt-img" src="https://xlkuyh.stripocdn.email/content/guids/CABINET_676974920caac1a938eeeba4f5c3acf56c71225525a77d82ffc2d483a35591a1/images/2docs_1_1_2.png" alt width="50" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none;border-radius:0"></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table>
<table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
<tr>
<td style="padding:0;Margin:0;background-color:#fafafa" bgcolor="#fafafa" align="center">
<table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#ffffff;width:600px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center">
<tr>
<td style="padding:0;Margin:0;padding-right:20px;padding-left:20px;background-color:#ebebeb;background-position:left top" bgcolor="#ebebeb" align="left">
<table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr>
<td valign="top" align="center" style="padding:0;Margin:0;width:560px">
<table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:left top" role="presentation">
<tr>
<td align="center" class="h-auto es-text-2437" height="10" style="padding:0;Margin:0;font-size:36px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:54px;letter-spacing:0;font-size:36px;color:#333333"><strong style="font-size:30px !important">Um evento foi atribuído para você!</strong></p></td>
</tr>
<tr>
<td align="center" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0"><img src="https://xlkuyh.stripocdn.email/content/guids/CABINET_676974920caac1a938eeeba4f5c3acf56c71225525a77d82ffc2d483a35591a1/images/undraw_online_calendar_re_wk3t_1.png" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" width="300" alt></td>
</tr>
<tr>
<td align="left" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;padding-left:15px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px !important;letter-spacing:0;font-size:20px !important;color:#666666"><strong style="font-family:arial, 'helvetica neue', helvetica, sans-serif">Título:&nbsp;&nbsp;</strong>${dataEvent.title}</p></td>
</tr>
<tr>
<td align="left" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;padding-left:15px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px !important;letter-spacing:0;font-size:20px !important;color:#666666"><strong style="font-family:arial, 'helvetica neue', helvetica, sans-serif">Descrição:&nbsp;</strong>${dataEvent.observation}</p></td>
</tr>
<tr>
<td align="left" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;padding-left:15px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px !important;letter-spacing:0;font-size:20px !important;color:#666666"><strong style="font-family:arial, 'helvetica neue', helvetica, sans-serif">Data de início:&nbsp;</strong>${dataEvent.enterprise}</p></td>
</tr>
<tr>
<td align="left" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;padding-left:15px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;line-height:20px !important;letter-spacing:0;font-size:20px !important;color:#666666"><strong style="font-family:arial, 'helvetica neue', helvetica, sans-serif">Empresa:&nbsp;</strong>${FormatDate(dataEvent.dateSelected)}</p></td>
</tr>
<tr>
<td align="center" bgcolor="transparent" style="Margin:0;padding-top:40px;padding-right:10px;padding-bottom:40px;padding-left:10px"><span class="es-button-border-1843 es-il es-button-border" style="border-style:solid;border-color:#10b981;background:#d6f4e9;border-width:2px;display:inline-block;border-radius:8px;width:auto"><a href="https://2docs-2core.vercel.app/" class="es-button es-button-2846" target="_blank" style="mso-style-priority:100 !important;text-decoration:none !important;mso-line-height-rule:exactly;font-size:14px;color:#10b981;padding:10px 20px;display:inline-block;background:#d6f4e9;border-radius:8px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:bold;font-style:normal;line-height:17px;width:auto;text-align:center;letter-spacing:0;mso-padding-alt:0;mso-border-alt:10px solid #d6f4e9">Me leve ao 2Docs</a></span></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table>
<table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
<tr>
<td style="padding:0;Margin:0;background-color:#fafafa" bgcolor="#fafafa" align="center">
<table class="es-footer-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
<tr>
<td style="Margin:0;padding-right:20px;padding-left:20px;padding-top:10px;padding-bottom:30px;background-color:#10B981;background-position:left top" bgcolor="#10B981" align="left">
<table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr>
<td valign="top" align="center" style="padding:0;Margin:0;width:560px">
<table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
<tr>
<td align="center" style="padding:0;Margin:0;padding-top:15px;font-size:0"><a target="_blank" href="https://www.2core.com.br/" style="mso-line-height-rule:exactly;text-decoration:none;font-size:14px;color:#333333"><img class="adapt-img" src="https://xlkuyh.stripocdn.email/content/guids/CABINET_676974920caac1a938eeeba4f5c3acf56c71225525a77d82ffc2d483a35591a1/images/logo2coreremovebgpreview_1.png" alt width="37" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></a></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table></td>
</tr>
</table>
</div>
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

