angular.module('HappyTree')
  .controller('SightWordsCtrl', function($scope, StudentService) {

    var sightWords = [ 
                  { words: [
                            { word:"a", correct: false }
                          , { word: "and", correct: false }
                          , { word: "away", correct: false }
                          , { word: "big", correct: false }
                          , { word: "blue", correct: false }
                          , { word: "can", correct: false }
                          , { word: "come", correct: false }
                          , { word: "down", correct: false }
                          , { word: "find", correct: false }
                          , { word: "for", correct: false }
                          , { word: "funny", correct: false }
                          , { word: "go", correct: false }
                          , { word: "help", correct: false }
                          , { word: "here", correct: false }
                          , { word: "I", correct: false }
                          , { word: "in", correct: false }
                          , { word: "is", correct: false }
                          , { word: "it", correct: false }
                          , { word: "jump", correct: false }
                          , { word: "little", correct: false }
                          , { word: "look", correct: false }
                          , { word: "make", correct: false }
                          , { word: "me", correct: false }
                          , { word: "my", correct: false }
                          , { word: "not", correct: false }
                          , { word: "one", correct: false }
                          , { word: "play", correct: false }
                          , { word: "red", correct: false }
                          , { word: "run", correct: false }
                          , { word: "said", correct: false }
                          , { word: "see", correct: false }
                          , { word: "the", correct: false }
                          , { word: "three", correct: false }
                          , { word: "to", correct: false }
                          , { word: "two", correct: false }
                          , { word: "up ", correct: false }
                          , { word: "we", correct: false }
                          , { word: "where", correct: false }
                          , { word: "yellow", correct: false }
                          , { word: "you", correct:false }

                          ],

                      grade: "Pre-Primer" 
                    }
                  ];

    var shuffle = function(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
      };

    $scope.selectedStudent = {}
    $scope.allStudents = StudentService.getAllStudents()
    shuffle(sightWords[0].words)
    $scope.sightWords = angular.copy(sightWords[0])
    $scope.correctSightWordCount = 0

    var sightWordIncorrect = function (word) {
      word.correct = false
      $scope.correctSightWordCount--
    }

    var sightWordCorrect = function (word) {
      word.correct = true
      $scope.correctSightWordCount++
    }

    $scope.checkSightWord = function (word) {
      if (word.correct == false) {
        sightWordCorrect(word)
      } else {
        sightWordIncorrect(word)
      }
    }

    $scope.clear = function () {
      $scope.sightWords = angular.copy(sightWords[0])
    }
  });