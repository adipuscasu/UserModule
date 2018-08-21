'use strict';
app.factory('usersListService', ['$http', 'ngAuthSettings', '$rootScope', 'authService', function ($http, ngAuthSettings, $rootScope, authService) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var usersListServiceFactory = {};
    //stabilesc valorile de baza
    var token = $rootScope.apiKey;
    $http.defaults.headers.common['Token'] = token;
    $http.defaults.headers.common['Authorization'] = "cu token"; //pun un sir pentru a avea header-ul definit

    var _getUsersList = function () {
        return $http.get(serviceBase + 'UserService.svc/GetAllUsers').then(function (results) {
            return results;
        });
    };

    var _deleteUser = function (userID) {
        var deleteUser = {
            UserId: userID
        };

        return $http.post(serviceBase + 'UserService.svc/DeleteUser',deleteUser).then(function (results) {
            return results;
        });
    };

    var _userDetails = function (userID) {      
        return $http.get(serviceBase + 'UserService.svc/GetUserDetails', { params: {UserId:userID}}).then(function (results) {
            return results;
        });
    };

    var _updateUser = function (user) {
        var Utilizator = {
            Id: user.Id,
            Username: user.Username,
            Password: (user.chPass === true ? user.Password : ''),
            Salt: user.Salt,
            Role: user.Role
        };
        return $http.post(serviceBase + 'UserService.svc/UpdateUser', Utilizator).then(function (results) {
            //actualizez si informatiile despre utilizatorul autentificat, daca este cazul.
            if ($rootScope.authentication.Id === Utilizator.Id) {
                $rootScope.authentication.userName = Utilizator.Username;
                $rootScope.authentication.Role = Utilizator.Role;
            }
            return results;
        });
    };

    usersListServiceFactory.getAllUsers = _getUsersList;
    usersListServiceFactory.deleteUser = _deleteUser;
    usersListServiceFactory.userDetails = _userDetails;
    usersListServiceFactory.updateUser = _updateUser;

    return usersListServiceFactory;

}]);