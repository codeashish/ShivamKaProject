const express = require('express');
var fs = require('fs');
const app = express();
const port = 9000;
const unzipper = require('unzipper');
const multer = require('multer');
const figlet = require('figlet');
const gradient = require('gradient-string');
const colors = require('colors');
const upload = multer({
  dest: 'uploads/',
});

app.post('/zip', upload.single('zipFile'), async function (req, res, next) {
  try {
    await fs.createReadStream(req.file.path).pipe(
      unzipper.Extract({
        path: 'output',
      })
    );
    console.log(`${req.file.originalname} is unzipped`);
    res.send(`${req.file.originalname} is unzipped`);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(
    gradient.pastel.multiline(figlet.textSync(`Server started on port ${port}`))
  );
});
