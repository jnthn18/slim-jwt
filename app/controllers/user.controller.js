(function (){
  'use strict';

  angular
    .module('app')
    .controller('User.IndexController', Controller);

    function Controller($http, $state, $window, $rootScope) {
      var vm = this;

      vm.logOut = logOut;

      if($window.localStorage.getItem('token') == undefined){
        $state.go('login');
      } else {
        var token = $window.localStorage.getItem('token');
        $http.defaults.headers.common['Authorization'] = 'Bearer '+token;
        $http.get('api/user').error(function(error) {
          if(error.status == "error") {
            $state.go('login');
          }
        });
      }

      function logOut(){
        $rootScope.loggedIn = false;
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('displayName');
        $state.go('login');
      }
    }
    
})();