'use strict'

angular.module('app',['ui.router','ngCookies','validation']);

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
'use strict';

angular.module('app').config(['$provide',function ($provide) {
    $provide.decorator('$http',['$delegate','$q',function ($delegate,$q) {
        $delegate.post = function (url,data,config) {
            var def = $q.defer();
            $delegate.get(url).success(function (res) {
                def.resolve(res);
            }).error(function (err) {
                def.reject(err);
            });
            return {
                success:function (cb) {
                    def.promise.then(cb);
                },
                error:function (cb) {
                    def.promise.then(cb)
                }
            }
        }
        return $delegate;
    }])
}])
'use strict';

angular.module('app').config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
    $stateProvider
        .state('main',{
            url:'/main',
            templateUrl:'view/main.html',
            controller:'mainCtrl'
        })
        .state('position',{
            url:'/position/:id',
            templateUrl:'view/position.html',
            controller:'positionCtrl'
        })
        .state('company',{
            url:'/company/:id',
            templateUrl:'view/company.html',
            controller:'companyCtrl'
        }).state('search',{
            url:'/search/:id',
            templateUrl:'view/search.html',
            controller:'searchCtrl'
        }).state('login',{
            url:'/login',
            templateUrl:'view/login.html',
            controller:'loginCtrl'
        }).state('register',{
            url:'/register',
            templateUrl:'view/register.html',
            controller:'registerCtrl'
        }).state('me',{
            url:'/me',
            templateUrl:'view/me.html',
            controller:'meCtrl'
        }).state('post',{
            url:'/post',
            templateUrl:'view/post.html',
            controller:'postCtrl'
        }).state('favorite',{
            url:'/favorite',
            templateUrl:'view/favorite.html',
            controller:'favoriteCtrl'
        });
    $urlRouterProvider.otherwise('/main');
}])
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

'use strict';

angular.module('app').controller('companyCtrl',['$http','$state','$scope',function ($http,$state,$scope) {
    $http.get('data/company.json?id='+$state.params.id).success(function (res) {
        $scope.company = res;
        $scope.$broadcast('asd',{id:1});
    })
    $scope.$on('dsa',function (evevnt,data) {
        console.log(evevnt,data);
    })
}])
'use strict';

angular.module('app').controller('favoriteCtrl',['$state','$http','$scope',function ($state,$http,$scope) {
    $http.get('data/myFavorite.json').success(function (res) {
        $scope.positionList = res;
    })
}])
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
'use strict';

angular.module('app').controller('mainCtrl',['$http','$scope',function ($http,$scope) {
    $http.get('/data/positionList.json').success(function (res) {
        $scope.list = res;
    })
}])
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
'use strict';

angular.module('app').controller('postCtrl',['$state','$http','$scope',function ($state,$http,$scope) {
    $scope.tabList = [{
        id:'all',
        name:'全部'
    },{
        id:'pass',
        name:'面试邀请'
    },{
        id:'fail',
        name:'不合适'
    }];
    $http.get('data/myPost.json').success(function (res) {
        $scope.positionList = res;
    })
    $scope.filterObj = {};
    $scope.tClick = function (id,name) {
        switch (id){
            case 'all':
                delete $scope.filterObj.state;
                break;
            case 'pass':
                $scope.filterObj.state = '1';
                break;
            case 'fail':
                $scope.filterObj.state = '-1';
                break;
        }

    }
}])
'use strict';

angular.module('app').controller('registerCtrl',['$interval','$state','$http','$scope',function ($interval,$state,$http,$scope) {
    $scope.submit = function () {
        $http.post('data/regist.json',$scope.user).success(function (res) {
            console.log(res);
            $state.go('login');
        });
    };
    var count = 60;
    $scope.send = function () {
        $http.get('data/code.json').success(function (res) {
            if(res.state == 1){
                count = 60;
                $scope.time = '60s';
                var interval = $interval(function () {
                    if(count <= 0){
                        $interval.cancel(interval);
                        $scope.time = '';
                    }else{
                        count--;
                        $scope.time = count + "s";
                    }
                },1000);
            }
        })
    }
}])
'use strict';

angular.module('app').controller('searchCtrl',['dist','$http','$state','$scope',function (dist,$http,$state,$scope) {
    $scope.name = '';
    $scope.search = function () {
        $http.get('data/positionList.json').success(function (res) {
            $scope.positionList = res;
        })
    };
    $scope.search();
    $scope.sheet = {};
    $scope.tabList = [{
        id:'city',
        name:'城市'
    },{
        id:'salary',
        name:'薪水'
    },{
        id:'scale',
        name:'公司规模'
    }];
    var tabId = '';
    $scope.filterObj = {};
    $scope.tClick = function (id, name) {
        tabId = id;
        $scope.sheet.list = dist[id];
        $scope.sheet.visible = true;
    };
    $scope.sClick = function (id,name) {
        if (id){
            angular.forEach($scope.tabList, function (item) {
                if(item.id == tabId){
                    item.name = name;
                }
            })
            $scope.filterObj[tabId + "Id"] = id;
            console.log($scope.filterObj)
        } else {
            delete $scope.filterObj[tabId + "Id"];
            angular.forEach($scope.tabList, function (item) {
                if(item.id == tabId){
                    switch (item.id){
                        case 'city':
                            item.name = '城市';
                            break;
                        case 'salary':
                            item.name = '薪水';
                            break;
                        case 'scale':
                            item.name = '公司规模';
                            break;
                    }
                }
            })
        }
    }

}])
'use strict';

angular.module('app').directive('appCompany',[function () {
    return{
        restrict:"A",
        replace:true,
        templateUrl:'view/template/company.html',
        scope:{
            com:'='
        }
    }
}])
'use strict';

angular.module('app').directive('appFoot',[function () {
    return{
        restrict:"A",
        replace:true,
        templateUrl:'view/template/foot.html'
    }
}])
'use strict';

angular.module('app').directive('appHead',['cache',function (cache) {
    return {
        restrict:"A",
        replace:true,
        templateUrl:'view/template/head.html',
        link:function ($scope) {
            $scope.name = cache.get('name');
            console.log($scope.name)
        }
    }
}])
'use strict';

angular.module('app').directive('appHeadBar',[function () {
    return {
        restrict:"A",
        replace:true,
        templateUrl:'view/template/headBar.html',
        scope:{
            text:'='
        },
        link:function (scope) {
            scope.back = function () {
                window.history.back();
            }
        }
    }
}])
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
'use strict';

angular.module('app').directive('appTab',[function () {
    return{
        resstrict:"A",
        replace:true,
        templateUrl:'view/template/tab.html',
        scope:{
            tabClick:'&',
            list:'='
        },
        link:function (scope) {
            scope.click = function (tab) {
                scope.selectId = tab.id;
                scope.tabClick(tab)
            }
        }
    }

}])
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
'use strict';

angular.module('app').service('cache',['$cookieStore',function ($cookieStore) {
    this.put = function (key,value) {
        $cookieStore.put(key,value);
    }
    this.get = function (key) {
        return $cookieStore.get(key);
    }
    this.remove = function (key) {
        $cookieStore.remove(key);
    }
}])