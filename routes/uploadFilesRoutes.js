const requireLogin = require('../middlewares/requireLogin');
const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const keys = require('../config/keys');

//config AWS
const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
  signatureVersion: 'v4',
  region: 'us-east-2',
});

//Ruta para upload de archivos
module.exports = (app) => {
  app.get('/api/upload', requireLogin, (req, res) => {
    //Crear key unica para usuario, crea folder y archivo
    const key = `${req.user.id}/${uuid()}.jpeg`;

    //Crear url unica para poder subir archivo
    s3.getSignedUrl(
      'putObject',
      {
        Bucket: 'my-blog-bucket-node-avanzado',
        ContentType: 'image/jpeg',
        Key: key,
      },
      (err, url) => res.send({ key, url })
    );
  });
};
