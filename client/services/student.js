angular.module('HappyTree')
  .factory('StudentService', ['$http', '$window', '$auth','$rootScope', function($http, $window, $auth, $rootScope) {
    var apiAddress = "http://localhost:3000/api/"

    var currentStudent = {}

    var allStudents = {}
    
    return {
              setCurrentStudent: function(selectedStudent) { 
                  currentStudent = selectedStudent
              },

              getCurrentStudent: function () {
                return currentStudent
              },

              getAllStudents: function () {
                if ($auth.isAuthenticated()) {
                  var students = JSON.parse($window.localStorage.students)
                  return students
                } else {
                  return []
                }
              },

              getStudentsFromDB: function (user) {
                
                $http.get(apiAddress + "students/" + user._id).
                  success(function(data, status, headers, config) {
                    $window.localStorage.students = JSON.stringify(data)
                    console.log("students retreived")
                    $rootScope.$broadcast('studentsGot')
                  }).
                  error(function(data, status, headers, config) {
                    console.log("Student could not be retreived from database")
                  });
              },

              updateStudent: function (student) {
                $http.put( apiAddress + "students/" + student._id, student).
                  success(function(data, status, headers, config) {
                    $window.localStorage.students = JSON.stringify(data)
                    $rootScope.$broadcast('studentUpdated')
                  }).
                  error(function(data, status, headers, config) {

                  })
              },

              addStudent: function(student) {
                $http.post(apiAddress + "students", student).
                  success(function(data, status, headers, config) {
                    $window.localStorage.students = JSON.stringify(data)
                    $rootScope.$broadcast('studentAdded')
                  }).
                  error(function(data, status, headers, config) {

                  })
              },

              deleteStudent: function(student) {
                $http.delete(apiAddress + "students/" + student._id + "?currentTeacherID=" + student.currentTeacherID).
                  success(function(data, status, headers, config) {
                    $window.localStorage.students = JSON.stringify(data)
                    $rootScope.$broadcast('studentDeleted')
                  }).
                  error(function(data, status, headers, config) {

                  })
              }

            }
  }]);