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

    $scope.labels = [];
    $scope.series = ['Capital', 'Lower', "Sound"];
    $scope.data = [[],[],[]];
      $scope.onClick = function (points, evt) {
          console.log(points, evt);
        };

    $scope.showStats = function(student) {
      $scope.hideAll()
      $scope.statsShowing = true
      $scope.currentStudent = student
      $scope.labels = [];
      $scope.data = [[],[],[]];

      for ( var i = 0; i < student.letterAssesmentScores.length; i++) {
        var assesment = JSON.parse(student.letterAssesmentScores[i])
        var formatedDate = $filter('date')(assesment.date, 'longDate')
        $scope.labels.push(formatedDate)
        if (assesment.type == "upper") {
          $scope.data[0].push(parseInt(assesment.correctCount)) 
        } else if (assesment.type == "lower") {
          $scope.data[1].push(parseInt(assesment.correctCount)) 
        } else if (assesment.type == "sound") {
          $scope.data[2].push(parseInt(assesment.correctCount)) 
        }
      }

      $scope.$on('create ', function (event, chart) {
        console.log(chart);
      });

      console.log($scope.currentStudent)
      console.log($scope.data)
      console.log($scope.labels)
    }

    $scope.assesmentTypeFormat = function (assesment) {
      
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
      setTimeout($scope.setStudents,500)
    } 

    $scope.hideAll = function(){
      $scope.statsShowing = false
      $scope.addStudentShowing = false
      $scope.editStudentShowing = false
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

      // setTimeout($scope.setStudents,500)

    }

    ///////////////////////// CHARTS ///////////////////////////////////

      // Simulate async data update
      // $timeout(function () {
      //   $scope.data = [
      //     [28, 48, 40, 19, 86, 27, 90],
      //     [65, 59, 80, 81, 56, 55, 40]
      //   ];
      // }, 3000);

  }]);