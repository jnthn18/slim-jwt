(function (){
  'use strict';

  angular
    .module('app')
    .controller('User.IndexController', Controller);

    function Controller($http, $state, $window) {
      var vm = this;

      vm.getInfo = getInfo;
      vm.logOut = logOut;

      if($window.localStorage.getItem('token') == undefined){
        $state.go('login');
      } else {
        var token = $window.localStorage.getItem('token');
        $http.defaults.headers.common['Authorization'] = 'Bearer '+token;
        $http.get('api/user/auth').error(function(error) {
          if(error.status == "error") {
            $state.go('login');
          }
        });
      }

      function getInfo(){
        var token = $window.localStorage.getItem('token');
        $http.defaults.headers.common['Authorization'] = 'Bearer '+token;
        $http.get('api/user').success(function(data) {
          console.log(data);
        });
      }

      function logOut(){
        $window.localStorage.removeItem('token');
        $state.go('login');
      }
    }
    
})();