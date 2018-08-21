'use strict';
app.controller('indexController', ['$scope', '$location', 'authService', '$rootScope', function ($scope, $location, authService, $rootScope) {

    $scope.logOut = function () {
        authService.logOut();
        $location.path('/');
    }
    $rootScope.apiKey = authService.authentication.token;
    $rootScope.authentication = authService.authentication;

}]);