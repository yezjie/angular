'use strict';

angular.module('app').directive('appPositionInfo',['$http',function ($http) {
    return {
        restrict:"A",
        replace:true,
        templateUrl:'view/template/positionInfo.html',
        scope:{
            isActive:'=',
            isLogin:'=',
            pos:'='
        },
        link:function (scope) {
            scope.$watch('pos',function (newVal) {
                if(newVal){
                    scope.pos.select = scope.pos.select || false;
                    scope.imgPath = scope.pos.select?'image/star-active.png':'image/star.png';
                }
            })
            scope.favorite = function (pos) {
                $http.post('data/favorite.json',{
                    id:pos.id,
                    select:pos.select
                }).success(function (res) {
                    scope.pos.select = !scope.pos.select;
                    scope.imgPath = scope.pos.select?'image/star-active.png':'image/star.png';
                })
            }
        }
    }
}])