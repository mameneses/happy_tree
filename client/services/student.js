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
                $http.get("http://localhost:3000/api/students", {params: {currentTeacherID: currentUser._id}}).
                  success(function(data, status, headers, config) {
                    $window.localStorage.allStudents = JSON.stringify(data)
                  }).
                  error(function(data, status, headers, config) {

                  });

              },

              updateStudent: function (student) {
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
              },

              deleteStudent: function(student) {
                console.log(student)
                $http.delete("http://localhost:3000/api/students?_id=" + student._id + "&currentTeacherID=" + student.currentTeacherID).
                  success(function(data, status, headers, config) {
                    $window.localStorage.allStudents = JSON.stringify(data)
                  }).
                  error(function(data, status, headers, config) {

                  })
              }

            }
  });