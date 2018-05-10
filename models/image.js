var mongoose = require('mongoose');

// schema for uploading articles
var ImageSchema = mongoose.Schema({
  fieldname:  String,
  originalname: String,
  encoding: String,
  mimetype: String,
  destination: String,
  filename: String,
  path: String,
  size: String,
  title: String,
  author: String,
  body: String
});

var Image = module.exports = mongoose.model('Image', ImageSchema);
