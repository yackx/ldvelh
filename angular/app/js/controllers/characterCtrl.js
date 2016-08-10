'use strict';

controllersModule.controller('characterCtrl', [
    '$scope', '$log', '$location', '$timeout',
    'AdventureService', 'StorageService', 'DiceService',
    function($scope, $log, $location, $timeout,
             AdventureService, StorageService, DiceService) {

        $scope.basicCharacter = {
            stamina: 7 + 12,
            skills: 4 + 4,
            luck: 6 + 6
        };

        $scope.build = 'normal';

        $timeout(function()  {
            $scope.init();
        });

        $scope.init = function() {
            $scope._buildBasicCharacter();
        };

        $scope._buildBasicCharacter = function() {
            $scope.character = angular.copy($scope.basicCharacter);
        }

        $scope.buildCharacterSkilled = function() {
            $scope._buildBasicCharacter();
            $scope.character.skills += 1;
            $scope.character.stamina -= 1;
            $scope.build = 'skilled';
        };

        $scope.buildCharacterStrong = function() {
            $scope._buildBasicCharacter();
            $scope.character.skills -= 1;
            $scope.character.stamina += 1;
            $scope.build = 'strong';
        };

        $scope.buildCharacterLucky = function() {
            $scope._buildBasicCharacter();
            $scope.character.stamina -= 1;
            $scope.character.luck += 1;
            $scope.build = 'lucky';
        };

        $scope.buildCharacterNormal = function() {
            $scope._buildBasicCharacter();
            $scope.build = 'normal';
        };

        $scope.buildCharacterRandom = function() {
            $scope.character = {
                stamina: DiceService.roll(2) + 12,
                skills: DiceService.roll(1) + 4,
                luck: DiceService.roll(1) + 6
            };
            $scope.build = 'random';
        };

        $scope.buildCharacter = function() {
            var character = $scope.character;
            AdventureService.newCharacter(character.stamina, character.skills, character.luck);
            StorageService.store();
            $scope.goToChapter(1);
        };

        /** Go to the given chapter */
        $scope.goToChapter = function(chapter) {
            $location.path('/chapter/' + chapter);
        };

    }
]);