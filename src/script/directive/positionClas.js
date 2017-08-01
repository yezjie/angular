'use strict';

angular.module('app').directive('appPositionClas',[function () {
    return {
        restrict:"AE",
        replace:true,
        templateUrl:'view/template/positionclas.html',
        scope:{
            com:'=',
        },
        link:function (scope,element,attrs) {
            scope.showPositionList = function (index) {
                scope.positionList = scope.com.positionClass[index].positionList
                scope.isActive = index;
            }
            scope.$watch('com',function (newVal) {
                if(newVal) scope.showPositionList(0);
            })
            scope.$on('asd',function (event,data) {
                console.log(event,data)
            })
            scope.$emit('dsa',{asd:2})
            // scope.$digest();  当页面失效的时候可以试着用这个
        }
    }
}])