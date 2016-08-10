'use strict';

angular.module('myApp.services.StorageService', [], ['$provide', function ($provide) {

$provide.factory('StorageService',
    ['$rootScope', '$log', 'AdventureService', 'FightService',
    function ($rootScope, $log, AdventureService, FightService) {

        var self = {

            store: function() {
                if (typeof(Storage) === 'undefined') return false;

                $log.log("Save adventure to local storage", AdventureService.adventure.chapter);
                localStorage.setObject('vitals', AdventureService.vitals);
                localStorage.setObject('initial', AdventureService.initial);
                localStorage.setObject('adventure', AdventureService.adventure);
                localStorage.setObject('backpack', AdventureService.backpack);
                localStorage.setObject('weapons', AdventureService.weapons);
                localStorage.setObject('specialActions', AdventureService.specialActions);
                localStorage.setObject('fight', FightService.fight);
                return true;
            },

            load: function() {
                if (typeof(Storage) === 'undefined') return false;
                if (localStorage.vitals == undefined) return false;     // no saved adventure available

                $log.log("Load adventure from local storage");
                AdventureService.vitals = localStorage.getObject('vitals');
                AdventureService.initial = localStorage.getObject('initial');
                AdventureService.adventure = localStorage.getObject('adventure');
                AdventureService.backpack = localStorage.getObject('backpack');
                AdventureService.weapons = localStorage.getObject('weapons');
                AdventureService.specialActions = localStorage.getObject('specialActions');
                FightService.fight = localStorage.getObject('fight');
                return true;
            }

        };

        return self;
    }]
);

}]);