(function () {

  'use strict';

  angular
    .module('app')
    .controller('Register.IndexController', Controller);

    function Controller() {
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
          console.log("Form complete");
        }
        
      }

    }

})();