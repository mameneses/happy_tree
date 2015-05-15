angular.module('HappyTree')
  .controller('NavbarCtrl', ['$scope', '$rootScope', '$window', '$auth', function($scope, $rootScope, $window, $auth) {
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.setCurrentUser = function() {
      $scope.currentUser = JSON.parse($window.localStorage.currentUser);
    }

    if($window.localStorage.currentUser) {
      $scope.setCurrentUser()
    }

    $scope.$on('userUpdated', function(event,msg) {
      $scope.setCurrentUser()
    });

    $scope.$on('userDeleted', function(event,msg) {
      $scope.logout()
    })

    $scope.logout = function() {
      $auth.logout();
      delete $window.localStorage.currentUser;
      delete $window.localStorage.assesments;
      delete $window.localStorage.students;
    };
  }]);