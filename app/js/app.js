'use strict';

var app = angular.module('app', [
  'ngRoute',
  'angularUtils.directives.dirPagination',
  'aboutmeService',
  'aboutmeController',
  'shopService',
  'shopController'
]);

app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
  $routeProvider
  .when('/aboutMe', {
    templateUrl: 'view/AboutMe.html',
    controller: 'AboutController'
  }).when('/shop', {
    templateUrl: 'view/shop.html',
    controller: 'ProductController'
  }).when('/shoppingBag', {
    templateUrl: 'view/shoppingBag.html',
    controller: 'ProductController'
  }).when('/checkout', {
    templateUrl: 'view/checkout.html'
  }).when('/register', {
    templateUrl: 'view/register.html'
  }).when('/payment', {
    templateUrl: 'view/payment.html',
    controller: 'CustomerController'
  }).when('/purchaseHistory', {
    templateUrl: 'view/purchaseHistory.html',
    controller: 'CustomerController'
  }).when('/style', {
    templateUrl: 'view/style.html'
  }).when('/sign_up', {
    templateUrl: 'view/sign_up.html',
    controller: 'SignUpController'
  }).when('/sign_in', {
    templateUrl: 'view/sign_in.html'
  }).when('/password_reset', {
    templateUrl: 'view/password_reset.html'
  }).when('/sent_token_to_server', {
    templateUrl: 'view/token.html'
  }).when('/change_password', {
    templateUrl: 'view/change_password.html'
  })
  .otherwise('style');
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);
