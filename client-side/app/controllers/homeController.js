app.controller('homeController', ['$scope', function ($scope) {
    $scope.clickHandler = function () {
        window.alert('Clicked!');
    };
    $scope.contacts = [
        {
            name: 'John Doe',
            phone: '01234567890',
            email: 'john@example.com'
        },
        {
            name: 'Karan Bromwich',
            phone: '09876543210',
            email: 'karan@email.com'
        }
    ];
}]);