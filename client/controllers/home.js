angular.module('HappyTree')
  .controller('HomeCtrl', ['$scope', '$rootScope', '$window', '$auth', '$filter','AssesmentService','$location', function($scope, $rootScope, $window, $auth, $filter, AssesmentService, $location) { 

    $scope.signUp = function(){
      $location.path("/signup")
    }

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.goToStudents = function(){
      $location.path("/students")
    }

    $scope.goToTools = function(){
      $location.path("/tools")
    }

    $scope.goToTracker = function(){
      $location.path("/tracker")
    }

  }] );