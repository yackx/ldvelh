'use strict';

angular.module('myApp.services.FightService', [], ['$provide', function ($provide) {

$provide.factory('FightService',
    ['$rootScope', '$log', 'AdventureService', 'DiceService',
    function ($rootScope, $log, AdventureService, DiceService) {

        var self = {

            fight: {
                assault: 1,
                enemies: [],
                enemyNr: undefined,
                chapterWhenFightWon: undefined
            },

            startFight: function(chapter, chapterWhenWon) {
                $log.log("Start fight for / when won", chapter, chapterWhenWon);

                var func = self['chapter' + chapter];
                func.apply();       // must exist

                self.fight.chapterWhenFightWon = chapterWhenWon;
                self.fight.enemyNr = 0;
                self.fight.fighting = true;
                self.fight.assault = 1;
            },


            /* Prepare fight for chapter */

            chapter2: function() {
                self.fight.enemies = [{name: 'enemy.snake', skills: 7, stamina: 8}];
            },

            chapter47: function() {
                self.fight.enemies = [{name: 'enemy.goblin', skills: 7, stamina: 6}];
            },

            chapter20: function() {
                self.fight.enemies = [{name: 'enemy.bear', skills: 7, stamina: 5}];
                AdventureService.specialActions.ch20 = AdventureService.vitals.skills;      // store current skills
                AdventureService.vitals.skills -= 2;                                        // reduce due to stink
            },

            chapter87: function() {
                var golem = { name: 'enemy.wood.golem', skills: 8, stamina: 6 };
                if (AdventureService.specialActions.ch383) {
                    golem.skills = 4;   // slowed down by spell
                }
                self.fight.enemies = [ golem ];
            },

            chapter99: function() {
                self.fight.enemies = [ { name: 'enemy.troll', skills: 8, stamina: 7 } ];
            },

            chapter104: function() {
                self.fight.enemies = [
                    { name: 'enemy.bandit.1', skills: 7, stamina: 6 },
                    { name: 'enemy.bandit.2', skills: 7, stamina: 8 }
                ];
            },

            chapter117: function() {
                self.fight.enemies = [
                    { name: 'enemy.assassin', skills: 8, stamina: 6 }
                ];

            },

            chapter123: function() {
                $log.log("Start fight #123 with special action", AdventureService.specialActions.ch123);
                switch (AdventureService.specialActions.ch123.dice) {
                    case 1:
                    case 2:
                        self.fight.enemies = [
                            { name: 'enemy.giant.bat', skills: 5, stamina: 5 }
                        ];
                        break;
                    case 3:
                        self.fight.enemies = [
                            { name: 'enemy.dog.wolf', skills: 5, stamina: 7 }
                        ];
                        break;
                    case 4:
                        self.fight.enemies = [
                            { name: 'enemy.werewolf', skills: 8, stamina: 9 }
                        ];
                        break;
                    default:
                        $log.error("Requested fight #123 without valid dice", AdventureService.specialActions.ch123);
                        break;
                }
                if (AdventureService.specialActions.ch453) {
                    AdventureService.vitals.skills = AdventureService.specialActions.ch453.fightSkills;
                }
            },
            exit123: function() {
                var ch453 = AdventureService.specialActions.ch453;
                if (ch453) AdventureService.vitals.skills = ch453.originalSkills;
            },

            chapter162: function() {
                self.fight.enemies = [{name: 'enemy.giant.hills', skills: 9, stamina: 11}];
            },

            chapter203: function() {
                self.fight.enemies = [{name: 'enemy.elvin', skills: 6, stamina: 4}];
                if (AdventureService.specialActions.ch356) {
                    AdventureService.vitals.skills = AdventureService.specialActions.ch356.fightSkills;
                }
            },
            exit203: function() {
                AdventureService.vitals.skills = AdventureService.specialActions.ch356.originalSkills;
            },

            chapter207: function() {
                self.fight.enemies = [{name: 'enemy.giant.hills', skills: 9, stamina: 11}];
            },

            chapter217: function() {
                self.fight.enemies = [
                    {name: 'enemy.first.goblin', skills: 5, stamina: 4},
                    {name: 'enemy.second.goblin', skills: 6, stamina: 4},
                    {name: 'enemy.third.goblin', skills: 5, stamina: 5}
                ];
            },

            chapter227: function() {
                var skills = AdventureService.specialActions.ch325 === true ? 6 : 12;
                self.fight.enemies = [{name: 'enemy.manticore', skills: skills, stamina: 18}];
            },

            chapter285: function() {
                self.fight.enemies = [{name: 'enemy.ogre', skills: 8, stamina: 7}];
            },

            chapter317: function() {
                self.fight.enemies = [{name: 'enemy.troll.sentinel', skills: 4, stamina: 7}];
            },

            chapter338: function() {
                self.fight.enemies = [{name: 'enemy.giant.hills', skills: 6, stamina: 11}];
            },

            chapter361: function() {
                self.fight.enemies = [{name: 'enemy.giant.hills', skills: 9, stamina: 11}];
                self.fight.sideKick = {name: 'side.magic.giant', skills: 8, stamina: 9};
            },

            chapter375: function() {
                self.fight.enemies = [{name: 'enemy.ogre', skills: 4, stamina: 7}];
            },

            chapter386: function() {
                self.fight.enemies = [{name: 'enemy.troll.sentinel', skills: 8, stamina: 7}];
            },

            chapter388: function() {
                self.fight.enemies = [{name: 'enemy.manticore', skills: 12, stamina: 18}];
                if (AdventureService.specialActions.ch388)
                    self.fight.sideKick = {name: 'side.magic.giant', skills: 8, stamina: 9};
            },

            chapter407: function() {
                self.fight.enemies = [];
                var ch407 = AdventureService.specialActions.ch407;
                if (!ch407.goblin2.flees) {
                    self.fight.enemies.push({name: 'enemy.second.goblin', skills: 6, stamina: 4})
                }
                if (!ch407.goblin3.flees) {
                    self.fight.enemies.push({name: 'enemy.third.goblin', skills: 5, stamina: 5})
                }
            },

            chapter411: function() {
                self.fight.enemies = [{name: 'enemy.giant.hills', skills: 9, stamina: 11}];
                AdventureService.vitals.skills = AdventureService.specialActions.ch411.fightSkills;
            },
            exit411: function() {
                AdventureService.vitals.skills = AdventureService.specialActions.ch411.originalSkills;
            },

            chapter425: function() {
                self.fight.enemies = [{name: 'enemy.dog.wolf', skills: 7, stamina: 6}];
                if (AdventureService.specialActions.ch425 === true)
                    self.fight.sideKick = {name: 'side.goblin', skills: 5, stamina: 5};
            },


            /** Perform an assault */
            assault: function() {
                var chapter = AdventureService.adventure.chapter;

                // Retrieve fighters and assault data
                var enemy = self.fight.enemies[self.fight.enemyNr];

                var rollHero = DiceService.roll(2);

                // Extra roll for hero, if applicable
                rollHero += self._extraRollHero(chapter);

                var rollEnemy = DiceService.roll(2);

                // Extra roll for enemy, if applicable
                rollEnemy += self._extraRollEnemy(chapter);

                // Adjust hero skills
                self._skillsHero(chapter);

                // Hero or sidekick fighting
                var skills = self.fight.sideKick ? self.fight.sideKick.skills : AdventureService.vitals.skills;

                var attackHero = skills + rollHero;
                attackHero += self.bestWeaponExtraSkills();

                // Adjust enemy skills
                var skillsEnemyFunc = self['skillsEnemy' + chapter];
                if (skillsEnemyFunc) {
                    enemy.skills = skillsEnemyFunc.apply();
                    $log.log("Adjust enemy skills at " + chapter + " to " + enemy.skills + "pts");
                };

                var attackEnemy = enemy.skills + rollEnemy;

                // Extra stamina removed from enemy, if applicable
                var extraStaminaTakenFromEnemy = self._extraStaminaTakenFromEnemy(chapter);

                // Extra stamina taken from hero, if applicable
                var extraStaminaTakenFromHero = self._extraStaminaTakenFromHero(chapter);

                $log.log("Hero rolled " + rollHero + " -> " + attackHero + " vs enemy #" +
                        self.fight.enemyNr + " rolled " + rollEnemy + " -> " + attackEnemy);

                // Who strikes?
                if (attackHero > attackEnemy) {
                    enemy.stamina = enemy.stamina - 2 - extraStaminaTakenFromEnemy;
                } else if (attackEnemy > attackHero) {
                    self.removeStaminaFromHeroOrSidekick(2 + extraStaminaTakenFromHero);
                } else {
                    // draw
                }

                // Enemy dead?
                if (enemy.stamina <= 0) {
                    self.fight.enemies.splice(self.fight.enemyNr, 1);
                }

                // Move to next enemy if applicable
                self.fight.enemyNr =
                        (self.fight.enemyNr + 1) % self.fight.enemies.length;

                // Enemies left?
                if (self.fight.enemies.length == 0) {
                    self.fight.fighting = false;
                    self.fight.sideKick = null;
                    self._endFight(chapter);
                }

                // Special: Golem slowed down at 87 as per spell cast 383
                if (chapter == 87 && AdventureService.specialActions.ch383 != undefined) {
                    $log.log("Special: reduced golem skills for " + AdventureService.specialActions.ch383 +  " assaults");
                    AdventureService.specialActions.ch383 -= 1;
                    if (AdventureService.specialActions.ch383 <= 0) {
                        delete AdventureService.specialActions.ch383;
                        self.fight.enemies[0].skills = 8;   // Golem is back to full skills
                    }
                }

                // Next assault
                self.fight.assault += 1;
            },


            _endFight: function(chapter) {
                var endFightFunc = self['exit' + chapter];
                if (endFightFunc) {
                    endFightFunc.apply();
                    $log.log("End fight " + chapter + "special processing");
                }
            },


            /* Extra Rolls */

            /** Extra roll for hero, if applicable */
            _extraRollHero: function(chapter) {
                var extraRollHeroFunc = self['extraRollHero' + chapter];
                if (extraRollHeroFunc) {
                    $log.log("Extra dice roll for hero at " + chapter);
                    return extraRollHeroFunc.apply();
                } else {
                    return 0;
                }
            },

            extraRollHero123: function() {
                if (AdventureService.specialActions.ch283 || AdventureService.specialActions.ch108) {
                    // If we came from @108 or @283, +2 on roll protection offered by camping
                    return 2;
                } else {
                    return 0;
                }
            },

            extraRollHero386: function() {
                return AdventureService.specialActions.ch386 ? 2 : 0;
            },

            /** Extra roll for enemy, if applicable */
            _extraRollEnemy: function(chapter) {
                var extraRollEnemyFunc = self['extraRollEnemy' + chapter];
                if (extraRollEnemyFunc) {
                    $log.log("Extra dice roll for enemy at " + chapter);
                    return extraRollEnemyFunc.apply();
                } else {
                    return 0;
                }
            },

            extraRollEnemy203: function() {
                // default: lighting fast elvin, +2
                // spell at 441: -2 so balance is 0
                return AdventureService.specialActions.ch441 ? 0 : 2;
            },

            extraRollEnemy400: function() {
                return -2;      // shield protection
            },


            /* Extra stamina taken */

            // Extra stamina removed from enemy, if applicable
            _extraStaminaTakenFromEnemy: function(chapter) {
                var extraStaminaTakenFromEnemy = 0;
                var extraStaminaTakenFromEnemyFunc = self['extraStaminaTakenFromEnemy' + chapter];
                if (extraStaminaTakenFromEnemyFunc) {
                    $log.log("Extra stamina taken from enemy at " + chapter + " -> " + extraStaminaTakenFromEnemy);
                    return extraStaminaTakenFromEnemyFunc.apply();
                } else {
                    return 0;
                }
            },

            extraStaminaTakenFromEnemy47: function() {
                return AdventureService.specialActions.ch328 === true ? 2 : 0;
            },

            extraStaminaTakenFromEnemy217: function() {
                // wax on sword? +2
                return AdventureService.specialActions.ch442 === true ? 2 : 0;
            },

            _extraStaminaTakenFromHero: function(chapter) {
                var extraStaminaTakenFromHeroFunc = self['extraStaminaTakenFromHero' + chapter];
                if (extraStaminaTakenFromHeroFunc) {
                    $log.log("Extra stamina taken from hero or side at", chapter);
                    return extraStaminaTakenFromHeroFunc.apply();
                } else {
                    return 0;
                }
            },

            extraStaminaTakenFromHero388: function() {
                // Manticore bites?
                return DiceService.roll(1) >= 5 ? 4 : 0;
            },


            /* Adjusted skills */

            // Adjust hero skills
            _skillsHero: function(chapter) {
                var skillsHeroFunc = self['skillsHero' + chapter];
                if (skillsHeroFunc) {
                    AdventureService.vitals.skills = skillsHeroFunc.apply();
                    $log.log("Adjust hero skills at " + chapter + " to " + AdventureService.vitals.skills + "pts");
                };
            },

            skillsEnemy317: function() {
                if (self.fight.assault <= 4) {
                    $log.log("Troll stays clumsy until assault #4");
                    return 4;
                };

                if (AdventureService.specialActions.ch317 === true) {
                    $log.log("Troll already picked up his weapon");
                    return 8;
                }

                var roll = DiceService.roll(1);
                if (roll % 2 == 0) {
                    // troll picked up his weapon
                    AdventureService.specialActions.ch317 = true;
                    $log.log("Troll picked up his weapon at 317");
                    return 8;
                } else {
                    $log.log("Troll did not pick up his weapon at 317");
                    return 4;
                }
            },

            skillsEnemy227: function() {
                // if spell cast @325 then reduced skills during 4 assaults
                return AdventureService.specialActions.ch325 === true && self.fight.assault <= 4 ? 6 : 12;
            },


            removeStaminaFromHeroOrSidekick: function(stamina) {
                if (self.fight.sideKick) {
                    self.fight.sideKick.stamina -= stamina;
                    if (self.fight.sideKick.stamina <= 0) {
                        // sidekick is dead
                        self.fight.sideKick = null;
                    }
                } else {
                    AdventureService.removeStamina(stamina);
                };
            },

            /** Extra skills with best weapon, or bare-hand penalty */
            bestWeaponExtraSkills: function() {
                if (_.size(AdventureService.weapons) == 0) {
                    return -4;
                } else {
                    return _.max(AdventureService.weapons, function(w) {return w});
                }
            }
        };

        return self;
    }]
);

}]);