'use strict';

controllersModule.controller('chapterCtrl', [
    '$scope', '$routeParams', '$log', '$location', '$timeout',
    'AdventureService', 'FightService', 'StorageService', 'DiceService',
    function($scope, $routeParams, $log, $location, $timeout,
             AdventureService, FightService, StorageService, DiceService) {

        $timeout(function()  {
            $scope.init();
        });

        $scope.init = function() {
            $log.log("Loading chapter")
            var chapter;
            if ($routeParams.id) chapter = parseInt($routeParams.id);

            if (chapter == undefined || AdventureService.adventure.chapter == undefined) {
                $log.log("No current chapter. Loading adventure. chapter/adventure.chapter",
                         chapter, AdventureService.adventure.chapter);
                StorageService.load();
            }

            if (!AdventureService.started()) {
                $scope.goToCharacterBuilder();
                return;
            }

            var isNewChapter = chapter != AdventureService.adventure.chapter;
            $log.log("New chapter?", isNewChapter, chapter, AdventureService.adventure.chapter);

            if (chapter == undefined) {
                if (AdventureService.adventure.chapter) {
                    chapter = AdventureService.adventure.chapter;
                    $log.log("No chapter requested. Setting saved chapter", chapter);
                } else {
                    $log.log("No chapter requested nor saved. Setting chapter to 1");
                    chapter = 1;
                }
            }

            AdventureService.adventure.chapter = chapter;

            if (isNewChapter) {
                AdventureService.enterChapter(chapter);
                StorageService.store();
            }

            $scope.templateUrl = 'partials/chapters/01/chapter' + chapter + '.html';
            $scope.adventurePartial = 'partials/chapters/adventure.html';

            $scope._mapAttributesFromService();

            $log.log("Chapter loaded", chapter);
        }

        /** Map attributes from services so that they are available in ctrl */
        $scope._mapAttributesFromService = function() {
            $scope.adventure = AdventureService.adventure;
            $scope.specialActions = AdventureService.specialActions;
            $scope.vitals = AdventureService.vitals;
            $scope.initial = AdventureService.initial;
            $scope.backpack = AdventureService.backpack;
            $scope.weapons = AdventureService.weapons;
            $scope.fight = FightService.fight;
            $scope.diceDetails = DiceService.details;
        };

//        $scope.$watch("fight.fighting", function(newValue, oldValue) {
//            if (oldValue === true && newValue === false) {
//                var whereTo = $scope.fight.chapterWhenFightWon;
//                $log.log("fight is over. Going to", whereTo);
//                // FIXME Accessing DOM from ctrl is bad, use bootstrap.ui modal instead
//                $('#fight').modal('hide');
//                $scope.goTo(whereTo);
//            }
//        });

        /** Go to the given chapter */
        $scope.goToChapter = function(chapter) {
            $log.log('Redirecting to chapter', chapter);
            $location.path('/chapter/' + chapter);
        };

        $scope.goToCharacterBuilder = function()  {
            $log.log('Redirecting to character builder');
            $location.path('/character/');
        };

        /* Attempt to get the key at chapter 258 */

        $scope.chapter258ShowTestLuck = function() {
            return (AdventureService.specialActions.ch258.idx < AdventureService.specialActions.ch258.length) &&
                    (AdventureService.specialActions.ch258.idx == -1 || !$scope.chapter258LuckyNow());
        };
        $scope.chapter258LuckyNow = function() {
            return AdventureService.specialActions.ch258.idx >= 0 &&
                   AdventureService.specialActions.ch258.attempts[AdventureService.specialActions.ch258.idx].lucky;
        };
        $scope.chapter258Exhausted = function() {
            return AdventureService.specialActions.ch258.idx >= AdventureService.specialActions.ch258.length;
        }
        $scope.chapter258ShowFailure = function() {
            return $scope.chapter258Exhausted() && !$scope.chapter258LuckyNow();
        };
        $scope.chapter258Try = function() {
            AdventureService.specialActions.ch258.idx = AdventureService.specialActions.ch258.idx + 1;
            AdventureService.decreaseLuck();
            AdventureService.vitals.stamina =
                    AdventureService.specialActions.ch258.attempts[AdventureService.specialActions.ch258.idx].stamina;
        };


        /* Bitten by snakes at 366 */

        $scope.chapter366ShowLostEndurance = function() {
            return $scope.specialActions.ch366.dice < 6;
        };
        $scope.chapter366ShowDraw6 = function() {
            return $scope.specialActions.ch366.dice == 6;
        };
        $scope.chapter366Lost6 = function() {
            var ch366 = $scope.specialActions.ch366;
            return ch366.dice == 6 && ch366.testedLuck && ch366.lucky;
        };
        $scope.chapter366Dead = function() {
            var ch366 = $scope.specialActions.ch366;
            return ch366.dice == 6 && ch366.testedLuck && !ch366.lucky;
        };
        $scope.chapter366Roll = function() {
            $scope.specialActions.ch366.rolled = true;
            if ($scope.specialActions.ch366.dice < 6) {
                $scope.removeStamina($scope.specialActions.ch366.dice);
            }
        }
        $scope.chapter366ShowTestLuck = function() {
            var ch366 = $scope.specialActions.ch366;
            return  ch366.rolled && ch366.dice == 6 && !ch366.testedLuck;
        };
        $scope.chapter366TestLuck = function() {
            $scope.specialActions.ch366.lucky = $scope.pretestLuck();
            $scope.specialActions.ch366.testedLuck = true;
            $scope.decreaseLuck();
            if ($scope.specialActions.ch366.lucky) {
                $scope.removeStamina(6);
            } else {
                $scope.vitals.stamina = 0;
            }
        };
        $scope.chapter366ShowDone = function() {
            var ch366 = $scope.specialActions.ch366;
            return ch366.rolled  && (ch366.dice != 6 || ch366.testedLuck);
        };

        /* Map functions from services */
        $scope.eatGain = AdventureService.eatGain;
        $scope.addItem = AdventureService.addItem;
        $scope.addItemMultiple = AdventureService.addItemMultiple;
        $scope.removeItem = AdventureService.removeItem;
        $scope.emptyBackpack = AdventureService.emptyBackpack;
        $scope.buyItem = AdventureService.buyItem;
        $scope.buyItemMultiple = AdventureService.buyItemMultiple;
        $scope.buyWeapon = AdventureService.buyWeapon;
        $scope.addWeapon = AdventureService.addWeapon;
        $scope.noWeapon = AdventureService.noWeapon;
        $scope.useAndGain = AdventureService.useAndGain;
        $scope.payAndGain = AdventureService.payAndGain;
        $scope.eatAndGain = AdventureService.eatAndGain;
        $scope.pretestLuck = AdventureService.pretestLuck;
        $scope.decreaseLuck = AdventureService.decreaseLuck;
        $scope.decreaseGold = AdventureService.decreaseGold;
        $scope.addGold = AdventureService.addGold;
        $scope.removeStamina = AdventureService.removeStamina;
        $scope.addStamina = AdventureService.addStamina;

        $scope.startFight = FightService.startFight;
        $scope.isDead = FightService.isDead;
        $scope.assault = FightService.assault;

        $scope.roll = DiceService.roll;
    }
]);
