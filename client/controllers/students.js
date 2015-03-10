angular.module('HappyTree')
  .controller('StudentsCtrl', ['$scope', '$rootScope', '$window', '$auth', 'StudentService', '$timeout', '$filter', function($scope, $rootScope, $window, $auth, StudentService, $timeout, $filter) {
    
    if ($window.localStorage.allStudents.length == 0) {
      $scope.students = []
    } else {
      $scope.students = JSON.parse($window.localStorage.allStudents)
    }
    
    $scope.grades = [{name: "Pre-Kindergarten"}, {name: "Kindergarten"}, {name: "1st"}]
    $scope.student = {}
    $scope.currentStudent = {}

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

      $scope.showLetterAssesmentChart()      
    }

    $scope.toPercentage =  function (input, decimals) {
      return $filter('number')(input * 100, decimals);
    };

    $scope.showLetterAssesmentChart = function() {

      console.log($scope.currentStudent)
      $scope.letterAssesmentChartShowing = true
      $scope.sightWordAssesmentChartShowing = false

      var data = [[],[],[]]

      if ($scope.currentStudent.letterAssesmentScores.length <= 0) {
        data = [[0],[],[]]
      }  

      $scope.letterAssesments = [[],[],[]]

      for ( var i = 0; i < $scope.currentStudent.letterAssesmentScores.length; i++) {
        var assesment = JSON.parse($scope.currentStudent.letterAssesmentScores[i])
        if (assesment.type == "upper") {
          $scope.letterAssesments[0].push(assesment)
          data[0].push($scope.toPercentage(parseInt(assesment.correctCount)/26, 0))  
        } else if (assesment.type == "lower") {
          $scope.letterAssesments[1].push(assesment)
          data[1].push($scope.toPercentage(parseInt(assesment.correctCount)/26, 0))
        } else if (assesment.type == "sound") {
          $scope.letterAssesments[2].push(assesment)
          data[2].push($scope.toPercentage(parseInt(assesment.correctCount)/26, 0))
        }
      }  

      var labels = []

      if ($scope.currentStudent.letterAssesmentScores.length > 0) {
        var assesmentCounts = [$scope.letterAssesments[0].length, $scope.letterAssesments[1].length, $scope.letterAssesments[2].length]
        $scope.labelCount = assesmentCounts.sort().reverse()[0]
      } else {
        $scope.labelCount = 1
      }


      for ( var i = 0; i < $scope.labelCount; i++) {
        labels.push("Test " + (i+1).toString())
      } 

      console.log($scope.capitalAssesments)

      $timeout(function () {
        $scope.series = ['Capital', 'Lowercase', "Sound"];
        $scope.data = data
        $scope.labels = labels
      }, 10);
    }

    $scope.letterAssesmentTitle = function(assesment) {
      if (assesment[0].type == "upper") {
        return "Capital Letters"
      } else if (assesment[0].type == "lower") {
        return "Lowercase Letters"
      } else if (assesment[0].type == "sound") {
        return "Letter Sounds"
      } else {
        return " "
      }
    }

    $scope.sightWordAssesmentChart = function() {

      $scope.letterAssesmentChartShowing = false
      $scope.sightWordAssesmentChartShowing = true

      $scope.sightWordAssesments = [[],[],[]]

        var data = [[],[],[]]

        if ($scope.currentStudent.sightWordAssesmentScores.length <= 0) {
          data = [[0],[],[]]
        }
        var series = []

        for ( var i = 0; i < $scope.currentStudent.sightWordAssesmentScores.length; i++) {
          var assesment = JSON.parse($scope.currentStudent.sightWordAssesmentScores[i])
          series.push(assesment.name)
        }

        var onlyUnique = function (value, index, self) { 
          return self.indexOf(value) === index;
        }

        series = series.filter(onlyUnique)

      for ( var i = 0; i < $scope.currentStudent.sightWordAssesmentScores.length; i++) {
        var assesment = JSON.parse($scope.currentStudent.sightWordAssesmentScores[i])
        if (assesment.name == series[0]) {
          $scope.sightWordAssesments[0].push(assesment)
          data[0].push($scope.toPercentage(parseInt(assesment.correctCount)/(parseInt(assesment.correctCount) + parseInt(assesment.incorrectCount)), 0))
        } else if (assesment.type == series[1]) {
          $scope.sightWordAssesments[1].push(assesment)
          data[1].push($scope.toPercentage(parseInt(assesment.correctCount)/(parseInt(assesment.correctCount) + parseInt(assesment.incorrectCount)), 0))
        } else if (assesment.type == series[2]) {
          $scope.sightWordAssesments[2].push(assesment)
          data[2].push($scope.toPercentage(parseInt(assesment.correctCount)/(parseInt(assesment.correctCount) + parseInt(assesment.incorrectCount)), 0))
        } else if (assesment.type == series[3]) {
          $scope.sightWordAssesments[3].push(assesment)
          data[3].push($scope.toPercentage(parseInt(assesment.correctCount)/(parseInt(assesment.correctCount) + parseInt(assesment.incorrectCount)), 0))
        } else if (assesment.type == series[4]) {
          $scope.sightWordAssesments[4].push(assesment)
          data[4].push($scope.toPercentage(parseInt(assesment.correctCount)/(parseInt(assesment.correctCount) + parseInt(assesment.incorrectCount)), 0))
        } else if (assesment.type == series[5]) {
          $scope.sightWordAssesments[5].push(assesment)
          data[5].push($scope.toPercentage(parseInt(assesment.correctCount)/(parseInt(assesment.correctCount) + parseInt(assesment.incorrectCount)), 0))
        }
      }  

      var labels = []
      var labelCount = 0
      if ($scope.currentStudent.sightWordAssesmentScores.length > 0) {
        var assesmentCounts = [$scope.sightWordAssesments[0].length, $scope.sightWordAssesments[1].length, $scope.sightWordAssesments[2].length]
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
      setTimeout($scope.setStudents,500)
    } 

    $scope.hideAll = function(){
      $scope.statsShowing = false
      $scope.addStudentShowing = false
      $scope.editStudentShowing = false
      $scope.showingWarning = false
    }

    $scope.setStudents = function() {
      $scope.students = StudentService.getAllStudents()
      $scope.$apply();
    }

    $scope.addStudent = function (student) {
      var student = student
      var currentUser = JSON.parse($window.localStorage.currentUser)
      student.currentTeacherID = currentUser._id
      StudentService.addStudent(student)

      //clear form
      $scope.student = {}
      $scope.addStudentForm.$setPristine();

      setTimeout($scope.setStudents,500)

    }

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
      setTimeout($scope.setStudents,500)
    }

  }]);