(function (){
  'use strict';

  angular
    .module('app')
    .controller('User.IndexController', Controller);

    function Controller($http, $window) {
      var vm = this;

      vm.getInfo = getInfo;

      function getInfo(){
        var token = $window.localStorage.getItem('token');
        $http.defaults.headers.common['Authorization'] = 'Bearer '+token;
        $http.get('api/user').success(function(data) {
          console.log(data);
        });
      }
    }
    
})();