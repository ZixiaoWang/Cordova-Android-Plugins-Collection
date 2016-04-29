angular.module('app', ['ngRoute'])

/**
 * Controller Group
 */
.controller('myApp', function($scope){
    $scope.section = 'General';
})
.controller('deviceController', function($scope){
    var $$ = $scope.$parent;
    $$.section = 'Device';
    
    $scope.scope = $scope;
    document.addEventListener('deviceready', onDeviceReady, false);
    function onDeviceReady(){
        $scope.d = {
            cordova:device.cordova,
            model:device.model,
            platform:device.platform,
            uuid:device.uuid,
            version:device.version,
            manufacturer:device.manufacturer,
            isVirtual:device.isVirtual,
            serial:device.serial
        }
    }
    
    $scope.show = function(){
        console.log($scope);
        console.log($scope.showPluginInfo);
    }
})
.controller('geolocationController', function($scope){
    var $$ = $scope.$parent;
    $$.section = 'Geo Location';
    
    $scope.scope = $scope;
    document.addEventListener('deviceready', onDeviceReady, false);
    function onDeviceReady(){
        console.log('navigator.geolocation works well');
        function onGetGeolocationFail(error){
            $scope.g = null;
            $scope.onLoadError = error;
        }
        function onGetGeolocationSuccess(position){
            $scope.g = {
                latitude:position.coords.latitude,
                longitude:position.coords.longitude,
                altitude:position.coords.altitude,
                accuracy:position.coords.accuracy,
                altitudeAccuracy:position.coords.altitudeAccuracy,
                heading:position.coords.heading,
                speed:position.coords.speed,
                timestamp:position.timestamp
            }
        }
        navigator.geolocation.getCurrentPosition(onGetGeolocationSuccess, onGetGeolocationFail, {timeout:10000})
    }
})

/**Directive Group */
.directive('barGroup', function(){
    return {
        restrict:'AE',
        scope:false,
        template:'<div class="bar-group" ng-transclude ng-model="ngModel"></div>',
        transclude:true,
        replace:true
    }
})
.directive('barTableGroup', function(){
    return {
        restrict:'AE',
        scope:false,
        template:'<div class="bar-group bar-table-group" ng-transclude ng-model="ngModel"></div>',
        transclude:true,
        replace:true
    }
})
.directive('textBar', function(){
    return {
        restrict:'AE',
        template:  '<div class="bar">\
                        <div class="bar-icon" ng-if="icon">\
                            <img ng-src="{{icon}}" alt="Icon">\
                        </div>\
                        <div class="bar-content" ng-transclude></div>\
                        <div class="bar-status" ng-if="status">{{status}}</div>\
                    </div><!-- bar -->',
        scope:{
            icon:'=',
            status:'='
        },
        transclude:true,
        replace:true
    }
})
.directive('switchBar', function(){
    return {
        restrict:'AE',
        replace:true,
        template:  '<div class="bar switch-bar">\
                        <div class="bar-icon" ng-if="icon">\
                            <img ng-src="{{icon}}" alt="Icon">\
                        </div>\
                        <div class="bar-content" ng-transclude></div>\
                        <div class="bar-status" ng-if="id">\
                            <input type="checkbox" id="{{id}}" ng-model="$parent.ngModel" class="switch">\
                            <label for="{{id}}">&nbsp;</label>\
                        </div>\
                    </div><!-- bar -->',
        scope:{
            icon:'=',
            id:'=',
            ngModel:'='
        },
        transclude:true
    }
})
.directive('linkBar', function(){
    return {
        restrict:'AE',
        template:  '<div class="bar">\
                        <div class="bar-icon" ng-if="icon">\
                            <img ng-src="{{icon}}" alt="Icon">\
                        </div>\
                        <div class="bar-content" ng-transclude></div>\
                        <div class="bar-status" ng-if="status">\
                            {{status}}<a class="arrow-right"></a>\
                        </div>\
                    </div><!-- bar -->',
        scope:{
            icon:'=',
            href:'=',
            status:'='
        },
        link:function(scope, elem, attr){
            elem.bind('click', function(){
                location.href = scope.href;
            })  
        },
        transclude:true,
        replace:true
    }
})
.directive('searchBar', function(){
    return {
        restrict:'AE',
        template:  '<div class="bar search-bar">\
                        <div class="searchbox">\
                            <div class="search"></div>\
                            <input type="text" placeholder="🔍 Search" ng-model="ngModel">\
                            <div class="close"></div>\
                        </div>\
                    </div>',
        scope:{
            ngModel:'='
        },
        link:function(scope, elem, attr){
            elem[0].querySelector('input').addEventListener('focus', function(){
                this.placeholder = '';
                this.style.borderRadius = '0px';
                this.previousElementSibling.style.display = 'flex';
                this.nextElementSibling.style.display = 'flex';
            });
            elem[0].addEventListener('blur', function(){
                if(this.querySelector('input').value==null){ return;}
                console.log('out');
                this.querySelector('input').placeholder = '🔍 Search';
                this.querySelector('input').style.borderRadius = '4px';
                this.querySelector('.search').style.display = 'none';
                this.querySelector('.close').style.display = 'none';
            });
            elem[0].querySelector('.close').addEventListener('click', function(){
                this.previousElementSibling.value = '';
            })
        },
        transclude:true,
        replace:true
    }
})

/**Config Group */
.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when('/device', {
        templateUrl:'./templates/device.html',
        controller:'deviceController'
    })
    .when('/geolocation', {
        templateUrl:'./templates/geolocation.html',
        controller:'geolocationController'
    })
}])