angular.module('HappyTree')
  .controller('SightWordsCtrl', ['$scope', '$window', 'StudentService', 'UserService', '$auth', function($scope, $window, StudentService, UserService, $auth) {

    $scope.defaultSightWordLists = [ 
                  { name: "Pre-Primer", words: [{ word:"a", correct: false }, { word: "and", correct: false }, { word: "away", correct: false }, { word: "big", correct: false }, { word: "blue", correct: false }, { word: "can", correct: false }, { word: "come", correct: false }, { word: "down", correct: false }, { word: "find", correct: false }, { word: "for", correct: false }, { word: "funny", correct: false }, { word: "go", correct: false }, { word: "help", correct: false }, { word: "here", correct: false }, { word: "I", correct: false }, { word: "in", correct: false }, { word: "is", correct: false }, { word: "it", correct: false }, { word: "jump", correct: false }, { word: "little", correct: false }, { word: "look", correct: false }, { word: "make", correct: false }, { word: "me", correct: false }, { word: "my", correct: false }, { word: "not", correct: false }, { word: "one", correct: false }, { word: "play", correct: false }, { word: "red", correct: false }, { word: "run", correct: false }, { word: "said", correct: false }, { word: "see", correct: false }, { word: "the", correct: false }, { word: "three", correct: false }, { word: "to", correct: false }, { word: "two", correct: false }, { word: "up ", correct: false }, { word: "we", correct: false }, { word: "where", correct: false }, { word: "yellow", correct: false }, { word: "you", correct:false }]},
                  { name:"Primer", words: [{correct: false, word:"all"},{correct: false, word:"am"},{correct: false, word:"are"},{correct: false, word:"at"},{correct: false, word:"ate"},{correct: false, word:"be"},{correct: false, word:"black"},{correct: false, word:"brown"},{correct: false, word:"but"},{correct: false, word:"came"},{correct: false, word:"did"},{correct: false, word:"do"},{correct: false, word:"eat"},{correct: false, word:"four"},{correct: false, word:"get"},{correct: false, word:"good"},{correct: false, word:"have"},{correct: false, word:"he"},{correct: false, word:"into"},{correct: false, word:"like"},{correct: false, word:"must"},{correct: false, word:"no"},{correct: false, word:"now"},{correct: false, word:"on"},{correct: false, word:"out"},{correct: false, word:"out"},{correct: false, word:"please"},{correct: false, word:"our"},{correct: false, word:"pretty"},{correct: false, word:"ran"},{correct: false, word:"ride"},{correct: false, word:"saw"},{correct: false, word:"say"},{correct: false, word:"she"},{correct: false, word:"so"},{correct: false, word:"soon"},{correct: false, word:"that"},{correct: false, word:"there"},{correct: false, word:"they"},{correct: false, word:"this"},{correct: false, word:"too"},{correct: false, word:"under"}]}
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
      $scope.allSightWordListsBlank = angular.copy($scope.allSightWordLists)
    } else {
      $scope.allSightWordLists = $scope.defaultSightWordLists
      $scope.allSightWordListsBlank = angular.copy($scope.allSightWordLists)
    }

    $scope.sightWordsShowing = false
    $scope.createListShowing = true
    $scope.listHover = false
    $scope.wordHover = false

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
      for (var i = 0; i < $scope.allSightWordLists.length; i++) {
        if ($scope.sightWords.name == $scope.allSightWordListsBlank[i].name) {
          $scope.sightWords = angular.copy($scope.allSightWordListsBlank[i])
        }
      }
      $scope.allSightWordLists = angular.copy($scope.allSightWordListsBlank)
      $scope.correctSightWordCount = 0
    }

    $scope.save = function() {
      var missedWords = []

      var sightWordListLength = $scope.sightWords.words.length
      var sightWordListWords = $scope.sightWords.words
      for ( var i = 0; i < sightWordListLength; i++) {
        if (sightWordListWords[i].correct == false) {
          missedWords.push(sightWordListWords[i].word)
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
      StudentService.updateStudent($scope.selectedStudent)
      $scope.clear()
    }

    $scope.newWord = {word:"", correct:false}
    $scope.currentList = {words:[], name:""}

    $scope.addWord = function() {
      $scope.currentList.words.push($scope.newWord)
      $scope.newWord = {word:"", correct:false}
    }

    $scope.toggleView = function (){
      if ($scope.sightWordsShowing) {
        $scope.sightWordsShowing = false
        $scope.createListShowing = true
      } else {
        $scope.sightWordsShowing = true
        $scope.createListShowing = false
      }
    }

    $scope.setCurrentList = function(list) {
      $scope.currentList = list
    }

    $scope.deleteList = function (list) {
      for ( var i = 0; i < $scope.currentUser.sightWordLists.length; i++) {
        if ($scope.currentUser.sightWordLists[i].name == list.name) {
          $scope.currentUser.sightWordLists.splice(i,1)
        }
      }
      UserService.updateCurrentUser($scope.currentUser)
      setTimeout(function() {$scope.currentUser = JSON.parse($window.localStorage.currentUser);}, 1000);
    }

    $scope.deleteWord = function (word) {

      var currentListWordsLength = $scope.currentList.words.length
      var currentListWords = $scope.currentList.words

      for ( var i = 0; i < currentListWordsLength; i++) {
        if (currentListWords[i].word == word) {
          currentListWords.splice(i,1)
        }
      }
    }

    $scope.saveList = function() {

      if($scope.currentUser.sightWordLists){
        var noListMatch = true

        console.log(JSON.stringify($scope.currentList))
        for ( var i = 0; i < $scope.currentUser.sightWordLists.length; i++) {
          if ($scope.currentUser.sightWordLists[i].name == $scope.currentList.name) {
            $scope.currentUser.sightWordLists[i] = $scope.currentList
            noListMatch = false 
          }
        }
        if (noListMatch) {
          $scope.currentUser.sightWordLists.push($scope.currentList) 
        }
      } else {
        $scope.currentUser.sightWordLists = [$scope.currentList]
      }

      UserService.updateCurrentUser($scope.currentUser)

      setTimeout(function() {
        $scope.currentUser = JSON.parse($window.localStorage.currentUser);
        $scope.allSightWordLists = $scope.defaultSightWordLists.concat($scope.currentUser.sightWordLists)
        $scope.allSightWordListsBlank = angular.copy($scope.allSightWordLists)
      }, 1000);

      $scope.newWord = {word:"", correct:false}
      $scope.currentList = {words:[], name:""}
    }

  }]);