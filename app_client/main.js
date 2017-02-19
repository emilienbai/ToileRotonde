(function () {

    angular.module('RotondeApp', ['ngRoute', 'ngMaterial']);
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .when('/register', {
                templateUrl: '/auth/register/registerOrga.view.html',
                controller: 'registerCtrl',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: '/auth/login/login.view.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })
            .when('/profile', {
                templateUrl: '/profile/profile.view.html',
                controller: 'profileCtrl',
                controllerAs: 'vm'
            })
            .when('/book', {
                templateUrl: '/reservations/reservations.view.html',
                controller: 'reservationsCtrl',
                controllerAs: 'vm'
            })

            .otherwise({redirectTo: '/'});

        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }

    function run($rootScope, $location, authentication) {
        $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
            if (($location.path() === '/profile'
                ||$location.path() === '/book')
                && !authentication.isLoggedIn()) {
                $location.path('/login');
            }
        });
    }

    angular
        .module('RotondeApp')
        .config(['$routeProvider', '$locationProvider', config])
        .run(['$rootScope', '$location', 'authentication', run]);

})();