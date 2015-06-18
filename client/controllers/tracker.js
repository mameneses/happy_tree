angular.module('HappyTree')
  .controller('TrackerCtrl', ['$scope', '$rootScope', '$window', '$auth', '$filter','AssesmentService','$location', function($scope, $rootScope, $window, $auth, $filter, AssesmentService, $location) { 

    $scope.eventSelected = false

     $scope.setSelectedDay = function(event, jsEvent){
      $scope.eventSelected = true
      $scope.selectedEvent = event
      console.log(typeof jsEvent.pageX)
      $scope.coords = {
        'top': (jsEvent.pageY).toString() + "px",
        'left': (jsEvent.pageX).toString() + "px"
      }
    }

    $scope.closeEvent = function(){
      $scope.eventSelected = false
    }

    $scope.dateRangeChange = function(){
       $scope.closeEvent()
    }

    $scope.uiConfig = {
      calendar:{
        height: 700,
        editable: false,
        timezone: "local",
        header:{
          left: 'today prev,next',
          center: 'title',
          right: 'month basicWeek basicDay'
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventClick:  $scope.setSelectedDay,
        viewRender: $scope.dateRangeChange,
        windowResize: $scope.closeEvent,
        eventLimit: true
      }
    }

   $scope.signUp = function(){
    $location.path("/signup")
   }

    $scope.events = []

    $scope.createEvents = function (){
      $scope.allAssesments = AssesmentService.getAssesments()
      for (var i = 0; i < $scope.allAssesments.length; i++){
        var currentEvent = {title:"", start:""}
        currentEvent.title = $scope.allAssesments[i].studentName + " - " + $scope.allAssesments[i].type + " - " +$scope.allAssesments[i].name
        currentEvent.student = $scope.allAssesments[i].studentName
        currentEvent.assesment = $scope.allAssesments[i].type + " - " +$scope.allAssesments[i].name
        currentEvent.start = $scope.allAssesments[i].date
        currentEvent.date = new Date($scope.allAssesments[i].date)
        currentEvent.score = $scope.allAssesments[i].percentCorrect
        currentEvent.className = "pointer"
        $scope.events.push(currentEvent)
      }
      $scope.eventSources = [$scope.events]
    }

    $scope.createEvents()

    $scope.$on('assesmentsRetrieved', function(event,msg) {
      $scope.assesments = AssesmentService.getSortedAssesments()
      $scope.letterAssesments = $scope.assesments.letter
      $scope.sightWordAssesments = $scope.assesments.sightWords
      $scope.createEvents()
    });

    $scope.$on('assesmentsUpdated', function(event,msg) {
      $scope.assesments = AssesmentService.getSortedAssesments()
      $scope.letterAssesments = $scope.assesments.letter
      $scope.sightWordAssesments = $scope.assesments.sightWords
      $scope.createEvents()
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
      var scorePercentage = score
      if ( scorePercentage < 33) {
        return "red"
      } else if  (scorePercentage > 33 && scorePercentage < 66) {
        return "yellow"
      } else if (scorePercentage >= 66) {
        return "green" 
      }
    }
    }]);