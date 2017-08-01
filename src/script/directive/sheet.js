'use strict';

angular.module('app').directive('appSheet',[function () {
    return{
        resstrict:"A",
        replace:true,
        templateUrl:'view/template/sheet.html',
        scope:{
            list:'=',
            visible:'=',
            select:'&'
        }
    }
}])