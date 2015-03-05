angular.module('HappyTree')
  .controller('SightWordsCtrl', function($scope, $window, StudentService, UserService, $auth) {

    $scope.defaultSightWordLists = [ 
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

                      name: "Pre-Primer" 
                    },
                  ];

    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
      };

    var shuffle = function(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
      };

    $scope.currentUser = JSON.parse($window.localStorage.currentUser);

    if ($scope.currentUser.sightWordLists) {
      $scope.allSightWordLists = $scope.defaultSightWordLists.concat($scope.currentUser.sightWordLists)
    } else {
      $scope.allSightWordLists = $scope.defaultSightWordLists
    }

    $scope.sightWordsShowing = true
    $scope.creatListShowing = false

    $scope.selectedStudent = {}
    $scope.allStudents = StudentService.getAllStudents()
    $scope.sightWords = angular.copy($scope.allSightWordLists[0])
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
      $scope.sightWords = angular.copy($scope.allSightWordLists[0])
      $scope.correctSightWordCount = 0
    }

    $scope.save = function() {
      var missedWords = []
      for ( var i = 0; i < $scope.sightWords.words.length; i++) {
        if ($scope.sightWords.words[i].correct == false) {
          missedWords.push($scope.sightWords.words[i].word)
        }
      }

      var incorrectSightWordCount = missedWords.length

      var assesment = {
        name: $scope.sightWords.name,
        date: new Date(),
        correctCount: $scope.correctSightWordCount.toString(),
        incorrectCount: incorrectSightWordCount.toString(),
        missedWords: missedWords
      }

      $scope.selectedStudent.sightWordAssesmentScores.push(JSON.stringify(assesment))

      console.log($scope.selectedStudent)

      StudentService.updateStudent($scope.selectedStudent)

      $scope.clear()

    }

    $scope.newWord = {word:"", correct:false}
    $scope.newList = {words:[], name:""}

    $scope.addWord = function() {
      $scope.newList.words.push($scope.newWord)
      $scope.newWord = {word:"", correct:false}
    }

    $scope.toggleView = function (){
      if ($scope.sightWordsShowing) {
        $scope.sightWordsShowing = false
        $scope.creatListShowing = true
      } else {
        $scope.sightWordsShowing = true
        $scope.creatListShowing = false
      }
    }

    $scope.saveList = function() {
      if($scope.currentUser.sightWordLists){
        $scope.currentUser.sightWordLists.push($scope.newList) 
      } else {
        $scope.currentUser.sightWordLists = [$scope.newList]
      }

      UserService.updateCurrentUser($scope.currentUser)

      $scope.currentUser = JSON.parse($window.localStorage.currentUser);

      console.log($scope.currentUser)

      $scope.newWord = {word:"", correct:false}
      $scope.newList = {words:[], name:""}
    }

  });