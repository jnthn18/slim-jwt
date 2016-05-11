(function () {

  'use strict';

  angular
    .module('app')
    .controller('Login.IndexController', Controller);

    function Controller($http) {
      var vm = this;

      vm.email = null;
      vm.password = null;

      vm.login = login;

      function login() {
        var info = {
          email: vm.email,
          password: vm.password
        }

        $http.post('api/login', info).success(function(data) {
          console.log(data);
        }).error(function(error) {
          console.log(error);
        });
      }

    }

})();