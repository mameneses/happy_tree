var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  studentName: String,
  studentID: String,
  teacherID: String,
  name: String,
  type: String,
  date: Date,
  correctCount: String,
  incorrectCount: String,
  missed: []
})

var Assesment = mongoose.model('Assesment', schema);

module.exports = Assesment;