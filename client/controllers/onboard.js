angular.module('HappyTree')
  .controller('OnboardCtrl', ['$scope', '$rootScope', '$window', '$auth', 'UserService', 'StudentService', 'AssesmentService','$timeout', '$filter', '$parse','$location', function($scope, $rootScope, $window, $auth, UserService, StudentService, AssesmentService, $timeout, $filter, $parse, $location) {

    $scope.classStudents = []
    $scope.newClass = ""
    $scope.currentUser = UserService.getCurrentUser()
    $scope.student = {}
    $scope.form = {}

    $scope.step1 = true

    $scope.$on('userUpdated', function(event,msg) {
      $scope.currentUser = UserService.getCurrentUser()
    });

    $scope.goHome = function (){
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

    $scope.addClass = function(addedClass) {
      if (addedClass == "All Students" || addedClass == null || addedClass == "") {
        alert("Your class name can not be 'All Students'.") 
      } else {

        if ($scope.currentUser.classes.length > 0) {
          var match = false
          for (var i = 0; i < $scope.currentUser.classes.length; i++) {
            if ($scope.currentUser.classes[i] == addedClass) {
              match = true
            }
          }
          if (match == true) {
            alert("There is already a class with the name " + addedClass + ". Please choose another name.")
          } else {
            $scope.currentUser.classes.push(addedClass)
            UserService.updateUser($scope.currentUser)
          }
        } else {
          $scope.currentUser.classes = [addedClass]
          UserService.updateUser($scope.currentUser)
        }

        $scope.currentClass = addedClass

        $('#step-2').css('background','#4caf50')

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
      $scope.form.addStudentForm.$setPristine()
      $("#firstName").focus()
    }

    $scope.goToStep3 = function() {
      $('#step-3').css('background','#4caf50')
      $scope.step2 = false
      $scope.step3 = true
    }

    $scope.goToStep4 = function() {
      $('#step-4').css('background','#4caf50')
      $scope.step3 = false
      $scope.step4 = true
    }

    $scope.goToStep5 = function() {
      $('#step-5').css('background','#4caf50')
      $scope.step4 = false
      $scope.step5 = true
    }


  }]);