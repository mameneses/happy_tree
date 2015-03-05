angular.module('HappyTree')
  .factory('UserService', function($http, $window, $auth) { 

    return {
      updateCurrentUser: function(user){
        $http.put("http://localhost:3000/api/users", user).
          success(function(data, status, headers, config) {
            $window.localStorage.currentUser = JSON.stringify(data)
          }).
          error(function(data, status, headers, config) {

          })
      }
    }

  });