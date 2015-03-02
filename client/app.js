angular.module('HappyTree', ['ngRoute', 'satellizer', 'chart.js'])
  .config(function($routeProvider, $authProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/animal_alphabet', {
        templateUrl: 'views/animal_alphabet.html',
        controller: 'AnimalAlphabetCtrl'
      })
      .when('/sight_words', {
        templateUrl: 'views/sight_words.html',
        controller: 'SightWordsCtrl'
      })
      .when('/letters_assesment', {
        templateUrl: 'views/letters_assesment.html',
        controller: 'LettersAssesmentCtrl'
      })
      .when('/students', {
        templateUrl: 'views/students.html',
        controller: 'StudentsCtrl'
      })
      .otherwise('/')

    $authProvider.loginUrl = 'http://localhost:3000/auth/login';
    $authProvider.signupUrl = 'http://localhost:3000/auth/signup';

  });