const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const certsDir = "C:/Program Files (x86)/ciot/certs/";
const options = {
  key: fs.readFileSync(path.resolve(certsDir+"privKey.pem")),
  cert: fs.readFileSync(path.resolve(certsDir+"cert.pem")),
};

app.prepare().then(() => {
  createServer(options, async (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3030, (err) => {
    if (err) throw err;
    console.log('> Ready on https://172.31.168.110:3030');
  });
});
