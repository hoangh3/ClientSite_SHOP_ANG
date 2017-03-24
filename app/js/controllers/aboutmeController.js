'use strict';

var aboutmeController = angular.module('aboutmeController', [
  'ngRoute',
  'ui.bootstrap',
  'ngMaterial'
]);

aboutmeController.controller('AboutController', ['$scope', 'welcomeService',
  function ($scope,welcomeService) {
    welcomeService.success (function (data) {
      $scope.welcome = data;
    });
}]);


aboutmeController.controller('ContactController', ['$scope', 'contactService',
  function ($scope,contactService) {
    contactService.success (function (data) {
      $scope.contact = data;
    });
}]);

aboutmeController.controller('StoryController', ['$scope', 'storyService',
  function ($scope,storyService) {
    storyService.success (function (data) {
      $scope.story = data;
    });
}]);

aboutmeController.controller('FriendController', ['$scope', 'memoriesService', '$mdDialog',
  function ($scope,memoriesService,$mdDialog) {
    memoriesService.success (function (data) {
      $scope.friends = data.friends;
    });
    $scope.myInterval = 3000;
    $scope.noWrapSlides = false;
    $scope.activeSlide = 0;
    $scope.showTab = function(ev,id) {
      $mdDialog.show({
        controller: DialogController,
        contentElement: '#content' + id,
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    };
}]);

aboutmeController.controller('FamilyController', ['$scope', 'memoriesService', '$mdDialog',
  function ($scope, memoriesService, $mdDialog) {
    memoriesService.success (function (data) {
      $scope.families = data.families;
    });
    $scope.myInterval = 3000;
    $scope.noWrapSlides = false;
    $scope.activeSlide = 0;
    $scope.showTab2 = function(ev,id) {
      $mdDialog.show({
        controller: DialogController,
        contentElement: '#content2' + id,
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    };
}]);

aboutmeController.controller('ChildhoodController', ['$scope', 'memoriesService', 
  function ($scope, memoriesService) {
    memoriesService.success (function (data) {
      $scope.childhood = data.childhood;
    });
    $scope.myInterval = 3000;
    $scope.noWrapSlides = false;
    $scope.activeSlide = 0;
}]);

aboutmeController.controller('HobbiesController', ['$scope', 'memoriesService', '$mdDialog',
  function ($scope, memoriesService, $mdDialog) {
    memoriesService.success (function (data) {
      $scope.hobbies = data.hobbies;
    });
    $scope.myInterval = 3000;
    $scope.noWrapSlides = false;
    $scope.activeSlide = 0;
    $scope.showTab3 = function(ev,id) {
      $mdDialog.show({
        controller: DialogController,
        contentElement: '#content3' + id,
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      });
    };
}]);

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}  
