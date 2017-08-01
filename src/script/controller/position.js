'use strict';

angular.module('app').controller('positionCtrl',['cache','$scope','$http','$state','$q',function (cache,$scope,$http,$state,$q) {
    $scope.isLogin = !!cache.get('name');
    $scope.message = $scope.isLogin?'投个简历':'去登陆';
    function getPosition() {
        var def = $q.defer();
        $http.get("/data/position.json?id="+$state.params.id).success(function (res) {
            $scope.data = res;
            if(res.posted){
                $scope.message = '已投递';
            }
            def.resolve(res);
        }).error(function (err) {
            def.reject(err);
        })
        return def.promise;
    }
    function getCompany(id) {
        $http.get('/data/company.json?id='+id).success(function (res) {
            $scope.com = res;
        })
    }
    getPosition().then(function (obj) {
        getCompany(obj.companyId);
    })
    $scope.go = function () {
        if($scope.message != '已投递'){
            console.log($scope.isLogin)
            if($scope.isLogin){
                $http.post('data/handle.json',{
                    id:$scope.data.id
                }).success(function (res) {
                    console.log(res);
                })
            }else{
                $state.go('login')
            }
        }

    }
}])