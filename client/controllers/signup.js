angular.module('HappyTree')
  .controller('SignupCtrl', ['$scope', '$auth', 'StudentService', '$window', '$rootScope','$location', function($scope, $auth, StudentService, $window, $rootScope, $location) {
    $scope.signup = function() {
      var user = {
        firstName: $scope.firstName,
        lastName: $scope.lastName,
        email: $scope.email,
        password: $scope.password,
        school: $scope.school,
        sightWordLists: []
      };
 
      // Satellizer
      $auth.signup(user)
        .then(function(response) {
          $window.localStorage.currentUser = JSON.stringify(response.data.user);
          StudentService.getStudentsFromDB(response.data.user)
          $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
          $location.path("/welcome")
        })
        .catch(function(response) {
          if (response.data == null) {
            alert("We are having issues with our servers. Please try again soon. Thank you for your patience.")
          }
          console.log(response.data);
        });
    }; 

  }]);