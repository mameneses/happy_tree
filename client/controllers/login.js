angular.module('HappyTree')
  .controller('LoginCtrl', ['$scope', '$window', '$location', '$rootScope', '$auth', 'StudentService','AssesmentService', function($scope, $window, $location, $rootScope, $auth, StudentService, AssesmentService) { 

    $scope.emailLogin = function() {
      $auth.login({ email: $scope.email, password: $scope.password })
        .then(function(response) {
          $window.localStorage.currentUser = JSON.stringify(response.data.user);
          StudentService.getStudentsFromDB(response.data.user)
          AssesmentService.getAssesmentsFromDB()
          $rootScope.$broadcast('userLoggedIn')
          $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
        })
        .catch(function(response) {
          $scope.errorMessage = {};
          if (response.data == null) {
            alert("We are having issues with our servers. Please try again soon. Thank you for your patience.")
          }
          angular.forEach(response.data.message, function(message, field) {
            $scope.loginForm[field].$setValidity('server', false);
            $scope.errorMessage[field] = response.data.message[field];
        });
      });
    };

  }]);