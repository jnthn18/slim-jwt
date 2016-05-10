(function () {

  'use strict';

  angular
    .module('app')
    .controller('Register.IndexController', Controller);

    function Controller() {
      var vm = this;

      vm.email = null;
      vm.password = null;

      vm.login = login;

      function login() {
        console.log("Email: "+ vm.email + ", Password: "+ vm.password);
      }

    }

})();