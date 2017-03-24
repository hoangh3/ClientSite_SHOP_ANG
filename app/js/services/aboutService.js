'use strict';

var aboutmeService = angular.module ('aboutmeService',[]);


aboutmeService.factory ('welcomeService', ['$http', function ($http) {
  return $http.get ('js/database/welcome.json')
  .success ( function (data) {
  return data;
           }).error (function (err) {
    return err;
  });
}]);

aboutmeService.factory('contactService', ['$http', function ($http) {
  return $http.get ('js/database/contact.json')
  .success ( function (data) {
    return data;
  }).error (function (err) {
    return err;
  });
}]);

aboutmeService.factory('memoriesService', ['$http', function ($http) {
  return $http.get ('js/database/memories.json')
  .success (function (data) {
    return data;
  }).error (function (err) {
    return err;
  });
}]);

aboutmeService.factory('storyService', ['$http', function ($http) {
  return $http.get ('js/database/story.json')
  .success (function (data) {
    return data;
  }).error (function (err) {
    return err;
  });
}]);
