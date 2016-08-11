'use strict';

// Context path
window.appContext = window.location.pathname;

// Images
window.images = window.images || {};

// Modify local storage to magically stringify objects
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

// Retrieve magically stringified objects from local storage
Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};

var app = angular
    .module('myApp', [
        'myApp.filters', 'myApp.services', 'myApp.controllers', 'myApp.directives',
        'ui.bootstrap', 'ngCookies', 'ngResource', 'ngRoute', 'ui.route', 'pascalprecht.translate'
    ])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', { templateUrl: 'partials/home/index.html' })
            .when('/play', { templateUrl: 'partials/adventure/index.html', controller: 'adventureCtrl' })
            .when('/intro', { templateUrl: 'partials/home/intro.html' })
            .when('/character', { templateUrl: 'partials/character/index.html', controller: 'characterCtrl' })
            .when('/chapter/:id?', { templateUrl: 'partials/chapters/chapter.html', controller: 'chapterCtrl' })
            .when('/rules', { templateUrl: 'partials/rules/original.html' })
            .when('/rules/original', { templateUrl: 'partials/rules/original.html' })
            .when('/rules/here', { templateUrl: 'partials/rules/here.html' })
            .when('/legend', { templateUrl: 'partials/legend/index.html' })
            .when('/book-spells', { templateUrl: 'partials/book-spells/index.html' })
            .when('/book-spells/info', { templateUrl: 'partials/book-spells/info.html' })
            .when('/book-spells/rules', { templateUrl: 'partials/book-spells/rules.html' })
            .when('/book-spells/spells', { templateUrl: 'partials/book-spells/spells.html' })
            .when('/khalkhabad', { templateUrl: 'partials/khalkhabad/map.html' })
            .when('/about', { templateUrl: 'partials/about/authors.html' })
            .otherwise({redirectTo: '/chapter/'});
    }])

    // see http://www.ng-newsletter.com/posts/angular-translate.html
    .config(['$translateProvider', function($translateProvider) {
        $translateProvider.translations('fr', messages_fr);
        $translateProvider.preferredLanguage('fr');
    }

]);

app.run(['$rootScope', '$log', function ($rootScope, $log) {

    $rootScope.ajaxBusy = 0;
    $rootScope.images = window.images;
    $rootScope.appContext = appContext;
    $rootScope.errors = [];
    $rootScope.messages = [];
}]);
