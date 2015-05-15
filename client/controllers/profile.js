angular.module('HappyTree')
  .controller('ProfileCtrl', ['$scope', '$rootScope', '$window', '$auth', 'UserService', '$timeout', '$filter', '$location', function($scope, $rootScope, $window, $auth, UserService, $timeout, $filter, $location) {
    

    $scope.deleteWarningShowing = false
    $scope.currentUser = JSON.parse($window.localStorage.currentUser)
    $scope.editUserShowing = true;

    $scope.showDeleteWarning = function() {
      $scope.deleteWarningShowing = true
    }

    $scope.hideDeleteWarning = function() {
      $scope.deleteWarningShowing = false
    }

    $scope.deleteUser = function(user) {
      $scope.deleteWarningShowing = false
      UserService.deleteUser(user)
    }

    $scope.$on('userDeleted', function(event,msg) {
      $auth.logout();
      delete $window.localStorage.currentUser;
      $window.localStorage.allStudents = [];
      $location.path("/")
    });

    $scope.setCurrentUser = function(){
      $scope.currentUser = JSON.parse($window.localStorage.currentUser);
    }

    $scope.updateUser = function(user) {
      UserService.updateUser(user)
      $scope.editUserForm.$setPristine();
    }
    
    $scope.$on('userUpdated', function(event,msg) {
      $scope.setCurrentUser()
      alert("Your Profile was successfully updated!")
    });

    $scope.editUser = function(user) {
      if(user.password) {
        if(user.newPassword1 != user.newPassword2) {
          delete $scope.currentUser.password
          delete $scope.currentUser.newPassword1
          delete $scope.currentUser.newPassword2 
          alert("Your new password does not match the confirmation. Try again!");
        } else {
          $scope.updateUser(user)
        }
      } else {
        $scope.updateUser(user)
      }
    }

  }]);