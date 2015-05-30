angular.module('HappyTree')
  .controller('HomeCtrl', ['$scope', '$rootScope', '$window', '$auth', '$filter','AssesmentService', function($scope, $rootScope, $window, $auth, $filter, AssesmentService) { 
    
    $scope.$on('assesmentsRetrieved', function(event,msg) {
      $scope.assesments = AssesmentService.getSortedAssesments()
      $scope.letterAssesments = $scope.assesments.letter
      $scope.sightWordAssesments = $scope.assesments.sightWords
    });

    $scope.$on('assesmentsUpdated', function(event,msg) {
      $scope.assesments = AssesmentService.getSortedAssesments()
      $scope.letterAssesments = $scope.assesments.letter
      $scope.sightWordAssesments = $scope.assesments.sightWords
    });
    
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
    
    if ($scope.isAuthenticated()) {
      if($window.localStorage.assesments) {
        $scope.assesments = AssesmentService.getSortedAssesments()
        $scope.letterAssesments = $scope.assesments.letter
        $scope.sightWordAssesments = $scope.assesments.sightWords
      }

      $scope.currentUser = JSON.parse($window.localStorage.currentUser)

    }

    $scope.score = function(correct, incorrect) {
      var percentageScore = $scope.toPercentage(parseInt(correct)/(parseInt(correct) + parseInt(incorrect)), 0)
      return percentageScore + "%"
    }

    $scope.toPercentage =  function (input, decimals) {
      return $filter('number')(input * 100, decimals);
    };

    $scope.getScoreColorClass = function(score) {
      var scorePercentage = score.correctCount / ((1 * score.correctCount) + (1 * score.incorrectCount))
      if ( scorePercentage < .33) {
        return "red"
      } else if  (scorePercentage > .33 && scorePercentage < .66) {
        return "yellow"
      } else if (scorePercentage >= .66) {
        return "green" 
      }
    }

  }] );