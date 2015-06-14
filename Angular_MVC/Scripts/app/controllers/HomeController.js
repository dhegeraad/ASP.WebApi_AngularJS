angular.module('home', [])
    .controller('HomeController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
        $scope.userName = $rootScope.username;
        $scope.message = 'Angular WebApi template';
        $scope.values = [];
        $scope.get = function () {
            console.log($rootScope.loggedIn);
            if (!$rootScope.loggedIn) {
                console.log('error');
                $scope.ErrorMessage = 'Not Authorized, Please Sign In.';
                return;
            }
              $http.get('/api/Values')
	            .success(function (data) {
	                $scope.values = data;
	                console.log($scope.values);
	            });
        }
}]);