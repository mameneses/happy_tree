angular.module('HappyTree')
  .controller('OnboardCtrl', ['$scope', '$rootScope', '$window', '$auth', 'UserService', 'StudentService', 'AssesmentService','$timeout', '$filter', '$parse','$location', function($scope, $rootScope, $window, $auth, UserService, StudentService, AssesmentService, $timeout, $filter, $parse, $location) {

    $scope.progressBarWidth = {"width":"25%"}
    $scope.step = "1/4"
    $scope.classStudents = []
    $scope.newClass = ""
    $scope.currentUser = UserService.getCurrentUser()
    $scope.step1 = true

    $scope.$on('userUpdated', function(event,msg) {
      $scope.currentUser = UserService.getCurrentUser()
    });

    $scope.goHome = function () {
      $location.path("/")
    }

    $scope.goToTools = function(){
      $location.path("/tools")
    }

    $scope.goToTracker = function(){
      $location.path("/tracker")
    }

    $scope.goToStudents = function(){
      $location.path("/students")
    }

    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.addClass = function() {
      if ($scope.newClass == "All Students") {
        alert("Your class name can not me 'All Students'.")
      } else {
        if ($scope.currentUser.classes.length > 0) {
          $scope.currentUser.classes.push($scope.newClass)
        } else {
          $scope.currentUser.classes = [$scope.newClass]
        }
        UserService.updateUser($scope.currentUser)

        $scope.currentClass = $scope.newClass

        $scope.newClass = ""
        $scope.addClassForm.$setPristine()

        $scope.progressBarWidth = {"width":"50%"}
        $scope.step = "2/4"

        $scope.step1 = false
        $scope.step2 = true
      }
    }

    $scope.addStudent = function (student) {
      var currentUser = JSON.parse($window.localStorage.currentUser)
      student.currentTeacherID = currentUser._id
      student.className = $scope.currentClass
      StudentService.addStudent(student)
      $scope.classStudents.push(student)
      //clear form
      $scope.student = {}
      $scope.addStudentForm.$setPristine();
      $("#firstName").focus()
    }

    $scope.goToStep3 = function() {
      $scope.progressBarWidth = {"width":"75%"}
      $scope.step = "3/4"
      $scope.step2 = false
      $scope.step3 = true
    }

    $scope.goToStep4 = function() {
      $scope.progressBarWidth = {"width":"100%"}
      $scope.step = "4/4"
      $scope.step3 = false
      $scope.step4 = true
    }


  }]);