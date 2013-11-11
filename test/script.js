    angular.module('ngViewExample', ['ngRoute'])
     
    .config(function($routeProvider, $locationProvider) {
     
    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
    });
     
    function MainCntl($scope, $route, $routeParams, $location) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    }
     