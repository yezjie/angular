'use strict';
angular.module('app').filter('filterByObj',[function () {
    return function (list,obj) {  // list要筛选的数据  obj 筛选的条件
        var result = [];
        angular.forEach(list,function (item) {
            var bol = true;
            for(var i in obj){
                if(item[i] !== obj[i]){
                    bol = false;
                }
            }
            if(bol){
                result.push(item)
            }
        })
        return result;
    }
}])