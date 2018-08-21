'use strict';
app.factory('authService', ['$http', '$q', 'ngAuthSettings', 'Base64Factory', '$rootScope', '$cookies', function ($http, $q, ngAuthSettings, Base64Factory, $rootScope, $cookies) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var externalProviderUrl = serviceBase + 'AuthenticationTokenService.svc/Authenticate';
    var authServiceFactory = {};
    

    var _authentication = {
        isAuth: false,
        userName: "",
        Role: "",
        Id: "",
        token:""
    };


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
        $http({ method: 'POST', url: externalProviderUrl }).
                then(function (data, status, headers, config, response) {

                    _authentication.isAuth = true;
                    _authentication.userName = data.data.d.UserName;
                    _authentication.token = data.data.d.token;
                    _authentication.Role = data.data.d.Role;
                    _authentication.Id = data.data.d.UserID;

                    $rootScope.apiKey = _authentication.token;

                    $rootScope.globals = {
                        currentUser: {
                            username: _authentication.userName,
                            userRole: _authentication.Role,
                            userId: _authentication.Id,
                            token: _authentication.token
                        }
                    };
                    $cookies.put('globals', $rootScope.globals);

                    deferred.resolve(response);
                    // this callback will be called asynchronously
                    // when the response is available
                },
                function (err, status) {
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
        //folosesc cookies
        $rootScope.globals = {}; 
        $cookies.remove('globals');

    };

    var _fillAuthData = function () {
        $cookies.get('globals', $rootScope.globals);
        if ($rootScope.globals) {
            _authentication.isAuth = true;
            _authentication.userName = $rootScope.globals.currentUser.username;
            _authentication.token = $rootScope.globals.currentUser.token;
            _authentication.Role = $rootScope.globals.currentUser.Role;
            _authentication.Id = $rootScope.globals.currentUser.Id;
        }

    };


    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;

    return authServiceFactory;
}]);