(function (){
  'use strict';

  angular
    .module('app')
    .controller('User.IndexController', Controller);

    function Controller(AuthService, $window, $state) {
      var vm = this;

      vm.logOut = logOut;
      vm.test = test;

      function logOut(){
        $window.localStorage.removeItem('token');
        $state.go('login');
      }

      function test(){
        AuthService.isAuth().then(function(data) {
          console.log(data);
        });
      }
    }
    
})();