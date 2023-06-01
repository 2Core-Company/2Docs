const { exec } = require('child_process');

// Exemplo de uso
export default async function getSizeBucket(req, res) {
    const bucketName = req.body.bucketName;

    await exec(`gsutil du -s gs://${bucketName}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Erro ao obter o tamanho do bucket:', error);
        return;
      }
    
      const output = stdout.trim();
      const sizeRegex = /^(\d+)\s/;
      const matches = sizeRegex.exec(output);
    
      if (matches) {
        const bucketSize = parseInt(matches[1]);
        console.log(`Tamanho total do bucket: ${bucketSize} bytes`);
      } else {
        console.error('Erro ao analisar a saída do comando.');
      }
    });
  }

  



