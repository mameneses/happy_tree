angular.module('HappyTree')
  .factory('AssesmentService', ['$http', '$window', '$auth', '$rootScope', function($http, $window, $auth, $rootScope) {
    var apiAddress = "http://localhost:3000/api/"
    return {
      save: function(assesment) {

        $http.post(apiAddress + "assesments", assesment).
          success(function(data, status, headers, config) {
            $window.localStorage.assesments = JSON.stringify(data);
            $rootScope.$broadcast('assesmentsUpdated')
          }).
          error(function(data, status, headers, config) {

          })

      },

      getAssesments: function() {

        var allAssesments = JSON.parse($window.localStorage.assesments)
        return allAssesments
      },

      getSortedAssesments: function() {
        var sortedAssesments = {letter:[],sightWords:[]}
        var currentAssesments = this.getAssesments()

        for(var i =0; i < currentAssesments.length; i++) {
          if(currentAssesments[i].type == "Letter") {
            sortedAssesments.letter.push(currentAssesments[i])
          } else if (currentAssesments[i].type == "Sight Words") {
            sortedAssesments.sightWords.push(currentAssesments[i])
          }
        }

        return sortedAssesments

      },

      getStudentAssesments: function(student){
        var assesments = this.getAssesments()
        var currentStudentAssesments = {letter:[], sightWords:[]}

        for(var i = 0; i < assesments.length; i++){
          if(assesments[i].studentID == student._id) {
            if(assesments[i].type == "Letter") {
              currentStudentAssesments.letter.push(assesments[i])
            } else if (assesments[i].type == "Sight Words") {
              currentStudentAssesments.sightWords.push(assesments[i])
            }
          }
        }

        return currentStudentAssesments
      },

      getAssesmentsFromDB: function() {
        var currentUser = JSON.parse($window.localStorage.currentUser)

        $http.get(apiAddress + "assesments/" + currentUser._id).
          success(function(data, status, headers, config) {
            $window.localStorage.assesments = JSON.stringify(data);
            $rootScope.$broadcast('assesmentsRetrieved')
          }).
          error(function(data, status, headers, config) {

          });
      }

    }
  }]); 