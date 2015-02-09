angular.module('HappyTree', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/animal_alphabet', {
        templateUrl: 'views/animal_alphabet.html',
        controller: 'AnimalAlphabetCtrl'
      })
      .when('/sight_words', {
        templateUrl: 'views/sight_words.html',
        controller: 'SightWordsCtrl'
      })
      .otherwise('/');

      
  });