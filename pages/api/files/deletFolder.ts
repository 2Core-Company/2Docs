import { Storage } from '@google-cloud/storage';

export default function deletFolder(req, res) {
    const storage = new Storage({
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY,
      },
    });
  
    const bucket = storage.bucket(process.env.STORAGE_BUCKET!);

    const options = {
      prefix: req.body.path,
      force: true,
    };
      // bucket.getFiles(options, () => {

      // })


    return bucket.deleteFiles(options, (err, deletedFiles) => {
      if (err) {
        res.status(400).json('Erro ao deletar!!!')
      } else {
        res.status(200).json('Arquivos excluidos com sucesso!!!')
      }
    });
}
