angular.module('HappyTree')
  .factory('UserService', ['$http', '$window', '$auth', '$rootScope', function($http, $window, $auth, $rootScope) { 

    return {

      updateProgressMaster: function(student){
        var currentUser = JSON.parse($window.localStorage.currentUser)
        var letterNames = ["Uppercase","Lowercase","Sound"]
        for (var i = 0; i < letterNames.length; i++) {
          var studentName = student.firstName + " " + student.lastName
          var pendingAssesment = {studentId: student._id, student: studentName, type:"Letter", name:letterNames[i]}
          currentUser.progressTracker.letter.master.push(pendingAssesment)
        }
        console.log(currentUser)
      },

      getCurrentUser: function(){
        return JSON.parse($window.localStorage.currentUser)
      },

      updateUser: function(user){
        $http.put("http://localhost:3000/api/users/" + user._id, user).
          success(function(data, status, headers, config) {
            $window.localStorage.currentUser = JSON.stringify(data);
            $rootScope.$broadcast('userUpdated')
          }).
          error(function(data, status, headers, config) {

          })
      },

      deleteUser: function(user){
        $http.delete("http://localhost:3000/api/users/" + user._id).
          success(function(data, status, headers, config) {
            delete $window.localStorage.currentUser;
            $rootScope.$broadcast('userDeleted')
          }).
          error(function(data, status, headers, config) {

          })
      }
    }

  }]);