'use strict';
app.controller('usersListController', ['$scope', 'usersListService', 'authService', '$location', '$timeout', '$route', function ($scope, usersListService, authService, $location, $timeout,$route) {

    $scope.users = [];
    $scope.message = "";
    usersListService.getAllUsers().then(function (results){
            $scope.users = results.data.d;
            $scope.authentication = authService.authentication;
            $scope.isAdmin = function (){
                return $scope.authentication.Role === 'admin';
            }
        }, function (error) {console.log(error);});
    $scope.userViewDetails = function (userID) {
        $location.path('/user-details/'+userID);
    };
    $scope.userDelete = function (userID) {
        usersListService.deleteUser(userID).then(function (results) {
            $scope.deletedSuccessfully = true;
            $scope.message = "Utilizatorul a fost sters cu succes.";
            startTimer();
        }, function (error) {
            console.log(error);
        });        
    };
    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $route.reload();
        }, 1000);
    }
}]);