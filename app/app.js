(function () {
  'use strict';

  angular
    .module('app', ['ui.router'])
    .config(config)
    .run(run);

  function config($stateProvider, $urlRouterProvider) {
    // default route
    $urlRouterProvider.otherwise("/login");

    $stateProvider
      .state('login', {
        'url': '/login',
        templateUrl: 'home/login.html',
        controller: 'Login.IndexController',
        controllerAs: 'vm'
      })
      .state('register', {
        'url': '/register',
        templateUrl: 'home/register.html',
        controller: 'Register.IndexController',
        controllerAs: 'vm'
      });
  }

  function run($http, $rootScope, $window) {
    // add JWT token as default auth header
    $http.defaults.headers.common['Authorization'] = 'Bearer' + $window.jwtToken;

  }

  // manually bootstrap angular after the JWT token is retrieved from the server
  // $(function () {
  //   // get JWT token from server
  //   $.get('app/token', function (token) {
  //     window.jwtToken = token;

  //     angular.bootstrap(document, ['app']);
  //   });
  // });

})();