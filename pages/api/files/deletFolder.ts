import { Storage } from '@google-cloud/storage';

export default function deletFolder(req, res) {
    const storage = new Storage({
        projectId: 'docs-dc26e',
        credentials: {
          client_email: 'firebase-adminsdk-i1tqn@docs-dc26e.iam.gserviceaccount.com',
          private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDTJVDcRYLYdkB1\nTThfZDVsuL2GQSMaKL3TxC7KoIC9KSsbdlAE4bRaTHk/2jIPZlfg8yc66lIDYFhi\nphGV+6+Qqu0tFGDhBMej2e619BL6YDcnvxftZlxnykOFlfqDbjDPeC0DBxeH4AlI\nciqk8hzxrLxOWlx7+Czf0It//Zac7Wyc8poPo1MDM8jJ7Lw0Rz0wAgHfhYc/0YoE\nUgOnzDGENBqMH4g1oUlDykfySBbVCM/lK4b4PLdw23SNhsY8jL6WSVRi1NJlChzY\ndgEuy7u+QKmffRTMUGmWl6pt4OcN8uDWAPQptsDP4jewWDAw0gi0KVsiVNoPEBYB\ncocDANjHAgMBAAECggEAATKO3jySLhO9xdUSKDkkTaAkpwcNPQozueNly99RY33X\nP13fGR8i30+50GV1uoriNAA8LiE+5LkCOJkdHgGA4+0lalEVHg5jLwROODSctLqP\nx6bT+iU7CgoiO+ojr6QqH+qseuRt4LcSov3qEsmjYGYmuPvdZf/z8jajIGIHorSO\npMGs0u1BBDS4yu5ascqkUyyvk7PIy1LNwtuF2N9z/Io2WyfcI/7dHsHi2RWn23Y/\nv+NJsbBkNS7YhRRVPj/gUM6jllIg82kmj9dDFGK0/UuHK46oG/mTHNFwu6+UdXrc\n32FdFmjtGNNY8jKL7stNKMANBphKbtZ/6eYDH2NgbQKBgQD+LbWBrppLhFvP+5Ag\nAtFlXqnTBOkRQiRSHSdktvCEVakro68pLiiQYF57kWG4WwUAYsBhqmI2iN5fXI4k\nrki64gD2Uvh8junfnpgBerainDEQ1iRoWPWSrcgNBEmWDbKK2Eln2JE3XMdNTcWZ\niFMSl8T/ufnpzhHHXNEflC7OCwKBgQDUqKnC+iHurp3epJrUAp+Be5nnro/xGQMm\nBHx4DWGoWNZmeXJuSlsH4NdA97q/Ldf/f8/uiWPaJQ/67YnDXf05vcqIHNlJn3hb\nzaXS6TQffbsjcnLeiIUQZJ8RhvbY/1v/K1/rbc/vH9POK56r3dwgZ/R5buof6gcF\n/9cW1uVhtQKBgB1k9degdJGFJgUAZ6N8D/E0KFmR+M4ZIxAn9PVNvrTfHyg/zrLp\ndqFzs5mAr5ddV0+7G9pvlNoPq//FOV7+lMSf/FKAN+JXuK42rgeFxHc7ruTujtlO\naF/lHvx6YXQr81jhOGP9BJYtcZL8Cnz96fV9fbfBLyidvyqaDkkjnuIPAoGBAJUL\nEM/iV13dbC/a1di5belmI1vJcIDdsuM2SbYqSsOeX8W6YIUEAADpiHO0LGJJUxVz\nEtxv1lfRmf2X9fHDMfMCHax/65o59jUBULMdVrarfDk/wVpN/FSc8Q9rtB4p+uRA\nFh3+/LjvaZcZ4z85Y0ojEaj6H4T2lK2Tvb/4JRPxAoGBANFj9am4enbx3JblalHz\n6iLIUA/oTMaAhSN5vAJzGPXvy3twzuLYNY8XtVsD7bgYQzj4iMGvuRjqcNAsiJM/\nFhM7Q5LHqp3cQCPgFEiQYLqWt2kr3rod465tmLtx1LdCn8RItoIoOUf1D9RbVvcp\nbbxsNxeKGAfbm7qoxzNRPATf\n-----END PRIVATE KEY-----\n",
        },
      });
  
    const bucket = storage.bucket('docs-dc26e.appspot.com');

    const options = {
        prefix: req.body.path,
        force: true,
    };
      
    async function DeleteFiles(){
      bucket.deleteFiles(options, (err, deletedFiles) => {
        if (err) {
          console.error('Erro ao excluir arquivos:', err);
          return;
        }
        console.log(deletedFiles);
      });
    }
    await DeleteFiles()
    res.status(200).json('Arquivos excluidos com sucesso!!!')
}
