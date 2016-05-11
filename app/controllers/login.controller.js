(function () {

  'use strict';

  angular
    .module('app')
    .controller('Login.IndexController', Controller);

    function Controller($http) {
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
          vm.loginSuccess = true;
        }).error(function(error) {
          vm.loginSuccess = false;
        });
        
      }

    }

})();