(function () {

  'use strict';

  angular
    .module('app')
    .controller('Login.IndexController', Controller);

    function Controller($http, $window, $state, $rootScope) {
      var vm = this;

      vm.email = null;
      vm.password = null;
      vm.loginSuccess = true;

      vm.login = login;

      function login() {
        vm.submitted = true;
        var info = {
          email: vm.email,
          password: vm.password
        }

        $http.post('api/login', info).success(function(data) {
          var token = data['token'];
          var display = data['displayName'];
          $window.localStorage.setItem('token', token);
          $window.localStorage.setItem('displayName', display);
          $rootScope.displayName = display;
          $rootScope.loggedIn = true;
          $state.go('user');
        }).error(function(error) {
          vm.loginSuccess = false;
        });
        
      }

    }

})();