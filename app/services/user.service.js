(function() {
  'use strict';

  angular
    .module('app')
    .service('AuthService', Service);

  function Service($window, $http, $q) {
    var service = {};

    service.isAuth = isAuth;
    service.logIn = logIn;

    return service;

    function isAuth() {
      // var token = $window.localStorage.getItem('token');
      // $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      // return $http.get('api/authenticate').then(function(res){
      //   return res.data.isAuth;
      // });
    }

    function logIn(data) {
      return $http.post('api/login', data).then(function(res) {
      });
    }

    function handleSuccess(res) {
      return res.data;
    }

    function handleError(res) {
      return $q.reject(res.data);
    }
  }
})();