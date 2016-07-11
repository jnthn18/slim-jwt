(function () {

  'use strict';

  angular
    .module('app')
    .controller('Login.IndexController', Controller);

    function Controller(AuthService, $http, $window, $state, $stateParams) {
      var vm = this;

      vm.email = null;
      vm.password = null;
      vm.loginSuccess = true;
      vm.message = $stateParams.message;

      vm.login = login;

      function login() {
        vm.submitted = true;
        var info = {
          email: vm.email,
          password: vm.password
        }

        AuthService.logIn(info).then(function(data) {
          if(data.token !== null) {
            vm.loginSuccess = true;
            $window.localStorage.setItem('token', data.token);
            $state.go('user');
          } else {
            vm.loginSuccess = false;
          }
        });
        
      }

    }

})();