angular.module('HappyTree')
  .factory('StudentService', function () {
    var currentStudent = {}
    
    return {
              setCurrentStudent: function(selectedStudent) { 
                  currentStudent = selectedStudent
              },

              getCurrentStudent: function () {
                return currentStudent
              },

              getAllStudents: function () {
                return 
              }

            }
  });