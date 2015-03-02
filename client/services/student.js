angular.module('HappyTree')
  .factory('StudentService', function($http, $window, $auth) {
    var currentStudent = {}
    
    return {
              setCurrentStudent: function(selectedStudent) { 
                  currentStudent = selectedStudent
              },

              getCurrentStudent: function () {
                return currentStudent
              },

              getAllStudents: function () {
                if ($auth.isAuthenticated()) {
                  return JSON.parse($window.localStorage.allStudents)
                } else {
                  return []
                }
              },

              getStudentsFromDB: function () {
                var currentUser = JSON.parse($window.localStorage.currentUser)
                console.log(currentUser)
                $http.get("http://localhost:3000/api/students", {params: {currentTeacherID: currentUser._id}}).
                  success(function(data, status, headers, config) {
                    console.log(data)
                    $window.localStorage.allStudents = JSON.stringify(data)
                  }).
                  error(function(data, status, headers, config) {

                  });

              },

              saveStudentLetterAssesment: function (assesment) {
                currentStudent.letterAssesmentScores.push(JSON.stringify(assesment))
                $http.put("http://localhost:3000/api/students", currentStudent).
                  success(function(data, status, headers, config) {
                    $window.localStorage.allStudents = JSON.stringify(data)
                    console.log(JSON.parse($window.localStorage.allStudents))
                  }).
                  error(function(data, status, headers, config) {

                  })
              },

              updateStudent: function (student) {
                console.log(student)
                $http.put("http://localhost:3000/api/students", student).
                  success(function(data, status, headers, config) {
                    $window.localStorage.allStudents = JSON.stringify(data)
                  }).
                  error(function(data, status, headers, config) {

                  })
              },

              addStudent: function(student) {
                $http.post("http://localhost:3000/api/students", student).
                  success(function(data, status, headers, config) {
                    $window.localStorage.allStudents = JSON.stringify(data)
                  }).
                  error(function(data, status, headers, config) {

                  })
              }

            }
  });