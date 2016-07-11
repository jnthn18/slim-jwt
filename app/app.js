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
        params: { message: null }
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
        controllerAs: 'vm',
      });

      // function authenticate($q, AuthService, $state, $timeout) {
      //   if (AuthService.Authenticate()) {
      //     return $q.when();
      //   } else {
      //     $timeout(function() {
      //       $state.go('login');
      //     });

      //     return $q.reject();
      //   }
      // }
  }

  function run($http, $rootScope, $window, AuthService) {
    // $rootScope.loggedIn = AuthService.isLoggedIn();
    // $rootScope.displayName = AuthService.getIdentity();
    
    // add JWT token as default auth header
    // $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.localStorage.getItem('token');

    // $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
    //   $rootScope.toState = toState;
    //   $rootScope.toStateParams = toStateParams;

    //   if(AuthService.getIdentity()) AuthService.Authenticate();
    // });
  }


})();