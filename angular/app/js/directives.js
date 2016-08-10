'use strict';

var dirModule = angular.module('myApp.directives', []);

dirModule.directive('chapter', function() {
    var prefix = appContext + '#/chapter/';
    return  {
        restrict: 'E',
        scope: {
            to: "@"
        },
        template: '<a href="' + prefix + '{{to}}">{{to}}</a>'
    }
});

dirModule.directive('onMouseEnter', function() {
    return function(scope, linkElement, attrs) {
        linkElement.mouseenter(function() {
            scope.$apply(function() {  // Angular callback, do everything in $apply
                scope.$eval(attrs.onMouseEnter);
            });
        });
    }
});

dirModule.directive('onMouseLeave', function() {
    return function(scope, linkElement, attrs) {
        linkElement.mouseleave(function() {
            scope.$apply(function() {  // Angular callback, do everything in $apply
                scope.$eval(attrs.onMouseLeave);
            });
        });
    }
});

