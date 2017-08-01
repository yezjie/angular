'use strict';

angular.module('app').controller('loginCtrl',['cache','$state','$http','$scope',function (cache,$state,$http,$scope) {
    $scope.submit = function () {
        $http.post('data/login.json',$scope.user).success(function (res) {
            cache.put('id',res.id);
            cache.put('name',res.name);
            cache.put('image',res.image);
            $state.go('main');
        })
    }
}])