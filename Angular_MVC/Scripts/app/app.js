var app = angular.module('app', [
    'ngRoute',
    'ngCookies',
    'home',
    'register',
    'signIn'
]);


app.config(['$provide', '$routeProvider', '$httpProvider', function ($provide, $routeProvider, $httpProvider) {
    //================================================
    // Ignore Template Request errors if a page that was requested was not found or unauthorized.  The GET operation could still show up in the browser debugger, but it shouldn't show a $compile:tpload error.
    //================================================
    $provide.decorator('$templateRequest', ['$delegate', function ($delegate) {
        var mySilentProvider = function (tpl) {
            return $delegate(tpl, true);
        }
        return mySilentProvider;
    }]);

    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
        return {
            'responseError': function (response) {
                if (response.status === 401)
                    $location.url('/home');
                return $q.reject(response);
            }
        };
    }]);


	/**	Routing  **/
    $routeProvider.when('/home', {
        templateUrl: 'app/home',
        controller: 'HomeController'
    });

    $routeProvider.when('/register', {
        templateUrl: 'app/register',
        controller: 'RegisterController'
    });

    $routeProvider.when('/signin', {
        templateUrl: 'app/signin',
        controller: 'SignInController'
    });

    $routeProvider.otherwise({
        redirectTo: '/home'
    });
}]);

app.run(['$http', '$cookies', '$cookieStore', function ($http, $cookies, $cookieStore) {
    $http.defaults.headers.common.Authorization = 'Bearer ' + $cookieStore.get('_Token');
    $http.defaults.headers.common.RefreshToken = $cookieStore.get('_RefreshToken');
}]);

app.run(['$rootScope', '$http', '$cookies', '$cookieStore', function ($rootScope, $http, $cookies, $cookieStore) {
    if  (!$rootScope.loggedIn)  
        $rootScope.loggedIn = false;
    console.log('LoggedIn', $rootScope.loggedIn);

    $rootScope.logout = function () {

        $http.post('/api/Account/Logout')
            .success(function () {
                $http.defaults.headers.common.Authorization = null;
                $http.defaults.headers.common.RefreshToken = null;
                $cookieStore.remove('_Token');
                $cookieStore.remove('_RefreshToken');
                $rootScope.username = '';
                $rootScope.loggedIn = false;
                window.location = '#/signin';
            });
    }

    $rootScope.$on('$locationChangeSuccess', function () {
        if ($http.defaults.headers.common.RefreshToken != null) {
            var params = "grant_type=refresh_token&refresh_token=" + $http.defaults.headers.common.RefreshToken;
            $http({
                url: '/Token',
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: params
            })
            .success(function (data) {
                $http.defaults.headers.common.Authorization = "Bearer " + data.access_token;
                $http.defaults.headers.common.RefreshToken = data.refresh_token;

                $cookieStore.put('_Token', data.access_token);
                $cookieStore.put('_RefreshToken', data.refresh_token);

                $http.get('/api/Account/UserInfo')
                    .success(function (userinfoData) {
                        if (userinfoData != "null") {
                            $rootScope.userName = userinfoData.Email.replace(/["']{1}/gi, "");
                            $rootScope.loggedIn = true;
                        }
                        else
                            $rootScope.loggedIn = false;
                    });


            })
            .error(function () {
                $rootScope.loggedIn = false;
            });
        }
    });
}]);