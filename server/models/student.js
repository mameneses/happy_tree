var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  currentGrade: String,
  currentTeacherID: String,
  letterAssesmentScores:[{type: String, date: Date, correctCount: Number, incorrectCount: Number, missedLetters:[]}]
})

var Student = mongoose.model('Student', schema);

module.exports = Student;