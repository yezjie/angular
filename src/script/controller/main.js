'use strict';

angular.module('app').controller('mainCtrl',['$http','$scope',function ($http,$scope) {
    $http.get('/data/positionList.json').success(function (res) {
        $scope.list = res;
    })
}])