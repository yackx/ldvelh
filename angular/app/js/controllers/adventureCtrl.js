'use strict';

controllersModule.controller('adventureCtrl', [
    '$scope', '$routeParams', '$log', '$location', '$timeout',
    'AdventureService', 'StorageService',
    function($scope, $routeParams, $log, $location, $timeout,
             AdventureService, StorageService) {

        $timeout(function()  {
            $scope.init();
        });

        $scope.init = function() {
            StorageService.load();
            $scope._mapAttributesFromService();
        };

        /** Go to the given chapter */
        $scope.goToCurrentChapter = function() {
            $log.log('Redirecting to Chapter');
            $location.path('/chapter/');
        };

        $scope.goToCharacterBuilder = function()  {
            $log.log('Redirecting to character builder');
            $location.path('/character/');
        };

        $scope.increaseSkills = function() {
            if (AdventureService.vitals.skills < 14) AdventureService.vitals.skills += 1;
        };
        $scope.decreaseSkills = function() {
            if (AdventureService.vitals.skills > 5) AdventureService.vitals.skills -= 1;
        };
        $scope.increaseStamina = function() {
            if (AdventureService.vitals.stamina < 24) AdventureService.vitals.stamina += 1;
        };
        $scope.decreaseStamina = function() {
            if (AdventureService.vitals.stamina > 1) AdventureService.vitals.stamina -= 1;
        };
        $scope.increaseLuck = function() {
            if (AdventureService.vitals.luck < 14) AdventureService.vitals.luck += 1;
        };
        $scope.decreaseLuck = function() {
            if (AdventureService.vitals.luck > 5) AdventureService.vitals.luck -= 1;
        };

        $scope._collectableItems = function() {
            var prefix = 'item.';
            var collectables = {};

            _.each(_.keys(messages_fr), function(k) {
                if (k.substring(0, prefix.length) === prefix)
                    collectables[k] = messages_fr[k];
            }, messages_fr);

            return collectables;
        };

        $scope.recordAndPlay = function() {
            StorageService.store();
            $scope.goToCurrentChapter();
        }

        /** Map attributes from services so that they are available in ctrl */
        $scope._mapAttributesFromService = function() {
            $scope.adventure = AdventureService.adventure;
            $scope.vitals = AdventureService.vitals;
            $scope.initial = AdventureService.initial;
            $scope.backpack = AdventureService.backpack;
            $scope.weapons = AdventureService.weapons;
        };

        /* Map functions from services */
        $scope.started = AdventureService.started;
        $scope.addItem = AdventureService.addItem;
        $scope.removeItem = AdventureService.removeItem;
        $scope.addWeapon = AdventureService.addWeapon;
        $scope.noWeapon = AdventureService.noWeapon;
        $scope.decreaseGold = AdventureService.decreaseGold;
        $scope.addGold = AdventureService.addGold;
    }
]);
