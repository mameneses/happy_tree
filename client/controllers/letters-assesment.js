angular.module('HappyTree')
  .controller('LettersAssesmentCtrl', function($scope, $http, $auth, StudentService) {

    var letters = [ {
                     upper: "A", 
                     lower: "a",
                     find_audio:"audio/a.m4a"
                     },

                     {
                     upper: "B", 
                     lower: "b", 
                     find_audio:"audio/b.m4a"
                     },

                     {
                     upper: "C", 
                     lower: "c",
                     find_audio:"audio/c.m4a"
                     },

                     {
                     upper: "D", 
                     lower: "d",
                     find_audio:"audio/d.m4a"
                     },

                    {
                     upper: "E", 
                     lower: "e", 
                     find_audio:"audio/e.m4a"
                     },

                     {
                     upper: "F", 
                     lower: "f",
                     find_audio:"audio/f.m4a"
                     },

                     {
                     upper: "G", 
                     lower: "g", 
                     find_audio:"audio/g.m4a"
                     },

                     {
                     upper: "H", 
                     lower: "h", 
                     find_audio:"audio/h.m4a"
                     },

                     {
                     upper: "I", 
                     lower: "i", 
                     find_audio:"audio/i.m4a"
                     },

                     {
                     upper: "J", 
                     lower: "j", 
                     find_audio:"audio/j.m4a"
                     },

                     {
                     upper: "K", 
                     lower: "k", 
                     find_audio:"audio/k.m4a"
                     },

                     {
                     upper: "L", 
                     lower: "l", 
                     find_audio:"audio/l.m4a"
                     },

                     {
                     upper: "M", 
                     lower: "m", 
                     find_audio:"audio/m.m4a"
                     },

                     {
                     upper: "N", 
                     lower: "n", 
                     find_audio:"audio/n.m4a"
                     },

                     {
                     upper: "O", 
                     lower: "o", 
                     find_audio:"audio/o.m4a"
                     },

                     {
                     upper: "P", 
                     lower: "p", 
                     find_audio:"audio/p.m4a"
                     },

                     {
                     upper: "Q", 
                     lower: "q", 
                     find_audio:"audio/q.m4a"
                     },

                     {
                     upper: "R", 
                     lower: "r", 
                     find_audio:"audio/r.m4a"
                     },

                     {
                     upper: "S", 
                     lower: "s", 
                     find_audio:"audio/s.m4a"
                     },

                     {
                     upper: "T", 
                     lower: "t", 
                     find_audio:"audio/t.m4a"
                     },

                     {
                     upper: "U", 
                     lower: "u", 
                     find_audio:"audio/u.m4a"
                     },

                     {
                     upper: "V", 
                     lower: "v", 
                     find_audio:"audio/v.m4a"
                     },

                     {
                     upper: "W", 
                     lower: "w", 
                     find_audio:"audio/w.m4a"
                     },

                     {
                     upper: "X", 
                     lower: "x", 
                     find_audio:"audio/x.m4a"
                     },

                     {
                     upper: "Y", 
                     lower: "y",
                     find_audio:"audio/y.m4a"
                     },

                     {
                     upper: "Z", 
                     lower: "z", 
                     find_audio:"audio/z.m4a"
                     }
                ];

      var shuffle = function(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
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

      $scope.allStudents = [{ID:0, firstName: "Matias", lastName:"Meneses"},{ID:0, firstName: "Tim", lastName:"Ryan"},{ID:0, firstName: "Sam", lastName:"Lewis"} ]
      
      $scope.selectedStudent = {}

      // $scope.setStudent = function(selectedStudent) {
      //   studentService.setCurrentStudent(selectedStudent)
      // }
      
      // $scope.$on('handleStudentBoradcast', function() {
      //   $scope.currentStudent = studentService.firstName
      // })


      var filterByUpper = function (letterObject) {
        return letterObject.upper != $scope.correctLetter.upper
      }

      $scope.makeNewBoard = function () {
        $scope.newBoardLetters = angular.copy($scope.letterList).filter(filterByUpper)
        console.log($scope.newBoardLetters.length)
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
          $scope.correctAnswers.push(guess)
        } else {
          $scope.incorrectAnswers.push(guess)
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
        console.log($scope.correctLetter)
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
      }

      $scope.startLetterAssesment = function (type) {
        StudentService.setCurrentStudent($scope.selectedStudent)
        $scope.resetAssesment()
        $scope.startButton = false
        if (type == 1) {
          $scope.upper = true
        } else if (type == 2) {
          $scope.lower =true 
        } else {
          $scope.sound = true
          $scope.lower =true
        }
        $scope.playCorrectAudio()

      }
      $scope.finishAssesment = function () {
        $scope.playDoneAudio()
        $scope.save()
        $scope.resetAssesment()
        $scope.finish = true
      }

      $scope.hideFinish = function () {
        $scope.finish = false
      }

      $scope.save =  function ( ) {

        $http.get('http://localhost:3000/api/users')
          .success(function(data) {
            console.log(data)
          })
          .error(function(data) {
            console.log(data)
          });
      }



  });


