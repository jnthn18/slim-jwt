(function () {

  'use strict';

  angular
    .module('app')
    .controller('Register.IndexController', Controller);

    function Controller() {
      var vm = this;

      vm.firstName = null;
      vm.lastName = null;
      vm.email = null;
      vm.password = null;

      vm.register = register;

      function register() {
        console.log("Email: "+ vm.email + ", Password: "+ vm.password);
      }

    }

})();