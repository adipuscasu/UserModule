'use strict';
app.controller('signupController', ['$scope', '$location', '$timeout', 'authService', '$rootScope', function ($scope, $location, $timeout, authService, $rootScope) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.registration = {
        userName: "",
        password: "",
        confirmPassword: ""
    };
    $scope.submit = function (isValid) {
        isValid = $scope.registration.password === $scope.registration.confirmPassword;
        if (isValid) {
            $scope.signUp();
            $scope.message = "Inregistrat " + $scope.registration.userName;
        } else {
            $scope.message = "Mai sunt rubrici nevalidate !";
        }
    };
    $scope.signUp = function () {
        var isValid = ($scope.registration.password === $scope.registration.confirmPassword);
        if (!isValid) {
            $scope.message = "Nu am reusit inregistrarea utilizatorului ca urmare a rubricilor nevalidate. ";
            return false;
        };
        $rootScope.apiKey = "signup";
        authService.saveRegistration($scope.registration)
            .then(function (response) {
                console.log('succes: ',response);
                $scope.savedSuccessfully = true;
                $scope.message = "Utilizatorul a fost adaugat cu succes, veti merge la pagina de autentificare in 2 secunde.";
                startTimer();
            })
            .catch(function (err) {
                var errorMsg = "Nu am reusit inregistrarea utilizatorului.";
                if (err && err.data) {
                    if (err.data.modelState) {
                        var errors = [];
                        for (var key in err.data.modelState) {
                            for (var i = 0; i < err.data.modelState[key].length; i++) {
                                errors.push(err.data.modelState[key][i]);
                            }
                        }
                        errorMsg += " " + errors.join(' ');
                    } else if (typeof err.data === "string") {
                        errorMsg += " " + err.data;
                    }
                }
                $scope.message = errorMsg;
                console.log(err);
            });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 2000);
    }

}]);