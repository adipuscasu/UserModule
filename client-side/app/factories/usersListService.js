'use strict';
app.factory('usersListService', ['$http', 'ngAuthSettings', '$rootScope', 'authService', function ($http, ngAuthSettings, $rootScope, authService) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var usersListServiceFactory = {};
    var token = $rootScope.apiKey;
    $http.defaults.headers.common['Token'] = token;
    $http.defaults.headers.common['Authorization'] = "cu token";

    var _getUsersList = function () {
        return $http.get(serviceBase + 'UserService.svc/GetAllUsers')
            .then(function (response) {
                if (response.data.d.Success) {
                    return response.data.d.Data;
                } else {
                    return Promise.reject(response.data.d.Message);
                }
            })
            .catch(function (err) {
                console.log('error getting users list: ', err);
                return Promise.reject("Eroare la incarcare lista utilizatorilor: " + (err?.message || err));
            });
    };

    var _deleteUser = function (userID) {
        var deleteUser = {
            UserId: userID
        };
        return $http.post(serviceBase + 'UserService.svc/DeleteUser', deleteUser).then(function (response) {
            return response.data;
        });
    };

    var _userDetails = function (userID) {
        return $http.get(serviceBase + 'UserService.svc/GetUserDetails', { params: { UserId: userID } }).then(function (response) {
            if (response.data.Success) {
                return response.data.Data;
            } else {
                return Promise.reject(response.data.Message);
            }
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
        return $http.post(serviceBase + 'UserService.svc/UpdateUser', Utilizator).then(function (response) {
            if ($rootScope.authentication.Id === Utilizator.Id) {
                $rootScope.authentication.userName = Utilizator.Username;
                $rootScope.authentication.Role = Utilizator.Role;
            }
            return response.data;
        });
    };

    usersListServiceFactory.getAllUsers = _getUsersList;
    usersListServiceFactory.deleteUser = _deleteUser;
    usersListServiceFactory.userDetails = _userDetails;
    usersListServiceFactory.updateUser = _updateUser;

    return usersListServiceFactory;

}]);