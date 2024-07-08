const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: {fileSize: 1000000}, // 1 MB file size limit
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check file type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Public folder
app.use(express.static('./public'));

// Route to upload form
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Route to handle file upload
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.send(err);
    } else {
      if(req.file == undefined){
        res.send('Error: No File Selected!');
      } else {
        res.send(`File Uploaded: ${req.file.filename}`);
      }
    }
  });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
