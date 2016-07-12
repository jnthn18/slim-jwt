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
        controllerAs: 'vm',
        params: { message: null },
        authenticate: false
      })
      .state('register', {
        'url': '/register',
        templateUrl: 'app/views/register.html',
        controller: 'Register.IndexController',
        controllerAs: 'vm',
        authenticate: false
      })
      .state('user', {
        'url': '/user',
        templateUrl: 'app/views/user.html',
        controller: 'User.IndexController',
        controllerAs: 'vm',
        authenticate: true
      });

  }

  function run($rootScope, $state, AuthService) {
    
    // add JWT token as default auth header
    // $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.localStorage.getItem('token');

    $rootScope.$on('$stateChangeStart', function(event, toState, toSParams, fromState, fromParams) {
      if (toState.authenticate && !AuthService.isAuth()){
        $state.transitionTo('login');
        event.preventDefault();
      }
    });
  }


})();