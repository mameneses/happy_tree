var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  currentGrade: String,
  currentTeacher: Object,
  letterAssesmentScores:[{date: Date, correct: Number, missedLetters:[]}]
})

var Student = mongoose.model('Student', schema);

module.exports = Student;