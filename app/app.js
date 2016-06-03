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
        templateUrl: 'app/views/login.html',
        controller: 'Login.IndexController',
        controllerAs: 'vm'
      })
      .state('register', {
        'url': '/register',
        templateUrl: 'app/views/register.html',
        controller: 'Register.IndexController',
        controllerAs: 'vm'
      })
      .state('user', {
        'url': '/user',
        templateUrl: 'app/views/user.html',
        controller: 'User.IndexController',
        controllerAs: 'vm'
      });
  }

  function run($http, $rootScope, $window) {
    // add JWT token as default auth header
    // $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.localStorage.getItem('token');
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