const fs = require('fs');
const path = require('path');

module.exports = {
  devServer: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs', 'private.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs', 'certificate.crt')),
    },
    host: 'localhost',
    port: 3000,
  },
};
