angular.module('HappyTree')
  .controller('StudentsCtrl', ['$scope', '$rootScope', '$window', '$auth', 'UserService', 'StudentService', 'AssesmentService','$timeout', '$filter', '$parse', function($scope, $rootScope, $window, $auth, UserService, StudentService, AssesmentService, $timeout, $filter, $parse) {

    $scope.students = []

    $scope.setStudents = function() {
      $scope.students = StudentService.getAllStudents()
    }

    $scope.setStudents()
    
    $scope.grades = [{name: "Pre-Kindergarten"}, {name: "Kindergarten"}, {name: "1st"}]
    $scope.student = {}
    $scope.currentStudent = {}
    $scope.currentStudentAssesments = {}
    $scope.currentScore = {}

    $scope.statsShowing = false
    $scope.addStudentShowing = true
    $scope.editStudentShowing = false
    $scope.warningShowing = false
    $scope.letterAssesmentChartShowing = true
    $scope.sightWordAssesmentChartShowing = false

    $scope.showStats = function(student) {
      $scope.hideAll()
      $scope.statsShowing = true
      $scope.currentStudent = student
      $scope.currentStudentAssesments = AssesmentService.getStudentAssesments(student)
      $scope.showLetterAssesmentChart()      
    }

    $scope.setCurrentStudentAssesments = function(student) {
      $scope.currentStudentAssesments = {}

    }

    $scope.toPercentage =  function (input, decimals) {
      return $filter('number')(input * 100, decimals);
    };

    $scope.showLetterAssesmentChart = function() {
      $scope.letterAssesmentChartShowing = true
      $scope.sightWordAssesmentChartShowing = false

      var data = [[],[],[]]

      var studentLetterAssesments = $scope.currentStudentAssesments.letter

      if (studentLetterAssesments.length  <= 0) {
        data = [[0],[],[]]
      }  

      $scope.letterAssesments = [[],[],[]]

      for ( var i = 0; i < studentLetterAssesments.length; i++) {
        var assesment = studentLetterAssesments[i]
        if (assesment.name == "Uppercase") {
          $scope.letterAssesments[0].push(assesment)
          data[0].push($scope.toPercentage(parseInt(assesment.correctCount)/26, 0))  
        } else if (assesment.name == "Lowercase") {
          $scope.letterAssesments[1].push(assesment)
          data[1].push($scope.toPercentage(parseInt(assesment.correctCount)/26, 0))
        } else if (assesment.name == "Sound") {
          $scope.letterAssesments[2].push(assesment)
          data[2].push($scope.toPercentage(parseInt(assesment.correctCount)/26, 0))
        }
      }  

      var labels = []

      if (studentLetterAssesments.length > 0) {
        var assesmentCounts = [$scope.letterAssesments[0].length, $scope.letterAssesments[1].length, $scope.letterAssesments[2].length]
        $scope.labelCount = assesmentCounts.sort().reverse()[0]
      } else {
        $scope.labelCount = 1
      }

      for ( var i = 0; i < $scope.labelCount; i++) {
        labels.push("Test " + (i+1).toString())
      } 

      $timeout(function () {
        $scope.series = ['Capital', 'Lowercase', "Sound"];
        $scope.data = data
        $scope.labels = labels
      }, 10);
    }

    $scope.letterAssesmentTitle = function(assesment) {
      if (assesment[0].name == "Uppercase") {
        return "Capital Letters"
      } else if (assesment[0].name == "Lowercase") {
        return "Lowercase Letters"
      } else if (assesment[0].name == "Sound") {
        return "Letter Sounds"
      } else {
        return " "
      }
    }


    $scope.sightWordSeries = []

    $scope.sightWordAssesmentChart = function() {

      $scope.letterAssesmentChartShowing = false
      $scope.sightWordAssesmentChartShowing = true

      var studentSightWordAssesments = $scope.currentStudentAssesments.sightWords

      $scope.sightWordAssesments = []

      var data = []

      
      var series = []

      var sightWordAssesmentsLength = studentSightWordAssesments.length
      for ( var i = 0; i < sightWordAssesmentsLength; i++) {
        var assesment = studentSightWordAssesments[i]
        series.push(assesment.name)
      }

      var onlyUnique = function (value, index, self) { 
        return self.indexOf(value) === index;
      };

      series = series.filter(onlyUnique);

      $scope.sightWordSeries = series

      for (var i = 0; i < series.length; i++) {
        data.push([])
        $scope.sightWordAssesments.push([])
      }

      if (sightWordAssesmentsLength <= 0) {
        data = [[0]]
      }

      var seriesLength = series.length

      for ( var i = 0; i < sightWordAssesmentsLength; i++) {
        var assesment = studentSightWordAssesments[i]
        var percentageScore = $scope.toPercentage(parseInt(assesment.correctCount)/(parseInt(assesment.correctCount) + parseInt(assesment.incorrectCount)), 0)
        // add score to proper data input
        for ( var j = 0; j< seriesLength; j++ ) {
          if (assesment.name == series[j]) {
            $scope.sightWordAssesments[j].push(assesment)
            data[j].push(percentageScore)
          }
        }
      }  

      var labels = []
      var labelCount = 0

      if ($scope.sightWordAssesments.length > 0) {
        var assesmentCounts = []
        for ( var i = 0; i < $scope.sightWordAssesments.length; i++) {
          assesmentCounts.push($scope.sightWordAssesments[i].length)
        }
        var labelCount = assesmentCounts.sort().reverse()[0]
      } else {
        labelCount = 1
      }

      for ( var i = 0; i < labelCount; i++) {
        labels.push("Test " + (i+1).toString())
      } 

      $timeout(function () {
        $scope.series = series
        $scope.data = data
        $scope.labels = labels
      }, 10);

    }

    $scope.showAddStudent = function() {
      $scope.hideAll()
      $scope.addStudentShowing = true
    }

    $scope.showEditStudent = function (student) {
      $scope.hideAll()
      $scope.currentStudent = student
      $scope.editStudentShowing = true
    }

    $scope.editStudent = function (student) {
      StudentService.updateStudent(student)
      $scope.editStudentForm.$setPristine();
    } 
    
    $scope.$on('studentUpdated', function(event,msg) {
      $scope.setStudents()
    });

    $scope.hideAll = function(){
      $scope.statsShowing = false
      $scope.addStudentShowing = false
      $scope.editStudentShowing = false
      $scope.showingWarning = false
    }


    $scope.addStudent = function (student) {
      var currentUser = JSON.parse($window.localStorage.currentUser)
      student.currentTeacherID = currentUser._id
      StudentService.addStudent(student)

      //clear form
      $scope.student = {}
      $scope.addStudentForm.$setPristine();
    }

    $scope.$on('studentAdded', function(event,msg) {
      $scope.setStudents()
    });

    $scope.showDeleteWarning = function () {
      $scope.warningShowing = true
    }

    $scope.hideDeleteWarning = function () {
      $scope.warningShowing = false
    }

    $scope.deleteStudent = function (student) {
      StudentService.deleteStudent(student)
      $scope.currentStudent = {}
      $scope.editStudentShowing = false
      $scope.addStudentShowing = true
      $scope.hideDeleteWarning()
    }

    $scope.$on('studentDeleted', function(event,msg) {
      $scope.setStudents()
    });

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

    $scope.toggleMissedLetters = function(score) {
      console.log(score)

      var missedLetterView = 'missed' + score.name
      
      if (score.name == 'Uppercase') {
        $scope.missedUppercaseList = score.missed.sort().join(" ")
      }
      if (score.name == 'Lowercase') {
        $scope.missedLowercaseList  = score.missed.sort().join(" ")
      }
      if (score.name == 'Sound') {
        $scope.missedSoundList  = score.missed.sort().join(" ")
      }

      if($scope[missedLetterView] == false || $scope[missedLetterView] == undefined) {
        $scope[missedLetterView] = true
      } 

    }

    $scope.missedWordsLists = []
    
    for (var i = 0; i < $scope.sightWordSeries.length; i++) {
      var listName = $scope.sightWordSeries[i]
      $scope[listName] = {name: listName, missedWords: []}
      $scope.missedWordsLists.push($scope[listName])
    }

    $scope.showMissedWord = function(score) {


      var scoreName = 'missed' + score.name

      for (var i = 0; i < $scope.missedWordsLists.length; i++) {

        if (score.name == $scope.missedWordsLists[i].name) {
          var name = $scope.sightWordSeries[i] 
          $scope.missedWordsLists[i].missedWords = score.missedWords
        }
      };

      $scope[scoreName] = true

      console.log($scope[scoreName])
    }

    $scope.hideMissedLetters = function(name) {
      if (name == 'Uppercase') {
        $scope.missedUppercase = false
      }
      if (name == 'Lowercase') {
        $scope.missedLowercase = false
      }
      if (name == 'Sound') {
        $scope.missedSound  = false
      }
    }
  }]);


