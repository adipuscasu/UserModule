'use strict';
app.factory('authService', ['$http', '$q', 'ngAuthSettings', 'Base64Factory', '$rootScope', '$cookies', '$window', function ($http, $q, ngAuthSettings, Base64Factory, $rootScope, $cookies, $window) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var externalProviderUrl = serviceBase + 'AuthenticationTokenService.svc/Authenticate';
    var authServiceFactory = {};
    
    // restore from localStorage if available
    var authorizationData = null;
    try {
        authorizationData = JSON.parse($window.localStorage.getItem('authorizationData'));
    } catch (e) {
        console.error('Error parsing authorizationData:', e);
        authorizationData = null;
    }
    
    var username = authorizationData ? authorizationData.username : null;

    var _authentication = {
        isAuth: false,
        userName: "",
        Role: "",
        Id: "",
        token: ""
    };
    if (authorizationData && username) {
        _authentication.isAuth = true;
        _authentication.userName = authorizationData.username;
        _authentication.Role = authorizationData.userRole;
        _authentication.Id = authorizationData.userId;
        _authentication.token = authorizationData.token;
    }

    var _saveRegistration = function (registration) {
        _logOut();
        $http.defaults.headers.common['Token'] = "signup";
        console.log('calea: ', serviceBase);
        return $http.post(serviceBase + 'UserService.svc/AddUser', registration).then(function (response) {
            _logOut();
            return response;
        });
    };

    var _login = function (loginData) {
        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
        var deferred = $q.defer();

        var authString = 'Basic ' + Base64Factory.encode(loginData.userName + ':' + loginData.password)

        $http.defaults.headers.common['Authorization'] = authString;
        $http({ method: 'POST', url: externalProviderUrl })
            .then(function (data, status, headers, config, response) {
                _authentication.isAuth = true;
                _authentication.userName = data.data.d.UserName;
                _authentication.token = data.data.d.token;
                _authentication.Role = data.data.d.Role;
                _authentication.Id = data.data.d.UserID;

                $rootScope.apiKey = _authentication.token;
                var currentUser = {
                    username: _authentication.userName,
                    userRole: _authentication.Role,
                    userId: _authentication.Id,
                    token: _authentication.token
                }; 
                $rootScope.globals = {
                    currentUser: currentUser
                };
                $cookies.put('globals', $rootScope.globals);

                deferred.resolve(response);
                $window.localStorage.setItem('authorizationData', JSON.stringify(currentUser));
            })
            .catch(function (err) {
                console.log('eroare la login: ', err);
                _logOut();
                deferred.reject(err);
            });

        return deferred.promise;
    };

    var _logOut = function () {
        $http.defaults.headers.common['Token'] = "";
        _authentication.isAuth = false;
        _authentication.userName = "";
        _authentication.Role = '';
        _authentication.Id = '';
        _authentication.token = '';
        $rootScope.apiKey = "";
        $rootScope.globals = {};
        $cookies.remove('globals');
        $window.localStorage.removeItem('authorizationData');
    };

    var isAuthenticated = function () {
        return _authentication.isAuth;
    };

    var _fillAuthData = function () {
        var authData = $window.localStorage.getItem('authorizationData');
        if (authData) {
            try {
                authServiceFactory.authentication = JSON.parse(authData);
                authServiceFactory.authentication.isAuth = true;
            } catch (e) {
                console.error('Error parsing authData from localStorage:', e);
                console.log('Raw data was:', authData);
                $window.localStorage.removeItem('authorizationData');
                authServiceFactory.authentication = {
                    isAuth: false,
                    userName: '',
                    useRefreshTokens: false
                };
            }
        } else {
            authServiceFactory.authentication = {
                isAuth: false,
                userName: '',
                useRefreshTokens: false
            };
        }
    };

    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.isAuthenticated = isAuthenticated;

    return authServiceFactory;
}]);