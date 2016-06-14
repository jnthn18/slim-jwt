(function (){
  'use strict';

  angular
    .module('app')
    .controller('User.IndexController', Controller);

    function Controller($http, $state, $window, $rootScope, AuthService) {
      var vm = this;

      vm.logOut = logOut;
      vm.test = test;

      // if($window.localStorage.getItem('token') == undefined){
      //   $state.go('login');
      // } else {
      //   var token = $window.localStorage.getItem('token');
      //   $http.get('api/user').error(function(error) {
      //     if(error.status == "error") {
      //       $state.go('login');
      //     }
      //   });
      // }

      function logOut(){
        AuthService.logOut();
      }

      function test(){
        var token = $window.localStorage.getItem('token');
        // if(AuthService.Authenticate(token)) console.log('yes');
        console.log(AuthService.Authenticate(token));
      }
    }
    
})();