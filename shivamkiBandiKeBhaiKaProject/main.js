const express = require('express');
var fs = require('fs');
const app = express();
const port = 9000;
const unzipper = require('unzipper');
const multer = require('multer');
const figlet = require('figlet');
const gradient = require('gradient-string');
const Jimp = require('jimp');

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
    await sleep(1000);

    await fs.readdir('./output', async function (err, filenames) {
      console.log('====================================');
      console.log(filenames);
      console.log('====================================');
      if (err) {
        onError(err);
        return;
      }
      filenames.forEach(async function (filename) {
        await greyscale(filename);
      });
    });
    res.send(`${req.file.originalname} is unzipped`);
  } catch (err) {
    console.log(err);
  }
});

async function greyscale(fileName) {
  try {
    if (fileName !== '__MACOSX') {
      const image = await Jimp.read(`./output/${fileName}`);
      image.grayscale().write(`./output/Reversed${fileName}`);
    }
  } catch (err) {
    console.log(`Error is ${err}`);
  }
}
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

app.listen(port, () => {
  console.log(
    gradient.pastel.multiline(figlet.textSync(`Server started on port ${port}`))
  );
});
