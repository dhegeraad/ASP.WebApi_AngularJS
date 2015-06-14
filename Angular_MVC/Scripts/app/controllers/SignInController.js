angular.module('signIn', ['ngCookies'])
    .controller('SignInController', ['$scope' ,'$rootScope', '$http', '$cookies', '$cookieStore', function ($scope, $rootScope, $http, $cookies, $cookieStore) {
        $scope.signIn = function () {
            console.log('signin in');
            $scope.showMessage = false;
            var params = "grant_type=password&username=" + $scope.username + "&password=" + $scope.password;
            $http({
                url: '/Token',
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: params
            })
            .success(function (data) {
                $http.defaults.headers.common.Authorization = "Bearer " + data.access_token;
                $http.defaults.headers.common.RefreshToken = data.refresh_token;
                $http.defaults.headers.common.userName = data.userName;

                $cookieStore.put('_Token', data.access_token);
                window.location = '#/home';
            })
            .error(function (data) {
                $scope.message = data.error_description.replace(/["']{1}/gi, "");
                $scope.showMessage = true;
            });
        }
    }]);