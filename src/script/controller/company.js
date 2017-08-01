'use strict';

angular.module('app').controller('companyCtrl',['$http','$state','$scope',function ($http,$state,$scope) {
    $http.get('data/company.json?id='+$state.params.id).success(function (res) {
        $scope.company = res;
        $scope.$broadcast('asd',{id:1});
    })
    $scope.$on('dsa',function (evevnt,data) {
        console.log(evevnt,data);
    })
}])