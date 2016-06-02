(function () {

  'use strict';

  angular
    .module('app')
    .controller('Register.IndexController', Controller);

    function Controller($http, $state) {
      var vm = this;

      vm.email = null;
      vm.firstName = null;
      vm.formInvalid = false;
      vm.lastName = null;
      vm.password = null;
      vm.submitted = false;

      vm.register = register;

      function register() {
        vm.submitted = true;

        if (!vm.formInvalid) {
          var info = {
            email: vm.email,
            password: vm.password,
            firstName: vm.firstName,
            lastName: vm.lastName
          }
          $http.post('api/register', info).success(function(data) {
            console.log(data);
            // $state.go("login");
          }).error(function(error) {
            console.log(error);
          });
        }
        
      }

    }

})();