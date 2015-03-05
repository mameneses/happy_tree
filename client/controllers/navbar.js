angular.module('HappyTree')
  .controller('NavbarCtrl', function($scope, $rootScope, $window, $auth) {
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.currentUser = $rootScope.currentUser

    $scope.logout = function() {
      $auth.logout();
      delete $window.localStorage.currentUser;
      $window.localStorage.allStudents = [];
    };
  });