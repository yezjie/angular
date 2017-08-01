'use strict';

angular.module('app').directive('appPositionList',['$http',function ($http) {
    return{
        resstrict:"A",
        replace:true,
        templateUrl:'view/template/positionList.html',
        scope:{
            data:'=',
            filterObj:'=',
            isShowStar:'='
        },
        link:function ($scope) {
            $scope.select = function (item) {
                $http.post('data/favorite.json',{
                    id:item.id,
                    select:!item.select
                }).success(function (res) {
                    item.select = !item.select;
                })
            }
        }
    }
}])