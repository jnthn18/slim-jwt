(function() {
  'use strict';

  angular
    .module('app')
    .factory('principal', Factory);

  function Factory($q, $http, $timeout) {
    var _identity = undefined;
    var _authenticated = false;

    return {
      isIdentityResolved: function() {
        return angular.isDefined(_identity);
      },
      isAuthenticated: function() {
        return _authenticated;
      },
      authenticate: function(identity) {
        _identity = identity;
        _authenticated = identity != null;

        // for this demo, we'll store the identity in localStorage. For you, it could be a cookie, sessionStorage, whatever
        if (identity) $window.localStorage.setItem('identity', angular.toJson(identity));
        else localStorage.removeItem('identity');
      },
      identity: function(force) {
        var deferred = $q.defer();

        if (force === true) _identity = undefined;

        // check and see if we have retrieved the data from the server.
        // if we have, reuse it by immediately resolving

        if (angular.isDefined(_identity)) {
          deferred.resolve(_identity);

          return deferred.promise;
        }

        // otherwise, retrieve the identity data from the server, update the identity object, and then resolve.
        $http.get('api/identity', { ignoreErrors: true })
             .success(function(data) {
                 _identity = data;
                 _authenticated = true;
                 deferred.resolve(_identity);
             })
             .error(function () {
                 _identity = null;
                 _authenticated = false;
                 deferred.resolve(_identity);
             });
      }
    }
  }

})();