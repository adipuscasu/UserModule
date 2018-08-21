'use strict';
app.factory('authInterceptorService', ['$q', '$injector', '$location', function ($q, $injector, $location) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        config.headers = config.headers || {};
        return config;
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            authService.logOut();
            $location.path('/login');
        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);