'use strict';
app.controller('userDetailsController', ['$scope', 'usersListService', 'authService', '$location', '$routeParams', '$route', '$timeout', function ($scope, usersListService, authService, $location, $routeParams, $route,$timeout) {

    $scope.user = [];
    $scope.message = "";
    $scope.user.chPass = false;
    var userID = $routeParams.userID;
    usersListService.userDetails(userID).then(function (results) {
        $scope.user = results.data.d;
        $scope.user.confirmPassword = $scope.user.Password;
        $scope.authentication = authService.authentication;
        $scope.isAdmin = function () {
            return $scope.authentication.Role === 'admin';
        };
        $scope.editCurrentUserAsUser = function () {
            return (($scope.user.Id === $scope.authentication.Id) && !$scope.isAdmin());
        };
    }, function (error) {
            console.log('Eroare la userDetails :');
            console.log(error);
        });

    $scope.updateUser = function (user) {
        usersListService.updateUser(user).then(function (results) {
            $scope.updatedSuccessfully = true;
            $scope.message = "Utilizatorul a fost actualizat cu succes.";
            startTimer();
        }, function (error) {
            $scope.updatedSuccessfully = false;
            $scope.message = "Utilizatorul nu a fost actualizat.";
            console.log(error);
        });
    };
    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/usersList');
        }, 1000);
    }
}]);