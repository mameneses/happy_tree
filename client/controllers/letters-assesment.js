angular.module('HappyTree')
  .controller('LettersAssesmentCtrl', function($scope) {

    var letters = [ {
                     upper: "A", 
                     lower: "a",
                     find_audio:""
                     },

                     {
                     upper: "B", 
                     lower: "b", 
                     find_audio:""
                     },

                     {
                     upper: "C", 
                     lower: "c",
                     find_audio:""
                     },

                     {
                     upper: "D", 
                     lower: "d",
                     find_audio:""
                     },

                    {
                     upper: "E", 
                     lower: "e", 
                     find_audio:""
                     },

                     {
                     upper: "F", 
                     lower: "f",
                     find_audio:""
                     },

                     {
                     upper: "G", 
                     lower: "g", 
                     find_audio:""
                     },

                     {
                     upper: "H", 
                     lower: "h", 
                     find_audio:""
                     },

                     {
                     upper: "I", 
                     lower: "i", 
                     find_audio:""
                     },

                     {
                     upper: "J", 
                     lower: "j", 
                     find_audio:""
                     },

                     {
                     upper: "K", 
                     lower: "k", 
                     find_audio:""
                     },

                     {
                     upper: "L", 
                     lower: "l", 
                     find_audio:""
                     },

                     {
                     upper: "M", 
                     lower: "m", 
                     find_audio:""
                     },

                     {
                     upper: "N", 
                     lower: "n", 
                     find_audio:""
                     },

                     {
                     upper: "O", 
                     lower: "o", 
                     find_audio:""
                     },

                     {
                     upper: "P", 
                     lower: "p", 
                     find_audio:""
                     },

                     {
                     upper: "Q", 
                     lower: "q", 
                     find_audio:""
                     },

                     {
                     upper: "R", 
                     lower: "r", 
                     find_audio:""
                     },

                     {
                     upper: "S", 
                     lower: "s", 
                     find_audio:""
                     },

                     {
                     upper: "T", 
                     lower: "t", 
                     find_audio:""
                     },

                     {
                     upper: "U", 
                     lower: "u", 
                     find_audio:""
                     },

                     {
                     upper: "V", 
                     lower: "v", 
                     find_audio:""
                     },

                     {
                     upper: "W", 
                     lower: "w", 
                     find_audio:""
                     },

                     {
                     upper: "X", 
                     lower: "x", 
                     find_audio:""
                     },

                     {
                     upper: "Y", 
                     lower: "y",
                     find_audio:""
                     },

                     {
                     upper: "Z", 
                     lower: "z", 
                     find_audio:""
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
      console.log($scope.finish)

      var filterByUpper = function (letterObject) {
        return letterObject.upper != $scope.correctLetter.upper
      }

      $scope.makeNewBoard = function () {
        $scope.newBoardLetters = angular.copy($scope.letterList).filter(filterByUpper)
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
          $scope.correctLetter = $scope.letterList[$scope.correctLetterIndexCounter]
        }
      }

      $scope.recordAnswer = function (guess) {
        if (guess.upper == $scope.correctLetter.upper) {
          $scope.correctAnswers.push(guess)
        } else {
          $scope.incorrectAnswers.push(guess)
        }
      }

      $scope.letterGuess = function (guessedLetter) {
        $scope.recordAnswer(guessedLetter)
        $scope.changeCorrectLetter()
        $scope.makeNewBoard()
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

      $scope.switchCase = function() {
        if ($scope.upper == true) {
          $scope.upper = false
          $scope.lower = true
        } else {
          $scope.upper = true
          $scope.lower = false
        }
      }
      $scope.startLetterAssesment = function (type) {
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

      }
      $scope.finishAssesment = function () {
        $scope.save()
        $scope.resetAssesment()
        $scope.finish = true
      }

      $scope.hideFinish = function () {
        $scope.finish = false
      }

      $scope.save =  function ( ) {

      }



  });


