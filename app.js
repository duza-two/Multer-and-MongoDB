const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const exphbs = require('express-handlebars');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const path = require('path');

// Initializing database
mongoose.connect('mongodb://localhost/upload');

// connecting to Schema
const Image = require('./models/image');

// Set Storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize uploade variable
const upload = multer({
  storage: storage
}).single('Images');

// Initialize app
const app = express();

// Setting up handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Public folder
app.use(express.static('./public'));

//routes file
//upload page
app.get('/', (req, res) => {
  Image.find({}, (err, image) => {
    if(err) {
      console.log(err);
    } else {
        res.render('index', {
          image: image
        });
      }
    });
  });

// Post route
app.post('/upload', (req, res) => {
  //call upload function set in multer
  upload(req, res, (err) => {
    if(err) {
      res.render('index', {
        msg: err
      });
    } else {
      let image = Image();
      console.log(req.file);
      // saving data of image file to database
      image.fieldname = req.file.fieldname;
      image.originalname = req.file.originalname;
      image.encoding = req.file.encoding;
      image.mimetype = req.file.mimetype;
      image.destination = req.file.destination;
      image.filename = req.file.filename;
      image.path = req.file.path;
      image.size = req.file.size;
      image.title = req.body.title;
      image.author = req.body.author;
      image.body = req.body.body;
      // saving above data to database
      image.save(function(err) {
        if(err) {
          console.log(err);
          return;
        } else {
          res.render('index');
        }
      })
    }
  })
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => console.log(`Server started on port ` + app.get('port')));
