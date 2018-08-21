var app = angular.module('userApp', ['ui.bootstrap', 'ngRoute', 'ngCookies']);

app.config(function ($routeProvider, $locationProvider) {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });

    $routeProvider.when("/", {
        controller: "homeController",
        templateUrl: "./app/views/home.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "./app/views/login.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "./app/views/signup.html"
    });

    $routeProvider.when("/usersList", {
        controller: "usersListController",
        templateUrl: "./app/views/lista.html"
    });

    $routeProvider.when("/user-details/:userID", {
        controller: "userDetailsController",
        templateUrl: "./app/views/user-details.html"
    });

    $routeProvider.otherwise({ redirectTo: "/" });

});

var serviceBase = 'https://localhost/WcfTokenService/Services/';
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);