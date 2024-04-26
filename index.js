var express = require('express');
var cors = require('cors');
var fs = require('fs');
require('dotenv').config();
const multer = require("multer");

let storage = multer.diskStorage({
  //make folder depend on file type and save file in folder same type (image/video)
  destination: function (req, file, cb) {
    file.type = file.mimetype.split('/')[0];
    let dir = './files/' + file.type;
    try {
      fs.readdir(dir).then(() => {cb(null, './files/' + file.type)};);
    } catch (error) {
      fs.mkdir(dir, () => {
        cb(null, './files/' + file.type);
      });
    };
  },
  // make file name as filetype-timeSatmp.fileExtend
  filename: function (req, file, cb) {
    cb(null, file.mimetype.split('/')[0] + '-' + Date.now() + '.' + file.originalname.split('.').pop());
  };
});

let upload = multer({ storage: storage });

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//[POST]/api/fileanalyse
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
