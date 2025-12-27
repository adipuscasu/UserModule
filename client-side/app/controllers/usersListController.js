'use strict';
app.controller('usersListController', ['$scope', 'usersListService', 'authService', '$location', '$timeout', '$route', function ($scope, usersListService, authService, $location, $timeout, $route) {

    $scope.users = [];
    $scope.message = "";
    usersListService.getAllUsers()
        .then(function (results) {
            $scope.users = results.data.d;
            $scope.authentication = authService.authentication;
            $scope.isAdmin = function () {
                return $scope.authentication.Role === 'admin';
            }
        })
        .catch(function (err) {
            console.log('error in getAllUsers: ', err);
        });
    $scope.userViewDetails = function (userID) {
        $location.path('/user-details/' + userID);
    };
    $scope.userDelete = function (userID) {
        usersListService.deleteUser(userID)
            .then(function (results) {
                console.log('deleteUser results: ', results);
                $scope.deletedSuccessfully = true;
                $scope.message = "Utilizatorul a fost sters cu succes.";
                startTimer();
            })
            .catch(function (err) {
                console.log('error in deleteUser: ', err);
            });
    };
    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $route.reload();
        }, 1000);
    }
}]);