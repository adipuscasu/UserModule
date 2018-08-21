'use strict';
app.controller('loginController', ['$scope', '$location', 'authService', 'ngAuthSettings', '$rootScope', function ($scope, $location, authService, ngAuthSettings, $rootScope) {

    $scope.message = "";
    $rootScope.apiKey = ""; //elimin , daca exista, vechiul token

    $scope.login = function () {
        authService.login($scope.loginData).then(function (response) {
            $location.path('/usersList');
        },
         function (err) {
             $scope.message = "Eroare de autentificare. Verificati numele de utilizator sau parola. "+err;
         });
    };
}]);
