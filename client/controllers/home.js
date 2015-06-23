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

    $scope.setHeight = function() {

      var windowInt = $window.innerHeight
      var windowHeight = windowInt.toString() + "px"

      $scope.windowHeight = {"height":windowHeight }
      
    }

    $scope.showHowPanel = function(panelName) {
      var panel = "#" + panelName
      var showing = $(panel).css('display')
      if(showing == 'none') {
        $(panel).slideDown();
      } else {
        $(panel).slideUp();
      }
    }

    $scope.setFeatureBtnHeight = function() {
      if ($window.innerWidth < 475) {
        var margin = $window.innerHeight - 530
        var featMargin = margin.toString() + "px"

        $scope.featureBtnMargin = {"margin-top": featMargin}
      } else {
        var margin = $window.innerHeight - 450
        var featMargin = margin.toString() + "px"

        $scope.featureBtnMargin = {"margin-top": featMargin}
      }
    }

    $scope.setHeight()
    $scope.setFeatureBtnHeight()

  }] );