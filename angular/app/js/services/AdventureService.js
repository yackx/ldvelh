'use strict';

angular.module('myApp.services.AdventureService', [], ['$provide', function ($provide) {

$provide.factory('AdventureService',
    ['$rootScope', '$log', 'DiceService', function ($rootScope, $log, DiceService) {

        var self = {

            adventure: {
                chapter: undefined
            },

            backpack: [],

            /**
             * Special values like merchant random price.
             * Keys are mainly 'ch__' where __ is the chapter number,
             * but can contain any entry relevant to the adventure
             */
            specialActions: { },

            /** What do you gain if you eat? */
            eatGain: function() {
                var alreadyEaten = 1;
                var firstMeal = 2;
                var price = undefined;
                var chapter = self.adventure.chapter;

                if (chapter == 134) {
                    alreadyEaten = 2;
                    firstMeal = 3;
                    price = 3;
                } else if (chapter == 267) {
                    price = 3;
                };

                return {
                    alreadyEaten: alreadyEaten,
                    firstMeal: firstMeal,
                    price: price
                }
            },

            newCharacter: function(stamina, skills, luck) {
                self.vitals = {
                    stamina: stamina,
                    skills: skills,
                    luck: luck
                };

                self.initial = {
                    stamina: stamina,
                    skills: skills,
                    luck: luck
                };

                self.adventure = {
                    chapter: 1,
                    gold: 20,
                    canInvokeLibra: true
                };

                self.backpack = {
                    'item.food': 2
                };

                self.weapons = {
                    'weapon.standard.sword': +0
                };

                self.specialActions = { };
            },

            started: function() {
                return self.vitals != undefined;
            },

            buyWeapon: function(weapon, extraSkills, price) {
                $log.log("Buying " + weapon + " (" + extraSkills + " skills) for " + price + " gold");
                if (!self.decreaseGold(price)) {
                    return false;
                } else {
                    self.addWeapon(weapon, extraSkills);
                    return true;
                }
            },

            addWeapon: function(weapon, extraSkills) {
                self.weapons[weapon] = extraSkills;
            },

            removeWeapon: function(weapon) {
                delete self.weapons[weapon];
            },

            /** Do we have weapons? */
            noWeapon: function() {
                return _.size(self.weapons) == 0;
            },

            buyItem: function(item, price) {
                $log.log("Buying item for price", item, price);
                if (price > self.adventure.gold) return false;
                self.adventure.gold = self.adventure.gold - price;
                self.addItem(item);
                return true;
            },

            buyItemMultiple: function(item, totalPrice, howMany) {
                $log.log("Add " + howMany + " '" + item + "' for totalPrice=" + totalPrice);
                if (self.decreaseGold(totalPrice))
                    for (var i = 0; i < howMany; i++) self.addItem(item);
            },

            addItem: function(item) {
                $log.log("addItem", item);
                if (!item) return;
                if (self.backpack[item]) {
                    self.backpack[item] += 1;
                } else {
                    self.backpack[item] = 1;
                }
            },

            addItemMultiple: function(item, howMany) {
                for (var i = 0; i < howMany; i++) self.addItem(item);
            },

            removeItem: function(item) {
                $log.log("Remove item from backpack", item);
                if (self.backpack[item]) {
                    if (self.backpack[item] > 1) {
                        self.backpack[item] -= 1;
                    } else {
                        delete self.backpack[item];
                    }
                    return true;
                } else {
                    return false;
                }
            },

            removeAllCopiesOf: function(item) {
                while (self.removeItem(item));
            },

            emptyBackpack: function() {
                $log.log("Remove all items from backpack");
                self.backpack = {};
            },

            useAndGain: function(item, staminaGain) {
                if (self.removeItem(item)) self.addStamina(staminaGain);
            },

            eatAndGain: function(staminaGain) {
                self.useAndGain('item.food', staminaGain);
            },

            payAndGain: function(price, staminaGain) {
                $log.log("Pay " + price + " and gain " + staminaGain + " stamina");
                if (self.decreaseGold(price)) {
                    self.addStamina(staminaGain);
                    return true;
                } else {
                    return false;
                }
            },

            decreaseGold: function(coins) {
                if (self.adventure.gold >= coins) {
                    self.adventure.gold -= coins ;
                    return true;
                } else {
                    return false;
                }
            },

            addGold: function(coins) {
                self.adventure.gold += coins;
            },

            /**
             * Pre-test luck.
             * It is up to the caller to actually decrease luck afterwards.
             * This function also sets the specialActions.lucky flag will be set accordingly.
             * @returns {boolean} Is the hero lucky?
             */
            pretestLuck: function() {
                var lucky = self.pretestLuckValue() > 0;
                self.specialActions.lucky = lucky;
                return lucky;
            },

            /**
             * Pre-test luck.
             * It is up to the caller to actually decrease luck afterwards.
             * @returns {int} The dice roll as a positive number if the hero was lucky,
             * or as a negative number if she was unlucky.
             */
            pretestLuckValue: function() {
                var roll = DiceService.roll(2);
                if (self.backpack['item.amulet.metal.twisted']) roll -= 1;
                return roll <= self.vitals.luck ? roll : -roll;
            },

            increaseLuck: function(luck) {
                var target = self.vitals.luck + luck;
                self.vitals.luck = (target <= self.initial.luck) ? target : self.initial.luck;
            },

            decreaseLuck: function() {
                $log.log("Decrease luck");
                if (self.vitals.luck > 0) self.vitals.luck--;
            },

            addStamina: function(points) {
                $log.log("Add stamina", points);
                self.vitals.stamina += points;
                if (self.vitals.stamina > self.initial.stamina) {
                    self.vitals.stamina = self.initial.stamina;
                }
            },

            removeStamina: function(points) {
                $log.log("Remove stamina", points);
                var current = self.vitals.stamina;
                self.vitals.stamina = current > points ? current-points : 0;
            },

            isDead: function() {
                return self.vitals.stamina <= 0;
            },

            enterChapter: function(chapter) {
                $log.log("Enter", chapter);

                var func = self['enter' + chapter];
                if (func) {
                    func.apply();
                } else {
                    $log.log("No specific processing for", chapter);
                }
                self.adventure.chapter = chapter;
            },

            enter2: function() {
                self.removeStamina(1);
            },

            enter6: function() {
                // the sword is added 'onclick' @194 as there is a possibility of refund.
                self.decreaseGold(6);
            },

            enter15: function() {
                self.addGold(20);
            },

            enter21: function() {
                self.addStamina(3);
            },

            enter22: function() {
                if (!self.specialActions.ch22) {
                    self.specialActions['ch22'] = DiceService.roll(1);
                }
            },

            enter23: function() {
                // Prepare possible dice roll and test luck
                if (!self.specialActions.ch23) {
                    var roll = DiceService.roll(1);
                    var lucky = self.pretestLuck();
                    var whereTo = [245, 245, 69, 69, 99, 99];
                    self.specialActions['ch23'] = {
                        roll: roll,
                        rollTarget: whereTo[roll],
                        lucky: lucky                    // if lucky, target is always 167
                    };
                    $log.log("Special ch23: Rolled " + roll + "; target: " + whereTo[roll] + "; lucky? " + lucky);
                }
            },

            enter25: function() {
                self.adventure.canInvokeLibra = false;
            },

            enter38: function() {
                self.removeStamina(2);
                DiceService.rollDetails(1);
            },

            enter45: function() {
                if (self.decreaseGold(3)) {
                    self.addStamina(5);
                }
            },

            enter49: function() {
                self.removeStamina(2);
            },

            enter55: function() {
                self.addStamina(3);
            },

            enter57: function() {
                // if no item in backpack, you lose all your gold
                if (_.size(self.backpack) === 0) self.adventure.gold = 0;
                // found 12 gold
                self.adventure.gold += 12;
            },

            enter59: function() {
                self.removeStamina(2);
                self.decreaseLuck();
            },

            enter62: function() {
                self.addStamina(1);     // well rested
            },

            enter84: function() {
                // sleep deprived
                self.removeStamina(2);
                // store this chapter for generic fight @123
                self.specialActions.ch123 = {
                    whenDone: 84
                }
            },

            enter85: function() {
                self.removeStamina(3);
            },

            enter87: function() {
                self.adventure.gold += 7;
            },

            enter94: function() {
                self.increaseLuck(1);
            },

            enter96: function() {
                self.decreaseGold(1);
            },

            enter97: function() {
                if (self.decreaseGold(6)) self.addItemMultiple('item.food', 3);
            },

            enter108: function() {
                // Mark we've been there (hero rolls +2 on assaults, if any)
                self.specialActions.ch108 = true;
                // store this chapter for generic fight @123
                self.specialActions.ch123 = {
                    whenDone: 108
                }
            },

            enter110: function() {
                self.addItem('item.boots.fur.gascal');
            },

            enter115: function() {
                if (self.decreaseGold(3)) self.addStamina(2);
            },

            enter116: function() {
                if (self.decreaseGold(1)) self.addStamina(2);
            },

            enter122: function() {
                self.addItem('item.armwrist.ragnar');
            },

            enter123: function() {
                if (self.specialActions.ch123 === undefined) {
                    // attribute may or may not have been created before - do not overwrite
                    self.specialActions.ch123 = {};
                }
                // random creature
                self.specialActions.ch123.dice = DiceService.roll(1)
            },

            enter140: function() {
                self.removeStamina(2);
            },

            enter141: function() {
                if (!self.specialActions.ch141) {
                    self.specialActions.ch141 = DiceService.roll(2);
                }
            },

            enter144: function() {
                self.pretestLuck();
            },

            enter146: function() {
                self.addStamina(1);
                self.increaseLuck(1);
            },

            enter152: function() {
                self.removeItem('item.jewel');
            },

            enter153: function() {
                self.adventure.gold += 3;
            },

            enter160: function() {
                self.adventure.canInvokeLibra = false;
            },

            /**
             * You must be lucky 3 times in a row. Prepare the dice here.
             * @returns An array with:
             *   'lucky' (boolean)
             *   'dices' (dice roll)
             *   'inARow' (number of times lucky in a row)
             * eg [ {lucky: false, inARow: 0, dices: 12}, {lucky: true, inARow: 1, dices: 4}, ... ,
             *      {lucky: true, inARow: 3, dices: 3} ]
             */
            enter165: function() {
                self.specialActions.ch165 = {
                    attempts: undefined,
                    idx: -1
                }
                var attempts = [];
                var i = 0;
                var inARow = 0;
                var stamina = self.vitals.stamina;
                do {
                    var dices = self.pretestLuckValue();
                    var lucky = dices > 0;
                    if (lucky) {
                        inARow += 1;
                    } else {
                        inARow = 0;
                        stamina -= 3;
                    }

                    attempts[i] = {
                        lucky: lucky,
                        inARow: inARow,
                        dices: Math.abs(dices),
                        stamina: stamina
                    };
                    i += 1;
                } while (i < self.vitals.luck && inARow < 3 && stamina > 0);

                self.specialActions.ch165.attempts = attempts;
            },

            enter168: function() {
                // all food is gone
                self.removeAllCopiesOf('item.food');
            },

            enter177: function() {
                self.vitals.gold += 3;
                self.addItem('item.amulet.metal.twisted');
            },

            enter183: function() {
                self.addItem('item.magic.book.page.102')
            },

            enter185: function() {
                self.increaseLuck(2);
                self.addStamina(1);

                // lose best weapon
                var bestIndex = -1;
                for (var k in self.weapons) {
                    if (bestIndex == -1 || self.weapons[k] > self.weapons[bestIndex]) bestIndex = k;
                }
                delete self.weapons[bestIndex];
            },

            enter187: function() {
                self.increaseLuck(2);
            },

            enter190: function() {
                if (self.backpack['item.teeth']) {
                    self.removeItem('item.teeth');
                    self.addItemMultiple('item.tooth.goblin', 4);
                    self.addItem('item.tooth.giant');
                };
            },

            enter191: function() {
                if (self.decreaseGold(2)) {
                    self.addStamina(2);
                    self.increaseLuck(1);
                }
            },

            enter192: function() {
                self.decreaseGold(1);
                self.addItem('item.bomba');
                self.increaseLuck(2);
            },

            enter193: function() {
                // skills were reduced during fight ch 20
                self.vitals.skills = self.specialActions.ch20;
            },

            enter201: function() {
                self.removeStamina(1);
            },

            enter203: function() {
                self.removeStamina(1);
            },

            enter204: function() {
                self.decreaseGold(3);
                self.vitals = self.initial;
            },

            enter205: function() {
                self.removeItem('item.magic.book.page.102');
            },

            enter213: function() {
                self.vitals.skills -= 2;
                self.specialActions.ch213 = true;   // cursed
            },

            enter214: function() {
                if (!self.specialActions.ch214) {
                    self.specialActions.ch214 = DiceService.roll(2);
                }
            },

            enter215: function() {
                self.removeStamina(2);
            },

            enter218: function() {
                var stolenItems = [];
                _.each(_.keys(self.backpack), function(k) {
                    for (var i = 0; i < self.backpack[k]; i++) {
                        if (!self.pretestLuck()) {
                            stolenItems.push(k);
                        }
                    }
                });
                _.each(stolenItems, function(stolen) { self.removeItem(stolen); });

                var goldStolen = !self.pretestLuck();
                if (goldStolen) self.adventure.gold = 0;

                self.specialActions.ch218 = {
                    items: stolenItems,
                    gold: goldStolen,
                    robbed: stolenItems.length > 0 || goldStolen
                };

                $log.log("Robbed?", self.specialActions.ch218.robbed);
                $log.log("Gold stolen", self.specialActions.ch218.gold);
                $log.log("Items stolen", self.specialActions.ch218.items);
            },

            enter224: function() {
                self.removeStamina(2);
            },

            enter228: function() {
                self.specialActions.ch228 = {};
                self.specialActions.ch228.dices = [];
                var total = 0;
                for (var i = 0; i < 3; i++) {
                    var dice = DiceService.roll(1);
                    self.specialActions.ch228.dices.push(dice);
                    total += dice;
                }
                self.specialActions.ch228.total = total;
                var success = total < self.vitals.skills;
                self.specialActions.ch228.success = success;
                if (success) self.vitals.skills -= 1;
            },

            enter233: function() {
                self.addItem('item.crystal.waterfalls.free.pass');
                self.addWeapon('weapon.standard.sword', 0);
                self.increaseLuck(3);
                self.addStamina(3);
            },

            enter238: function() {
                self.removeStamina(2);
                self.decreaseLuck();
            },

            enter244: function() {
                if (self.decreaseGold(1)) {
                    self.addItem('item.key.khare.prison.206');
                }
            },

            enter247: function() {
                if (self.decreaseGold(4)) {
                    self.addItem('item.skullcap');
                }
            },

            enter248: function() {
                self.addItem('item.glue');
                self.addItem('item.tampons');
                self.addItem('item.pebbles');
            },

            enter253: function() {
                self.removeStamina(2);
                self.decreaseLuck();
            },

            enter254: function() {
                var whereTo = [ 68, 68, 13, 13, 98, 98 ];
                self.specialActions.ch254 = whereTo[DiceService.roll(1) - 1];
            },

            enter258: function() {
                self.specialActions.ch258 = {
                    idx: -1,
                    attempts: [],
                    length: 0
                };
                var done = false;
                var stamina = self.vitals.stamina;
                while (!done) {
                    var lucky = self.pretestLuck();
                    stamina = lucky ? stamina: stamina / 2 | 0;
                    done = lucky || stamina <=0;
                    self.specialActions.ch258.attempts.push({
                        lucky: lucky,
                        stamina: stamina
                    });
                };
                self.specialActions.ch258.length = _.size(self.specialActions.ch258.attempts);
                $log.log("enter258 special", self.specialActions.ch258);
            },

            enter261: function() {
                self.removeStamina(2);
                self.emptyBackpack();
                self.adventure.gold = 0;
            },

            enter262: function() {
                self.increaseLuck(2);
            },

            enter263: function() {
                self.adventure.gold += 3;
            },

            enter265: function() {
                self.adventure.gold += 8;
            },

            enter270: function() {
                var dice = DiceService.roll(1);
                self.specialActions.ch270 = {
                    dice: dice,
                    lost: dice < 5 ? dice : 0
                }
            },

            enter273: function() {
                self.adventure.canInvokeLibra = false;
            },

            enter277: function() {
                // roll two dices
                var dice1 = DiceService.roll(1);
                var dice2 = DiceService.roll(2);
                var total = dice1 + dice2;
                var effectiveTotal = total;

                // spell at 424 allows to subtract 2
                if (self.specialActions.ch424) effectiveTotal -= 3;

                var lost = undefined;
                var killed = false;
                if (effectiveTotal < self.vitals.luck) lost = 0
                else if (effectiveTotal == self.vitals.luck) lost = 1
                else if (effectiveTotal == 12) killed = true;
                else lost = 3;

                self.specialActions.ch277 = {
                    dice1: dice1,
                    dice2: dice2,
                    total: total,
                    effectiveTotal: effectiveTotal,
                    lost: lost,
                    killed: killed
                }

                $log.log("special277", self.specialActions.ch277);
            },

            enter283: function() {
                // store this chapter for generic fight @123
                self.specialActions.ch123 = {
                    whenDone: 283
                };

                // have we been here before? Initialize or increment
                if (!self.specialActions.ch283) {
                    self.specialActions.ch283 = 1;
                } else {
                    self.specialActions.ch283 += 1;
                }

                if (self.specialActions.ch283 == 2) {
                    // Been here twice so we're back from possible fight @123. Did we sleep well?
                    if (self.specialActions.ch123.dice > 4) {
                        // no fight night, rested
                        self.addStamina(2);
                    } else {
                        // creature encountered, little sleep
                        self.addStamina(1);
                    }
                }
            },

            enter287: function() {
                self.removeStamina(5);
            },

            enter288: function() {
                self.removeStamina(4);
            },

            enter289: function() {
                self.removeStamina(5);
            },

            enter290: function() {
                self.removeStamina(5);
            },

            enter291: function() {
                self.removeStamina(2);
            },

            enter292: function() {
                self.removeStamina(2);
            },

            enter293: function() {
                self.removeStamina(5);
            },

            enter294: function() {
                self.removeStamina(5);
            },

            enter295: function() {
                self.removeStamina(2);
                DiceService.rollDetails(3);     // will be stored in 'details'
            },

            enter296: function() {
                self.removeStamina(1);
                self.decreaseGold(1);
            },

            enter297: function() {
                self.removeStamina(4);
            },

            enter298: function() {
                self.removeStamina(2);
                self.addStamina(2);
                // may be dead in between
            },

            enter299: function() {
                self.removeStamina(1);
                self.removeItem('item.blueberry');
            },

            enter300: function() {
                self.removeStamina(1);
            },

            enter301: function() {
                self.removeStamina(1);
            },

            enter302: function() {
                self.removeStamina(1);
                self.removeStamina(6);
            },

            enter303: function() {
                self.removeStamina(1);
                self.removeItem('item.pebbles');
            },

            enter304: function() {
                self.removeStamina(5);
            },

            enter305: function() {
                self.removeStamina(4);
            },

            enter306: function() {
                self.removeStamina(4);
            },

            enter308: function() {
                // cast spell
                self.removeStamina(1);
                // penalty if item not present
                if (!self.backpack['item.bamboo.flute']) self.removeStamina(3);
            },

            enter309: function() {
                self.removeStamina(1);
                self.removeStamina(3);
            },

            enter310: function() {
                self.removeStamina(5);
            },

            enter311: function() {
                self.removeStamina(5);
            },

            enter312: function() {
                self.removeStamina(1);
                self.removeStamina(2);
            },

            enter313: function() {
                self.removeStamina(5);
            },

            enter314: function() {
                self.removeStamina(5);
            },

            enter315: function() {
                self.removeStamina(5);
            },

            enter316: function() {
                self.removeStamina(2);
            },

            enter318: function() {
                self.removeStamina(4);
                self.addStamina(3);
                // may be dead in between
            },

            enter319: function() {
                self.removeStamina(1);
            },

            enter320: function() {
                self.removeStamina(5);
            },

            enter321: function() {
                self.removeStamina(2);
            },

            enter322: function() {
                self.removeStamina(5);
            },

            enter323: function() {
                self.removeStamina(4);
            },

            enter324: function() {
                self.removeStamina(1);
            },

            enter325: function() {
                self.removeStamina(2);
                self.specialActions.ch325 = true;
            },

            enter326: function() {
                self.removeStamina(5);
            },

            enter327: function() {
                self.removeStamina(5);
            },

            enter328: function() {
                self.removeStamina(1);
                if (self.removeItem('item.wax')) {
                    self.specialActions.ch328 = true;
                } else {
                    self.removeStamina(3);
                }
            },

            enter329: function() {
                self.removeStamina(1);
            },

            enter330: function() {
                self.removeStamina(1);
                self.specialActions.ch330 = true;
            },

            enter331: function() {
                self.removeStamina(5);
            },

            enter332: function() {
                self.removeStamina(1);
            },

            enter333: function() {
                self.removeStamina(4);
            },

            enter334: function() {
                self.removeStamina(5);
            },

            enter335: function() {
                self.removeStamina(4);
            },

            enter336: function() {
                self.removeStamina(5);
            },

            enter337: function() {
                self.removeStamina(5);
            },

            chapter339: function() {
                self.removeStamina(1);
                if (!self.removeItem('item.bamboo.flute')) self.removeStamina(2);
            },

            enter340: function() {
                self.removeStamina(5);
            },

            enter341: function() {
                self.removeStamina(5);
            },

            enter342: function() {
                self.removeStamina(1);
            },

            enter343: function() {
                self.removeStamina(1);
            },

            enter344: function() {
                self.removeStamina(5);
            },

            enter345: function() {
                self.removeStamina(5);
            },

            enter346: function() {
                self.removeStamina(4);
            },

            enter347: function() {
                self.removeStamina(1);
            },

            enter348: function() {
                self.removeStamina(4);
                self.removeStamina(2);  // double damage
            },

            enter349: function() {
                self.removeStamina(1);
                self.removeStamina(2);
            },

            enter350: function() {
                self.removeStamina(5);
            },

            enter351: function() {
                self.removeStamina(5);
            },

            enter353: function() {
                self.removeStamina(1);
                self.removeStamina(1);
            },

            enter354: function() {
                self.removeStamina(1);
            },

            enter355: function() {
                self.removeStamina(4);
            },

            enter356: function() {
                self.removeStamina(2);
                self.specialActions.ch356 = {
                    originalSkills: self.vitals.skills,
                    fightSkills: self.vitals.skills * 2
                };
            },

            enter357: function() {
                self.removeStamina(5);
            },

            enter358: function() {
                self.removeStamina(1);
                self.removeStamina(2);
            },

            enter359: function() {
                self.removeStamina(1);
            },

            enter361: function() {
                self.removeStamina(1);
                self.removeItem('item.tooth.giant');
            },

            enter362: function() {
                self.removeStamina(1);
            },

            enter363: function() {
                self.removeStamina(1);
                self.removeStamina(2);
            },

            enter365: function() {
                self.removeStamina(4);
            },

            enter366: function() {
                self.removeStamina(1);
                self.specialActions.ch366 = {
                    dice: DiceService.roll(1),
                    lucky: undefined,
                    rolled: false,
                    testedLuck: false
                }
            },

            enter367: function() {
                self.removeStamina(1);
                self.removeItem('item.glue');
            },

            enter368: function() {
                self.removeStamina(5);
            },

            enter370: function() {
                self.removeStamina(5);
            },

            enter371: function() {
                self.removeStamina(1);
                self.removeStamina(3);  // double damage
            },

            enter372: function() {
                self.removeStamina(2);
            },

            enter373: function() {
                self.removeStamina(2);
            },

            enter374: function() {
                self.removeStamina(2);
            },

            enter375: function() {
                self.removeStamina(2);
            },

            enter376: function() {
                self.removeStamina(5);
            },

            enter377: function() {
                self.removeStamina(5);
            },

            enter378: function() {
                self.removeStamina(1);
                self.removeStamina(3);
            },

            enter379: function() {
                self.removeStamina(5);
            },

            enter380: function() {
                self.removeStamina(4);
            },

            enter381: function() {
                self.removeStamina(5);
            },

            enter382: function() {
                self.removeStamina(5);
            },

            enter383: function() {
                self.removeStamina(2);
                self.specialActions.ch383 = 4;  // slow Golem (-4 skills) for 4 assaults
            },

            enter384: function() {
                self.removeStamina(1);
                self.removeStamina(2);
            },

            enter385: function() {
                self.removeStamina(1);
            },

            enter386: function() {
                self.removeStamina(1);
                if (self.decreaseGold(1)) {
                    self.specialActions.ch386 = true;
                }
            },

            enter387: function() {
                self.removeStamina(2);
            },

            enter388: function() {
                self.removeStamina(1);
                self.specialActions.ch388 = self.removeItem('item.tooth.giant');
            },

            enter389: function() {
                self.removeStamina(5);
            },

            enter390: function() {
                self.removeStamina(2);
                self.removeAllCopiesOf('item.food');
            },

            enter391: function() {
                self.removeStamina(5);
            },

            enter392: function() {
                self.removeStamina(2);
            },

            enter393: function() {
                self.removeStamina(5);
            },

            enter394: function() {
                self.removeStamina(2);
            },

            enter395: function() {
                self.removeStamina(5);
            },

            enter396: function() {
                self.removeStamina(5);
            },

            enter397: function() {
                self.removeStamina(5);
            },

            enter398: function() {
                self.removeStamina(5);
            },

            enter399: function() {
                self.removeStamina(2);
            },

            enter400: function() {
                self.removeStamina(1);
                if (self.decreaseGold(1)) {
                    self.specialActions.ch400 = true;
                } else {
                    self.removeStamina(2);
                }
            },

            enter401: function() {
                self.removeStamina(self.removeItem('item.tooth.goblin') ? 1 : 2);
            },

            enter402: function() {
                self.removeStamina(1);
                self.removeStamina(3);
            },

            enter403: function() {
                self.removeStamina(2);
            },

            enter404: function() {
                self.removeStamina(1);
                self.removeStamina(2);
            },

            enter405: function() {
                self.removeStamina(4);
            },

            enter406: function() {
                self.removeStamina(2);
            },

            enter407: function() {
                self.removeStamina(4);

                var details2 = DiceService.rollDetails(2);
                var details3 = DiceService.rollDetails(2);
                var goblin2Flees = details2.total >= 6;
                var goblin3Flees = details3.total >= 5;
                var mustFight = !goblin2Flees || !goblin3Flees;
                self.specialActions.ch407 = {
                    goblin2: {
                        dice1: details2.rolls[0],
                        dice2: details2.rolls[1],
                        total: details2.total,
                        flees: goblin2Flees
                    },
                    goblin3: {
                        dice1: details3.rolls[0],
                        dice2: details3.rolls[1],
                        total: details3.total,
                        flees: goblin3Flees
                    },
                    mustFight: mustFight
                };
                $log.log("Special action ch407", self.specialActions.ch407);
            },

            enter408: function() {
                self.removeStamina(4);
            },

            enter409: function() {
                self.removeStamina(2);
            },

            enter410: function() {
                self.removeStamina(1);
                self.removeStamina(2);
            },

            enter411: function() {
                self.removeStamina(2);
                self.specialActions.ch411 = {
                    fightSkills: self.vitals.skills * 2,
                    originalSkills: self.vitals.skills
                };
            },

            enter412: function() {
                self.removeStamina(5);
            },

            enter413: function() {
                self.removeStamina(5);
            },

            enter414: function() {
                self.removeStamina(5);
            },

            enter415: function() {
                self.removeStamina(4);
            },

            enter416: function() {
                self.removeStamina(5);
            },

            enter417: function() {
                self.removeStamina(5);

                var dice = DiceService.roll(1);
                var lostStamina = dice <= 5 ? dice : self.vitals.stamina;
                self.specialActions.ch417 = {
                    dice: dice,
                    lostStamina: lostStamina
                };
                $log.log("Special action ch417", self.specialActions.ch417);
            },

            enter418: function() {
                self.removeStamina(5);
            },

            enter419: function() {
                self.removeStamina(1);
            },

            enter421: function() {
                self.removeStamina(1);
                self.removeStamina(2);
            },

            enter422: function() {
                self.removeStamina(1);
                self.removeStamina(2);
            },

            enter423: function() {
                self.removeStamina(2);
            },

            enter424: function() {
                self.removeStamina(2);
                self.specialActions.ch424 = true
            },

            enter425: function() {
                if (self.removeItem('item.tooth.goblin')) {
                    self.removeStamina(1);
                    self.specialActions.ch425 = true;
                } else {
                    self.removeStamina(5);
                    self.specialActions.ch425 = false;
                }
            },

            enter426: function() {
                self.removeStamina(2);
            },

            enter427: function() {
                self.removeStamina(5);
            },

            enter429: function() {
                self.removeStamina(9);
            },

            enter430: function() {
                self.removeStamina(5);
            },

            enter431: function() {
                self.removeStamina(4);
            },

            enter432: function() {
                self.removeStamina(5);
            },

            enter433: function() {
                self.removeStamina(4);
            },

            enter434: function() {
                self.removeStamina(1);
            },

            enter435: function() {
                self.removeStamina(5);
            },

            enter436: function() {
                self.removeStamina(5);
            },

            enter437: function() {
                self.removeStamina(5);
            },

            enter438: function() {
                self.removeStamina(4);
            },

            enter439: function() {
                self.removeStamina(5);
            },

            enter440: function() {
                self.removeStamina(5);
            },

            enter441: function() {
                self.removeStamina(1);

                var goldRemoved = self.decreaseGold(1);
                if (!goldRemoved) self.removeStamina(2);
                self.specialActions.ch441 = goldRemoved;
            },

            enter442: function() {
                self.removeStamina(1);
                self.specialActions.ch442 = self.removeItem('item.wax');
            },

            enter443: function() {
                self.removeStamina(5);
            },

            enter444: function() {
                self.removeStamina(5);
            },

            enter445: function() {
                self.removeStamina(5);
            },

            enter446: function() {
                self.removeStamina(5);
            },

            enter447: function() {
                self.removeStamina(5);
            },

            enter448: function() {
                self.removeStamina(4);
            },

            enter449: function() {
                self.removeStamina(4);
            },

            enter450: function() {
                self.removeStamina(1);
            },

            enter451: function() {
                self.removeStamina(5);
            },

            enter452: function() {
                self.removeStamina(1);
            },

            enter453: function() {
                self.removeStamina(2);
                self.specialActions.ch453 = {
                    fightSkills: self.vitals.skills * 2,
                    originalSkills: self.vitals.skills
                };
            },

            enter454: function() {
                self.removeStamina(2);
            },

            enter455: function() {
                self.removeStamina(2);
            },

            enter456: function() {
                self.vitals.stamina = self.initial.stamina;
                self.vitals.skills = self.initial.skills;
                self.vitals.luck = self.initial.luck;
                self.addGold(10);
                self.addItem('item.key.chapter12');
                self.initial.luck += 1;
            },

            foo: 'bar'
        };

        return self;
    }]
);

}]);