'use strict';

angular.module(
    'myApp.services',
    [
        'myApp.services.AdventureService',
        'myApp.services.DiceService',
        'myApp.services.FightService',
        'myApp.services.StorageService'
    ],
    ['$provide', function ($provide) {
        //
    }]
);
