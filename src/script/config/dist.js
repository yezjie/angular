'use strict';
angular.module('app').value('dist',{}).run(['dist','$http',function (dist,$http) {
    $http.get('data/city.json').success(function (res) {
        dist.city = res;
    })
    $http.get('data/salary.json').success(function (res) {
        dist.salary = res;
    })
    $http.get('data/scale.json').success(function (res) {
        dist.scale = res;
    })
}])