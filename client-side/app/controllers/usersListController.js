'use strict';
app.controller('usersListController', ['$scope', 'usersListService', 'authService', '$location', '$timeout', '$route', function ($scope, usersListService, authService, $location, $timeout, $route) {

    $scope.users = [];
    $scope.message = "";
    $scope.hasError = false;
    $scope.authentication = authService.authentication;


    usersListService.getAllUsers()
        .then(function (users) {
            $scope.users = users;  // results is already the array, not results.data.d
        })
        .catch(function (err) {
            $scope.hasError = true;
            $scope.message = err || "Eroare la incarcare lista utilizatorilor";
            console.error('error in getAllUsers: ', err);
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
                $scope.hasError = true;
                $scope.message = "Eroare la stergerea utilizatorului: " + (err.message || err);
                console.error('error in deleteUser: ', err);
            });
    };
    $scope.isAdmin = function () {
        return $scope.authentication?.userRole === 'admin';
    }

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $route.reload();
        }, 1000);
    }
}]);