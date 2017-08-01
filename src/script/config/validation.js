'use strict';

angular.module('app').config(['$validationProvider',function ($validationProvider) {
    var expression = {
        phone:/^1[3|4|5|8][0-9]\d{8}$/,
        password:function (value) {
            return value.length > 5;
        },
        required:function (value) {
            return !!value;
        }
    };
    var defaultMsg = {
        phone:{
            success: "",
            error: "请输入11位数字"
        },
        password:{
            success:'',
            error:'长度至少6位'
        },
        required:{
            success:'',
            error:'不能为空'
        }
    };
    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}])
