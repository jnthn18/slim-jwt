(function() {
  'use strict';

  angular
    .module('app')
    .service('AuthService', Service);

  function Service($window, $http, $state, $rootScope, $q) {
    var self = this;

    self.isLoggedIn = function() {
      if($window.localStorage.getItem('token')) {
        return true;
      } else {
        return false;
      }
    }

    self.getIdentity = function() {
      var name = $window.localStorage.getItem('displayName');
      if(name) {
        return name;
      } else {
        return null;
      }
    }

    self.logOut = function() {
      $rootScope.loggedIn = false;
      $window.localStorage.removeItem('token');
      $window.localStorage.removeItem('displayName');
      $state.go('login');
    }

    self.Authenticate = function(token) {
      var d = $q.defer();

      $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      $http.get('api/user').success(function(data){
        d.resolve(true);
      }).error(function() {
        d.resolve(false);
        $state.go('login');
      });

      return d.promise;
    }
  }
})();