'use strict';

angular.module('app').controller('meCtrl',['cache','$state','$http','$scope',function (cache,$state,$http,$scope) {
    if(cache.get('name')){
        $scope.name = cache.get('name');
        $scope.image = cache.get('image');
    }
    $scope.loginOut = function () {
        cache.remove('id');
        cache.remove('name');
        cache.remove('image');
        $state.go('main')
    }
}])