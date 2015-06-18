angular.module('HappyTree')
  .controller('StudentsCtrl', ['$scope', '$rootScope', '$window', '$auth', 'UserService', 'StudentService', 'AssesmentService','$timeout', '$filter', '$parse', function($scope, $rootScope, $window, $auth, UserService, StudentService, AssesmentService, $timeout, $filter, $parse) {

    $scope.students = []

    $scope.setStudents = function() {
      $scope.students = StudentService.getAllStudents()
    }

    $scope.$on('userUpdated', function(event,msg) {
      $scope.currentUser = UserService.getCurrentUser()
    });

    $scope.currentUser = UserService.getCurrentUser()

    $scope.setStudents()

    $scope.currentStudents = []

    $scope.setCurrentStudents = function() {
      $scope.currentStudents = []
      if ($scope.currentClass == "All Students") {
        $scope.currentStudents = $scope.students
      } else {
        for (var i=0; i < $scope.students.length; i++) {
          if ($scope.students[i].className == $scope.currentClass){
            $scope.currentStudents.push($scope.students[i])
          }
        }
      }
      $scope.getClassStats()
    }  


    $scope.newClass = ""
    $scope.editedClassName = ""
    $scope.student = {}
    $scope.currentStudent = {}
    $scope.currentStudentAssesments = {}
    $scope.currentScore = {}
    $scope.sortType = "lastName"
    $scope.sortReverse = false
    
    $scope.allClassesShowing = true
    $scope.mngClassesShowing = true
    $scope.addStudentShowing = false
    $scope.classStatsShowing = true
    $scope.mngClassShowing = false
    $scope.studentStatsShowing = false
    $scope.editStudentShowing = false
    $scope.warningShowing = false
    $scope.letterAssesmentChartShowing = true
    $scope.sightWordAssesmentChartShowing = false
    $scope.editClassShowing = false
    $scope.edittingClassName = false

    $scope.editBtnShowing = false

    $scope.showEditClass = function(clickedClass){
      $scope.oldClassName = clickedClass
      $scope.editClassShowing = true
    }

    $scope.showMngClass = function() {
      $scope.mngClassShowing = true
    }

    $scope.showMngClasses = function() {
      $scope.mngClassesShowing = true
      $scope.addStudentShowing = false
    }

    $scope.showAddStudent = function() {
      $scope.addStudentShowing = true
    }

    $scope.hideMngClass = function() {
      $scope.mngClassShowing = false
    }

    $scope.hideEditStudent = function() {
      $scope.editStudentShowing = false
    }

    $scope.showAllClasses = function(){
      $scope.allClassesShowing = true
      $scope.currentClass = "All Students"
      $scope.setCurrentStudents()
      $scope.hideAll()
      $scope.currentStudent = {}
      $scope.classStatsShowing = true
    }

    $scope.goToClass = function(selectedClass) {
      $scope.currentClass = selectedClass
      $scope.setCurrentStudents()
      $scope.allClassesShowing = false
    }

    $scope.addClass = function() {
      if ($scope.newClass == "All Students") {
        alert("Your class name can not me 'All Students'.")
      } else {
        if ($scope.currentUser.classes.length > 0) {
          var match = false
          for (var i = 0; i < $scope.currentUser.classes.length; i++) {
            if ($scope.currentUser.classes[i] == $scope.newClass) {
              match = true
            }
          }
          if (match == true){
            alert("There is already a class with the name " + $scope.newClass + ". Please choose another name.")
          } else {
            $scope.currentUser.classes.push($scope.newClass)
            UserService.updateUser($scope.currentUser)
          }
        } else {
          $scope.currentUser.classes = [$scope.newClass]
          UserService.updateUser($scope.currentUser)
        }
        $scope.newClass = ""
        $scope.addClassForm.$setPristine()
      }
    }

    $scope.deleteClass = function(className) {
      var confirmed = confirm("Are you sure you want to delete " + className +"?")
      if (confirmed == true) {
        for (var i = 0; i < $scope.currentUser.classes.length; i++) {
          if ($scope.currentUser.classes[i] == className) {
            $scope.currentUser.classes.splice(i,1)
          }
        }
        UserService.updateUser($scope.currentUser)
        $scope.showAllClasses()
      }
      
    }

    $scope.getClassStats = function() {
      $scope.assesments = AssesmentService.getAssesments()
      if ($scope.assesments.length > 0) {
        for (var i = 0; i < $scope.currentStudents.length; i++) {
          $scope.currentStudents[i].recentAssesments = {letter:{}, sightWords:{name:" - ",percent:""}}
          var studentAssesments = AssesmentService.getStudentAssesments($scope.currentStudents[i])
          for (var j = studentAssesments.letter.length - 1; j >= 0; j--) {
            if (studentAssesments.letter[j].name == "Uppercase") {
              if ($scope.currentStudents[i].recentAssesments.uppercase == undefined) {
                $scope.currentStudents[i].recentAssesments.uppercase = parseInt(studentAssesments.letter[j].percentCorrect)
              }
            }
            if (studentAssesments.letter[j].name == "Lowercase") {
              if ($scope.currentStudents[i].recentAssesments.lowercase == undefined) {
                $scope.currentStudents[i].recentAssesments.lowercase = parseInt(studentAssesments.letter[j].percentCorrect) 
              }
            }
            if (studentAssesments.letter[j].name == "Sound") {
              if ($scope.currentStudents[i].recentAssesments.sound == undefined) {
                $scope.currentStudents[i].recentAssesments.sound = parseInt(studentAssesments.letter[j].percentCorrect) 
              }
            }
            if ($scope.currentStudents[i].recentAssesments.sound && $scope.currentStudents[i].recentAssesments.lowercase && $scope.currentStudents[i].recentAssesments.uppercase) {
              break
            }
          }

          if (studentAssesments.sightWords.length > 0) {
            var sightWords = studentAssesments.sightWords
            $scope.currentStudents[i].recentAssesments.sightWords.name = sightWords[sightWords.length-1].name + " - "
            $scope.currentStudents[i].recentAssesments.sightWords.percent = parseInt(sightWords[sightWords.length-1].percentCorrect)
          }
        }
      }
    }

    if ($scope.currentUser.classes) {
      $scope.currentClass = "All Students"
      $scope.setCurrentStudents()
    } else {
      $scope.currentClass = ""
    }

    $scope.$on('assesmentsRetrieved', function(event,msg) {
      $scope.getClassStats()
    });
    
    $('[data-toggle="tooltip"]').tooltip(); 


    $scope.showStats = function(student) {
      $scope.hideAll()
      $scope.studentStatsShowing = true
      $scope.currentStudent = student
      $scope.currentStudentAssesments = AssesmentService.getStudentAssesments(student)
      if ($scope.letterAssesmentChartShowing == true) {
        $scope.showLetterAssesmentChart()      
      } else if ($scope.sightWordAssesmentChartShowing == true) {
        $scope.sightWordAssesmentChart()
      }
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

    $scope.showEditStudent = function (student) {
      $scope.currentStudent = student
      $scope.editStudentShowing = true
    }

    $scope.editStudent = function (student) {
      $scope.edittingClass = false
      StudentService.updateStudent(student)
    } 
    
    $scope.$on('studentUpdated', function(event,msg) {
      $scope.setStudents()
      $scope.setCurrentStudents()
      $scope.getClassStats()
      $scope.hideEditStudent()
      $scope.editStudentForm.$setPristine();
      if ($scope.edittingClassName == false) {
        alert("Your Student was successfully updated!")
      }
    });

    $scope.hideAll = function(){
      $scope.classStatsShowing = false
      $scope.studentStatsShowing = false
      $scope.editStudentShowing = false
      $scope.showingWarning = false
      $scope.missedUppercase = false
      $scope.missedLowercase = false
      $scope.missedSound  = false
      $scope.editClassShowing = false
    }


    $scope.addStudent = function (student) {
      var currentUser = JSON.parse($window.localStorage.currentUser)
      student.currentTeacherID = $scope.currentUser._id
      student.className = $scope.currentClass
      StudentService.addStudent(student)
      console.log(student)
      //clear form
      $scope.student = {}
      $scope.addStudentForm.$setPristine();
      $("#addFirstName").focus()
    }

    $scope.$on('studentAdded', function(event,msg) {
      $scope.setStudents()
      $scope.setCurrentStudents()
      $scope.getClassStats()
    });

    $scope.showDeleteWarning = function () {
      $scope.warningShowing = true
    }

    $scope.hideDeleteWarning = function () {
      $scope.warningShowing = false
    }

    $scope.deleteStudent = function (student) {
      var confirmDelete = confirm("Are you sure you want to DELETE " + student.firstName + " " + student.lastName + "?")
      if (confirmDelete == true) {
        StudentService.deleteStudent(student)
      $scope.currentStudent = {}
      $scope.editStudentShowing = false
      $scope.classStatsShowing = true
      $scope.hideDeleteWarning()
      }
    }

    $scope.$on('studentDeleted', function(event,msg) {
      $scope.setStudents()
      $scope.setCurrentStudents()
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

    $scope.showClass = function(clickedClass){
      $scope.hideAll()
      $scope.currentStudent = {}
      $scope.classStatsShowing = true
    }

    $scope.editClassName = function(newName) {
      $scope.edittingClassName = true
      var classMatch = false
      for (var i = 0; i < $scope.currentUser.classes.length; i++) {
        if ($scope.currentUser.classes[i] == newName) {
          classMatch = true
        }
      }

      if ( classMatch == true) {
        alert("There is already a class with the name " + newName + ". Please choose another name.")
        $scope.editedClassName = ""
      } else {
        for (var i = 0; i < $scope.currentUser.classes.length; i++) {
          if ($scope.currentUser.classes[i] == $scope.oldClassName) {
            $scope.currentUser.classes[i] = newName
          }
        }
        UserService.updateUser($scope.currentUser)

        for (var i = 0; i < $scope.students.length; i++) {
          if ($scope.students[i].className == $scope.oldClassName) {
            $scope.students[i].className = newName
            $scope.editStudent($scope.students[i])
          }
        }
        $scope.oldClassName = newName
        $scope.setStudents()
        $scope.setCurrentStudents()
        $scope.getClassStats()

        $scope.editedClassName = ""
        $scope.editClassNameForm.$setPristine();
      }

    }

  }]);


