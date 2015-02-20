angular.module('HappyTree')
  .controller('SignupCtrl', function($scope, $auth) {
    $scope.signup = function() {
      var user = {
        firstName: $scope.firstName,
        lastName: $scope.lastName,
        email: $scope.email,
        password: $scope.password,
        school: $scope.school
      };

      console.log(user)
 
      // Satellizer
      $auth.signup(user)
        .catch(function(response) {
          console.log(response.data);
        });
    }; 

  });