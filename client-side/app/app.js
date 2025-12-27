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
        templateUrl: "./app/views/lista.html",
        requiresAuth: true // custom flag
    });

    $routeProvider.when("/user-details/:userID", {
        controller: "userDetailsController",
        templateUrl: "./app/views/user-details.html",
        requiresAuth: true // custom flag
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

app.run(['authService', '$rootScope', '$location', function (authService, $rootScope, $location) {
    authService.fillAuthData();
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        // Check if the route requires authentication
        if (next.$$route && next.$$route.requiresAuth && !authService.isAuthenticated()) {
            event.preventDefault();  // stop navigation
            $location.path('/'); // redirect to home or login page
        } else if (next.$$route
            && (next.$$route.originalPath === '/login'
                || next.$$route.originalPath === '/signup')
            && authService.isAuthenticated()) {
            event.preventDefault();  // stop navigation
            $location.path('/usersList'); // redirect to users list page
        }
    });
}]);