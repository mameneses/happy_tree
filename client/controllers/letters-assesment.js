angular.module('HappyTree')
  .controller('LettersAssesmentCtrl', ['$scope', '$http', '$auth', 'StudentService', 'UserService','AssesmentService', '$filter', function($scope, $http, $auth, StudentService, UserService, AssesmentService, $filter) {

    var letters = [ {
                     upper: "A", 
                     lower: "a",
                     find_audio:"audio/a.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "B", 
                     lower: "b", 
                     find_audio:"audio/b.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "C", 
                     lower: "c",
                     find_audio:"audio/c.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "D", 
                     lower: "d",
                     find_audio:"audio/d.m4a",
                     sound_audio:" "
                     },

                    {
                     upper: "E", 
                     lower: "e", 
                     find_audio:"audio/e.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "F", 
                     lower: "f",
                     find_audio:"audio/f.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "G", 
                     lower: "g", 
                     find_audio:"audio/g.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "H", 
                     lower: "h", 
                     find_audio:"audio/h.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "I", 
                     lower: "i", 
                     find_audio:"audio/i.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "J", 
                     lower: "j", 
                     find_audio:"audio/j.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "K", 
                     lower: "k", 
                     find_audio:"audio/k.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "L", 
                     lower: "l", 
                     find_audio:"audio/l.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "M", 
                     lower: "m", 
                     find_audio:"audio/m.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "N", 
                     lower: "n", 
                     find_audio:"audio/n.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "O", 
                     lower: "o", 
                     find_audio:"audio/o.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "P", 
                     lower: "p", 
                     find_audio:"audio/p.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "Q", 
                     lower: "q", 
                     find_audio:"audio/q.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "R", 
                     lower: "r", 
                     find_audio:"audio/r.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "S", 
                     lower: "s", 
                     find_audio:"audio/s.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "T", 
                     lower: "t", 
                     find_audio:"audio/t.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "U", 
                     lower: "u", 
                     find_audio:"audio/u.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "V", 
                     lower: "v", 
                     find_audio:"audio/v.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "W", 
                     lower: "w", 
                     find_audio:"audio/w.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "X", 
                     lower: "x", 
                     find_audio:"audio/x.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "Y", 
                     lower: "y",
                     find_audio:"audio/y.m4a",
                     sound_audio:" "
                     },

                     {
                     upper: "Z", 
                     lower: "z", 
                     find_audio:"audio/z.m4a",
                     sound_audio:" "
                     }
                ];

      var shuffle = function(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
      };

      $scope.toPercentage =  function (input, decimals) {
        return $filter('number')(input * 100, decimals);
      };

      $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
      };

      $scope.letterList = shuffle(angular.copy(letters));
      var letterList = $scope.letterList
      $scope.correctLetter = letterList[0]
      $scope.correctLetterIndexCounter = 0
      $scope.letterBoard = shuffle([$scope.correctLetter, letterList[1],letterList[2],letterList[3],letterList[4],letterList[5],letterList[6],letterList[7],letterList[8]]);
      $scope.incorrectAnswers = []
      $scope.correctAnswers = []
      $scope.upper = false
      $scope.lower = false
      $scope.startButton = true
      $scope.sound = false
      $scope.finish = false

      $scope.allStudents = StudentService.getAllStudents()

      $scope.selectedStudent = {}

      $scope.promptShowing = false

      $scope.showPrompt = function() {
        $scope.promptShowing = true
      }

      $scope.hidePrompt = function() {
        $scope.promptShowing = false
      }

      var removeCorrectLetter = function (letterObject) {
        return letterObject.upper != $scope.correctLetter.upper
      }

      $scope.makeNewBoard = function () {
        $scope.newBoardLetters = angular.copy($scope.letterList).filter(removeCorrectLetter)
        $scope.letterBoard = shuffle($scope.newBoardLetters)
        $scope.letterBoard = $scope.letterBoard.slice(0,8)
        $scope.letterBoard.push($scope.correctLetter)
        $scope.letterBoard = shuffle($scope.letterBoard)
      }

      $scope.changeCorrectLetter = function () {
        if ($scope.correctLetterIndexCounter == 25) {
          $scope.finishAssesment()
        } else {
          $scope.correctLetterIndexCounter++
          $scope.correctLetter = letterList[$scope.correctLetterIndexCounter]
        }
      }

      $scope.recordAnswer = function (guess) {
        if (guess.upper == $scope.correctLetter.upper) {
          $scope.correctAnswers.push($scope.correctLetter.upper)
        } else {
          $scope.incorrectAnswers.push($scope.correctLetter.upper)
        }
      }

      $scope.playCorrectAudio = function () {
        var correctAudio = new Audio($scope.correctLetter.find_audio)
        correctAudio.play()
      }

      $scope.playDoneAudio = function () {
        var doneAudio = new Audio("audio/done.mp3")
        doneAudio.play()
      }

      $scope.letterGuess = function (guessedLetter) {
        $scope.recordAnswer(guessedLetter)
        $scope.changeCorrectLetter()
        $scope.makeNewBoard()
        $scope.playCorrectAudio()
      }

      $scope.resetAssesment = function () {
        $scope.correctLetterIndexCounter = 0
        $scope.letterList = shuffle(angular.copy(letters));
        $scope.incorrectAnswers = []
        $scope.correctAnswers = []  
        $scope.startButton = true
        $scope.upper = false
        $scope.lower = false
        $scope.sound = false
      }

      $scope.startLetterAssesment = function (type) {
        if ($scope.selectedStudent.firstName || !$scope.isAuthenticated()) {
          StudentService.setCurrentStudent($scope.selectedStudent)
          $scope.resetAssesment()
          $scope.startButton = false
          if (type == 1) {
            $scope.upper = true
          } else if (type == 2) {
            $scope.lower =true 
          } else {
            $scope.sound = true
            $scope.lower = true
          }
          $scope.playCorrectAudio()
        } else {
          alert("Don't forget to choose a student!")
        }

      }

      $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
      }

      $scope.finishAssesment = function () {
        $scope.playDoneAudio()
        if($scope.isAuthenticated() && $scope.selectedStudent.firstName) {
          $scope.save()
        }
        $scope.resetAssesment()
        $scope.finish = true
      }

      $scope.hideFinish = function () {
        $scope.finish = false
      }

      $scope.save =  function () {
        var assesmentName = ""
        if ($scope.upper) {
          assesmentName = "Uppercase"
        } else if ($scope.lower && !$scope.sound) {
          assesmentName = "Lowercase"
        } else if ($scope.sound) {
          assesmentName = "Sound"
        }
        var student = StudentService.getCurrentStudent()
        var teacher = UserService.getCurrentUser()
        var assesment = {
          teacherID: teacher._id,
          studentID: student._id,
          studentName: student.firstName + " " + student.lastName,
          name: assesmentName,
          type: "Letter",
          date: new Date().toLocaleString(),
          percentCorrect: $scope.toPercentage($scope.correctAnswers.length/26, 0),
          correctCount: $scope.correctAnswers.length.toString(),
          incorrectCount: $scope.incorrectAnswers.length.toString(),
          missed: $scope.incorrectAnswers
        }

        AssesmentService.save(assesment)    
      }

  }]);


