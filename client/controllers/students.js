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

    $scope.classStatsShowing = true
    $scope.studentStatsShowing = false
    $scope.editStudentShowing = false
    $scope.warningShowing = false
    $scope.letterAssesmentChartShowing = true
    $scope.sightWordAssesmentChartShowing = false


    $scope.getClassStats = function() {
      $scope.assesments = AssesmentService.getAssesments()
      for (var i = 0; i < $scope.students.length; i++) {
        $scope.students[i].recentAssesments = {letter:{}, sightWords:{name:" - ",percent:""}}
        var studentAssesments = AssesmentService.getStudentAssesments($scope.students[i])
        for (var j = studentAssesments.letter.length - 1; j >= 0; j--) {
          if (studentAssesments.letter[j].name == "Uppercase") {
            if ($scope.students[i].recentAssesments.uppercase == undefined) {
              $scope.students[i].recentAssesments.uppercase = studentAssesments.letter[j].percentCorrect + "%"
            }
          }
          if (studentAssesments.letter[j].name == "Lowercase") {
            if ($scope.students[i].recentAssesments.lowercase == undefined) {
              $scope.students[i].recentAssesments.lowercase = studentAssesments.letter[j].percentCorrect + "%"
            }
          }
          if (studentAssesments.letter[j].name == "Sound") {
            if ($scope.students[i].recentAssesments.sound == undefined) {
              $scope.students[i].recentAssesments.sound = studentAssesments.letter[j].percentCorrect + "%"
            }
          }
          if ($scope.students[i].recentAssesments.sound && $scope.students[i].recentAssesments.lowercase && $scope.students[i].recentAssesments.uppercase) {
            break
          }
        }

        if (studentAssesments.sightWords.length > 0) {
          var sightWords = studentAssesments.sightWords
          $scope.students[i].recentAssesments.sightWords.name = sightWords[sightWords.length-1].name + " - "
          $scope.students[i].recentAssesments.sightWords.percent = sightWords[sightWords.length-1].percentCorrect + "%"
        }
       
      }
      
    }

    $scope.$on('assesmentsRetrieved', function(event,msg) {
      $scope.getClassStats()
    });
    


    $scope.showStats = function(student) {
      $scope.hideAll()
      $scope.studentStatsShowing = true
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
        console.log(assesment)
        if (assesment.name == "Uppercase") {
          $scope.letterAssesments[0].push(assesment)
          data[0].push(assesment.percentCorrect)  
        } else if (assesment.name == "Lowercase") {
          $scope.letterAssesments[1].push(assesment)
          data[1].push(assesment.percentCorrect)
        } else if (assesment.name == "Sound") {
          $scope.letterAssesments[2].push(assesment)
          data[2].push(assesment.percentCorrect)
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
        
        // add score to proper data input
        for ( var j = 0; j< seriesLength; j++ ) {
          if (assesment.name == series[j]) {
            $scope.sightWordAssesments[j].push(assesment)
            data[j].push(assesment.percentCorrect)
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
      $scope.getClassStats()
      alert("Your Student was successfully updated!")
    });

    $scope.hideAll = function(){
      $scope.classStatsShowing = false
      $scope.studentStatsShowing = false
      $scope.addStudentShowing = false
      $scope.editStudentShowing = false
      $scope.showingWarning = false
      $scope.missedUppercase = false
      $scope.missedLowercase = false
      $scope.missedSound  = false
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
      $scope.getClassStats()
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
      $scope.classStatsShowing = true
      $scope.hideDeleteWarning()
    }

    $scope.$on('studentDeleted', function(event,msg) {
      $scope.setStudents()
      $scope.getClassStats()
    });

    $scope.getScoreColorClass = function(percentCorrect) {
      if (percentCorrect && percentCorrect != " ") {
        var percentCorrect = parseInt(percentCorrect)
        if ( percentCorrect < 33) {
          return "red"
        } else if  (percentCorrect >= 33 && percentCorrect < 66) {
          return "yellow"
        } else if (percentCorrect >= 66) {
          return "green" 
        }
      } else {
        return " "
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

    $scope.showClass = function(){
      $scope.hideAll()
      $scope.currentStudent = {}
      $scope.classStatsShowing = true
    }

  }]);


