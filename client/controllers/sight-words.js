angular.module('HappyTree')
  .controller('SightWordsCtrl', ['$scope', '$window', 'StudentService', 'UserService', 'AssesmentService','$auth', '$rootScope', '$filter', function($scope, $window, StudentService, UserService, AssesmentService, $auth, $rootScope, $filter) {

    $scope.defaultSightWordLists = [ 
                  { name: "PrePrimer", words: [{ word:"a", correct: false }, { word: "and", correct: false }, { word: "away", correct: false }, { word: "big", correct: false }, { word: "blue", correct: false }, { word: "can", correct: false }, { word: "come", correct: false }, { word: "down", correct: false }, { word: "find", correct: false }, { word: "for", correct: false }, { word: "funny", correct: false }, { word: "go", correct: false }, { word: "help", correct: false }, { word: "here", correct: false }, { word: "I", correct: false }, { word: "in", correct: false }, { word: "is", correct: false }, { word: "it", correct: false }, { word: "jump", correct: false }, { word: "little", correct: false }, { word: "look", correct: false }, { word: "make", correct: false }, { word: "me", correct: false }, { word: "my", correct: false }, { word: "not", correct: false }, { word: "one", correct: false }, { word: "play", correct: false }, { word: "red", correct: false }, { word: "run", correct: false }, { word: "said", correct: false }, { word: "see", correct: false }, { word: "the", correct: false }, { word: "three", correct: false }, { word: "to", correct: false }, { word: "two", correct: false }, { word: "up ", correct: false }, { word: "we", correct: false }, { word: "where", correct: false }, { word: "yellow", correct: false }, { word: "you", correct:false }]},
                  { name:"Primer", words: [{correct: false, word:"all"},{correct: false, word:"am"},{correct: false, word:"are"},{correct: false, word:"at"},{correct: false, word:"ate"},{correct: false, word:"be"},{correct: false, word:"black"},{correct: false, word:"brown"},{correct: false, word:"but"},{correct: false, word:"came"},{correct: false, word:"did"},{correct: false, word:"do"},{correct: false, word:"eat"},{correct: false, word:"four"},{correct: false, word:"get"},{correct: false, word:"good"},{correct: false, word:"have"},{correct: false, word:"he"},{correct: false, word:"into"},{correct: false, word:"like"},{correct: false, word:"must"},{correct: false, word:"no"},{correct: false, word:"now"},{correct: false, word:"on"},{correct: false, word:"out"},{correct: false, word:"out"},{correct: false, word:"please"},{correct: false, word:"our"},{correct: false, word:"pretty"},{correct: false, word:"ran"},{correct: false, word:"ride"},{correct: false, word:"saw"},{correct: false, word:"say"},{correct: false, word:"she"},{correct: false, word:"so"},{correct: false, word:"soon"},{correct: false, word:"that"},{correct: false, word:"there"},{correct: false, word:"they"},{correct: false, word:"this"},{correct: false, word:"too"},{correct: false, word:"under"}]}
                  ];

    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
      };

    var shuffle = function(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
      };

    $scope.toPercentage =  function (input, decimals) {
      return $filter('number')(input * 100, decimals);
    };

    $scope.promptShowing = false

    $scope.showPrompt = function() {
      console.log($rootScope.currentUser)
      $scope.promptShowing = true
    }

    $scope.hidePrompt = function() {
      $scope.promptShowing = false
    }

    $scope.currentUser = {}

    if($scope.isAuthenticated()) {
      $scope.currentUser = JSON.parse($window.localStorage.currentUser);
    }

    if ($scope.currentUser.sightWordLists) {
      $scope.allSightWordLists = $scope.defaultSightWordLists.concat($scope.currentUser.sightWordLists)
      $scope.allSightWordListsBlank = angular.copy($scope.allSightWordLists)
    } else {
      $scope.allSightWordLists = $scope.defaultSightWordLists
      $scope.allSightWordListsBlank = angular.copy($scope.allSightWordLists)
    }

    $scope.sightWordsShowing = true
    $scope.createListShowing = false
    $scope.listHover = false
    $scope.wordHover = false

    $scope.selectedStudent = {}

    if ($scope.isAuthenticated()) {
      $scope.allStudents = StudentService.getAllStudents()
    }

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

    $scope.resetSightWords = function () {
      for (var i = 0; i < $scope.allSightWordLists.length; i++) {
        if ($scope.sightWords.name == $scope.allSightWordListsBlank[i].name) {
          $scope.sightWords = angular.copy($scope.allSightWordListsBlank[i])
        }
      }
      $scope.allSightWordLists = angular.copy($scope.allSightWordListsBlank)
      $scope.correctSightWordCount = 0
    }

    $scope.save = function() {
        if($scope.selectedStudent.firstName && $scope.selectedStudent != null) {

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
            teacherID: $scope.currentUser._id,
            studentID: $scope.selectedStudent._id,
            studentName: $scope.selectedStudent.firstName + " " + $scope.selectedStudent.lastName,
            type: "Sight Words",
            name: $scope.sightWords.name,
            date: new Date(),
            percentCorrect: $scope.toPercentage($scope.correctSightWordCount/($scope.correctSightWordCount + incorrectSightWordCount), 0),
            correctCount: $scope.correctSightWordCount.toString(),
            incorrectCount: incorrectSightWordCount.toString(),
            missed: missedWords
          }

          AssesmentService.save(assesment)

          $scope.resetSightWords()
        } else {
          alert("Don't forget to choose a student!")
        }
      
    }

    $scope.newWord = {word:"", correct:false}
    $scope.currentList = {words:[], name:""}

    $scope.addWord = function() {
      if ($scope.newWord.word) {
        $scope.currentList.words.push($scope.newWord)
        $scope.newWord = {word:"", correct:false}
      }
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
          break;
        }
      }
      UserService.updateUser($scope.currentUser)
    }

    $scope.deleteWord = function (word) {

      var currentListWordsLength = $scope.currentList.words.length
      var currentListWords = $scope.currentList.words

      for ( var i = 0; i < currentListWordsLength; i++) {
        if (currentListWords[i].word == word) {
          currentListWords.splice(i,1)
          break;
        }
      }
    }

    $scope.saveList = function() {

      if($scope.isAuthenticated()) {
        if($scope.currentUser.sightWordLists){
          var matchingList = false
          for ( var i = 0; i < $scope.currentUser.sightWordLists.length; i++) {
            if ($scope.currentUser.sightWordLists[i].name == $scope.currentList.name) {
              $scope.currentUser.sightWordLists[i] = $scope.currentList
              matchingList = true 
            }
          }
          if (matchingList == false) {
            $scope.currentUser.sightWordLists.push($scope.currentList) 
          }
        } else {
          $scope.currentUser.sightWordLists = [$scope.currentList]
        }

        UserService.updateUser($scope.currentUser)

        $scope.newWord = {word:"", correct:false}
        $scope.currentList = {words:[], name:""}
        $scope.createListForm.$setPristine()

      } else {
        alert("Sign Up or Log In to save your sight word list!")
      }

    }

    $scope.$on('userUpdated', function(event,msg) {
      $scope.currentUser = JSON.parse($window.localStorage.currentUser);
      $scope.allSightWordLists = $scope.defaultSightWordLists.concat($scope.currentUser.sightWordLists)
      $scope.allSightWordListsBlank = angular.copy($scope.allSightWordLists)
    });

  }]);