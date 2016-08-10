describe('AdventureService', function() {

    var AdventureService, DiceService;

    beforeEach(module('myApp.services'));

    beforeEach(function() {
        inject(function($injector) {
            AdventureService = $injector.get('AdventureService');
            DiceService = $injector.get('DiceService');
        });
    });

    describe('eatGain', function() {
        it('should return the default values', function() {
            AdventureService.adventure.chapter = 1;
            var gain = AdventureService.eatGain();
            expect(gain.alreadyEaten).toBe(1);
            expect(gain.firstMeal).toBe(2);
            expect(gain.price).toBeUndefined();
        });
        it('should return the values for chapter 134', function() {
            AdventureService.adventure.chapter = 134;
            var gain = AdventureService.eatGain();
            expect(gain.alreadyEaten).toBe(2);
            expect(gain.firstMeal).toBe(3);
            expect(gain.price).toBe(3);
        });
        it('should return the values for chapter 267', function() {
            AdventureService.adventure.chapter = 267;
            var gain = AdventureService.eatGain();
            expect(gain.alreadyEaten).toBe(1);
            expect(gain.firstMeal).toBe(2);
            expect(gain.price).toBe(3);
        });
    });

    describe('addItem', function() {

        it('should add same items', function() {
            AdventureService.backpack = {
                'item.something': 1 ,
                'item.food': 2,
                'item.tooth': 1
            };
            AdventureService.addItem('item.food');
            AdventureService.addItem('item.tooth');
            expect(_.size(AdventureService.backpack)).toBe(3);
            expect(AdventureService.backpack['item.something']).toBe(1);
            expect(AdventureService.backpack['item.food']).toBe(3);
            expect(AdventureService.backpack['item.tooth']).toBe(2);
        });

        it('should add a new item', function() {
            AdventureService.backpack = {
                'item.something': 1
            };
            AdventureService.addItem('item.food');
            expect(_.size(AdventureService.backpack)).toBe(2);
            expect(AdventureService.backpack['item.food']).toBe(1);
            expect(AdventureService.backpack['item.something']).toBe(1);
        });

        it('should add an item to an empty backpack', function() {
            AdventureService.backpack = { };
            AdventureService.addItem('item.a');

            expect(AdventureService.backpack['item.a']).toBe(1);
            expect(_.size(AdventureService.backpack)).toBe(1);
        });
    });


    describe('buyItem', function() {

        it('should pay the price and add the item', function() {
            AdventureService.adventure.gold = 10;

            spyOn(AdventureService, 'addItem');

            var added = AdventureService.buyItem('item.foo', 4);

            expect(AdventureService.addItem).toHaveBeenCalledWith('item.foo');
            expect(AdventureService.adventure.gold).toBe(6);
            expect(added).toBe(true);
        });

        it('should not add the item when insufficient gold', function() {
            AdventureService.adventure.gold = 4;

            spyOn(AdventureService, 'addItem');

            var added = AdventureService.buyItem('item.foo', 6);

            expect(AdventureService.addItem).not.toHaveBeenCalled();
            expect(AdventureService.adventure.gold).toBe(4);
            expect(added).toBe(false);
        });
    });

    describe('buyItemMultiple', function() {

        it('should pay the total price and add the items', function() {
            AdventureService.adventure.gold = 10;

            var goodAddCount = 0;
            spyOn(AdventureService, 'addItem').andCallFake(function(item) {
                if (item === 'item.foo') goodAddCount = goodAddCount + 1;
            });

            AdventureService.buyItemMultiple('item.foo', 4, 3);

            expect(AdventureService.addItem).toHaveBeenCalled();
            expect(goodAddCount).toBe(3);
            expect(AdventureService.adventure.gold).toBe(6);
        });

        it('should not add the item when insufficient gold', function() {
            AdventureService.adventure.gold = 4;

            spyOn(AdventureService, 'addItem');

            AdventureService.buyItemMultiple('item.foo', 6, 3);

            expect(AdventureService.addItem).not.toHaveBeenCalled();
            expect(AdventureService.adventure.gold).toBe(4);
        });
    })

    describe('removeItem', function() {

        it('should decrease item count', function() {
            AdventureService.backpack = {
                'item.something': 1 ,
                'item.food': 2
            };
            var removed = AdventureService.removeItem('item.food');
            expect(_.size(AdventureService.backpack)).toBe(2);
            expect(AdventureService.backpack['item.something']).toBe(1);
            expect(AdventureService.backpack['item.food']).toBe(1);
            expect(removed).toBe(true);
        });

        it('should remove an item', function() {
            AdventureService.backpack = {
                'item.something': 1,
                'item.food': 2
            };
            var removed = AdventureService.removeItem('item.something');
            expect(_.size(AdventureService.backpack)).toBe(1);
            expect(AdventureService.backpack['item.food']).toBe(2);
            expect(removed).toBe(true);
        });

        it('should not remove an non-existing item', function() {
            AdventureService.backpack = {
                'item.something': 1,
                'item.food': 2
            };
            var removed = AdventureService.removeItem('item.bar');
            expect(_.size(AdventureService.backpack)).toBe(2);
            expect(removed).toBe(false);
        });

        it('should not remove anything from an empty backpack', function() {
            AdventureService.backpack = { };
            var removed = AdventureService.removeItem('item.bar');
            expect(_.size(AdventureService.backpack)).toBe(0);
            expect(removed).toBe(false);
        });
    });

    describe('removeAllCopiesOf', function() {
        it('should remove all copies of an item', function() {
            AdventureService.backpack = {
                'item.something': 1,
                'item.food': 2
            };
             AdventureService.removeAllCopiesOf('item.food');
            expect(_.size(AdventureService.backpack)).toBe(1);
        });
        it('should not remove anything if the item is not present', function() {
            AdventureService.backpack = {
                'item.something': 1,
                'item.food': 2
            };
            AdventureService.removeAllCopiesOf('item.bar');
            expect(_.size(AdventureService.backpack)).toBe(2);
        });
        it('should not remove anything from an empty backpack', function() {
            AdventureService.backpack = { };
            AdventureService.removeAllCopiesOf('item.bar');
            expect(_.size(AdventureService.backpack)).toBe(0);
        });
    });

    describe('emptyBackpack', function() {

        it('should remove all items from backpack', function() {
            AdventureService.backpack = {
                'item.something': 1,
                'item.food': 2
            };

            AdventureService.emptyBackpack();

            expect(AdventureService.backpack).toBeDefined();
            expect(AdventureService.backpack.length).toBeUndefined();
        });
    });

    describe('decreaseGold', function() {
        it('should decrease the amount of gold when sufficient amount and return true', function() {
            AdventureService.adventure.gold = 10;
            var removed = AdventureService.decreaseGold(2);
            expect(AdventureService.adventure.gold).toBe(8);
            expect(removed).toBe(true);
        });
        it('should not decrease the amount of gold when insufficient amount and return false', function() {
            AdventureService.adventure.gold = 1;
            var removed = AdventureService.decreaseGold(2);
            expect(AdventureService.adventure.gold).toBe(1);
            expect(removed).toBe(false);
        })
    });

    describe('pretestLuckValue', function() {
        it('should return a positive dice roll if lucky', function() {
            spyOn(DiceService, 'roll').andCallFake(function() {
                return 3;
            });
            AdventureService.vitals = { luck: 6 };

            var luck = AdventureService.pretestLuckValue();

            expect(DiceService.roll).toHaveBeenCalledWith(2);
            expect(luck).toBe(3);
        });
        it('should return a negative dice roll if unlucky', function() {
            spyOn(DiceService, 'roll').andCallFake(function() {
                return -10;
            });
            AdventureService.vitals = { luck: 6 };
            AdventureService.backpack = [];

            var luck = AdventureService.pretestLuckValue();

            expect(DiceService.roll).toHaveBeenCalledWith(2);
            expect(luck).toBe(-10);
        });
        it('should decrease roll by 1 if item.amulet.metal.twisted is present', function() {
            AdventureService.addItem('item.amulet.metal.twisted');
            AdventureService.vitals = { luck: 6 };
            spyOn(DiceService, 'roll').andCallFake(function() {
                return 7;
            });

            var luck = AdventureService.pretestLuckValue();

            expect(DiceService.roll).toHaveBeenCalledWith(2);
            expect(luck).toBe(6);
        });
        it('should not actually change the luck points', function() {
            spyOn(DiceService, 'roll').andCallFake(function() {
                return 7;
            });
            AdventureService.vitals = { luck: 6 };

            AdventureService.pretestLuckValue();

            expect(DiceService.roll).toHaveBeenCalledWith(2);
            expect(AdventureService.vitals.luck).toBe(6);
        });
    });

    describe('pretestLuck', function() {
        it('should return true and set flag if lucky', function() {
            AdventureService.vitals = { luck: 9 };
            spyOn(AdventureService, 'pretestLuckValue').andCallFake(function() {
                return 4;
            });

            var lucky = AdventureService.pretestLuck();

            expect(AdventureService.pretestLuckValue).toHaveBeenCalled();
            expect(lucky).toBe(true);
            expect(AdventureService.specialActions.lucky).toBe(true);
        });
        it('should return false and set flag if unlucky', function() {
            AdventureService.vitals = { luck: 9 };
            spyOn(AdventureService, 'pretestLuckValue').andCallFake(function() {
                return -10;
            });

            var lucky = AdventureService.pretestLuck();

            expect(AdventureService.pretestLuckValue).toHaveBeenCalled();
            expect(lucky).toBe(false);
            expect(AdventureService.specialActions.lucky).toBe(false);
        });
    });

    describe('enter165', function() {
        it('should prepare 3 lucks in a row', function() {
            AdventureService.vitals = {
                luck: 10, stamina: 18
            };

            var rolls = [ 5, -12, 7, 8, 2];
            var idx = -1;

            spyOn(AdventureService, 'pretestLuckValue').andCallFake(function() {
                idx += 1;
                return rolls[idx];
            });

            AdventureService.enter165();

            expect(AdventureService.pretestLuckValue).toHaveBeenCalled();
            expect(idx).toBe(4);

            var attempts = AdventureService.specialActions.ch165.attempts;
            expect(attempts).toBeDefined();
            expect(_.size(attempts)).toBe(5);

            expect(attempts[0]['lucky']).toBe(true);
            expect(attempts[0]['inARow']).toBe(1);
            expect(attempts[0]['dices']).toBe(5);
            expect(attempts[0]['stamina']).toBe(18);

            expect(attempts[1]['lucky']).toBe(false);
            expect(attempts[1]['inARow']).toBe(0);
            expect(attempts[1]['dices']).toBe(12);
            expect(attempts[1]['stamina']).toBe(15);

            expect(attempts[2]['lucky']).toBe(true);
            expect(attempts[2]['inARow']).toBe(1);
            expect(attempts[2]['dices']).toBe(7);
            expect(attempts[2]['stamina']).toBe(15);

            expect(attempts[3]['lucky']).toBe(true);
            expect(attempts[3]['inARow']).toBe(2);
            expect(attempts[3]['dices']).toBe(8);
            expect(attempts[3]['stamina']).toBe(15);

            expect(attempts[4]['lucky']).toBe(true);
            expect(attempts[4]['inARow']).toBe(3);
            expect(attempts[4]['dices']).toBe(2);
            expect(attempts[4]['stamina']).toBe(15);
        });

        it('should stop when running out of luck', function() {
            AdventureService.vitals = {
                luck: 3,                                // low on luck
                stamina: 18                             // still kicking
            };

            var spied = 0;
            spyOn(AdventureService, 'pretestLuckValue').andCallFake(function() {
                spied += 1;
                return -12;
            });

            AdventureService.enter165();

            expect(AdventureService.pretestLuckValue).toHaveBeenCalled();
            expect(spied).toBe(3);

            var attempts = AdventureService.specialActions.ch165.attempts;
            expect(attempts).toBeDefined();
            expect(_.size(attempts)).toBe(3);

            for (var i = 0; i < 3; i++) {
                expect(attempts[i]['lucky']).toBe(false);
                expect(attempts[i]['inARow']).toBe(0);
            }

            expect(attempts[0]['stamina']).toBe(15);
            expect(attempts[1]['stamina']).toBe(12);
            expect(attempts[2]['stamina']).toBe(9);
        });

        it('should stop when running out of stamina', function() {
            AdventureService.vitals = {
                luck: 12,                               // lucky
                stamina: 6                              // but weak
            };

            var spied = 0;
            spyOn(AdventureService, 'pretestLuckValue').andCallFake(function() {
                spied += 1;
                return -12;
            });

            AdventureService.enter165();

            expect(AdventureService.pretestLuckValue).toHaveBeenCalled();
            expect(spied).toBe(2);

            var attempts = AdventureService.specialActions.ch165.attempts;
            expect(attempts).toBeDefined();
            expect(_.size(attempts)).toBe(2);

            expect(attempts[0]['lucky']).toBe(false);
            expect(attempts[0]['inARow']).toBe(0);
            expect(attempts[0]['dices']).toBe(12);
            expect(attempts[0]['stamina']).toBe(3);

            expect(attempts[1]['lucky']).toBe(false);
            expect(attempts[1]['inARow']).toBe(0);
            expect(attempts[1]['dices']).toBe(12);
            expect(attempts[1]['stamina']).toBe(0);
        });

        it('should initialize index to -1', function() {
            AdventureService.vitals = { stamina: 14 };

            AdventureService.enter165();

            expect(AdventureService.specialActions.ch165.idx).toBe(-1);
        });

        it('should not modify the actual vitals', function() {
            AdventureService.vitals = {
                luck: 12,           // lucky
                stamina: 18         // and strong
            };
            var spied = 0;
            spyOn(AdventureService, 'pretestLuckValue').andCallFake(function() {
                spied += 1;
                return 2;
            });

            AdventureService.enter165();

            expect(AdventureService.pretestLuckValue).toHaveBeenCalled();
            expect(spied).toBe(3);

            expect(AdventureService.vitals.luck).toBe(12);
            expect(AdventureService.vitals.stamina).toBe(18);
        });
    });

    describe('enter168', function() {
        it('should remove all food but keep other items', function() {
            AdventureService.backpack = {
                'item.food': 2,
                'item.sword': 1
            };

            AdventureService.enter168();

            expect(_.size(AdventureService.backpack)).toBe(1);
            expect(AdventureService.backpack['item.sword']).toBe(1);
        });
        it('should empty backpack if it contains only food', function() {
            AdventureService.backpack = {
                'item.food': 2
            };

            AdventureService.enter168();

            expect(_.size(AdventureService.backpack)).toBe(0);
        });
        it('should not remove any items if there is no food', function() {
            AdventureService.backpack = {
                'item.sword': 1,
                'item.tooth': 5
            };

            AdventureService.enter168();

            expect(_.size(AdventureService.backpack)).toBe(2);
        });
    });

    describe('enter185', function() {
        it('should remove best weapon', function() {
            AdventureService.weapons = {
                'weapon.a': +1,
                'weapon.b': +3,
                'weapon.c': -1
            };

            spyOn(AdventureService, 'addStamina');
            spyOn(AdventureService, 'increaseLuck');

            AdventureService.enter185();

            expect(_.size(AdventureService.weapons)).toBe(2);
            expect(AdventureService.weapons['weapon.a']).toBe(1);
            expect(AdventureService.weapons['weapon.c']).toBe(-1);
        });

        it('should remove only one best weapon', function() {
            AdventureService.weapons = {
                'weapon.a': +3,
                'weapon.b': +3,
                'weapon.c': +3
            };

            spyOn(AdventureService, 'addStamina');
            spyOn(AdventureService, 'increaseLuck');

            AdventureService.enter185();

            expect(_.size(AdventureService.weapons)).toBe(2);
        });

        it('should not remove any weapon when there are none', function() {
            AdventureService.weapons = { };
            AdventureService.vitals = { luck: 10 };

            spyOn(AdventureService, 'addStamina');
            spyOn(AdventureService, 'increaseLuck');

            AdventureService.enter185();

            expect(_.size(AdventureService.weapons)).toBe(0);
        });

        it('should increase stamina and luck', function() {
            AdventureService.weapons = { };

            spyOn(AdventureService, 'addStamina');
            spyOn(AdventureService, 'increaseLuck');

            AdventureService.enter185();

            expect(AdventureService.addStamina).toHaveBeenCalledWith(1);
            expect(AdventureService.increaseLuck).toHaveBeenCalledWith(2);
        });
    });

    describe('enter190', function() {
        it('should replace generic teeth with giant and goblin teeth', function() {
            AdventureService.backpack = {
                'item.teeth': 1
            };

            AdventureService.enter190();

            expect(_.size(AdventureService.backpack)).toBe(2);
            expect(AdventureService.backpack['item.teeth']).toBeUndefined();
            expect(AdventureService.backpack['item.tooth.giant']).toBe(1);
            expect(AdventureService.backpack['item.tooth.goblin']).toBe(4);
        });

        it('should not add giant and goblin teeth when generic teeth are not present', function() {
            AdventureService.backpack = { };

            AdventureService.enter190();

            expect(_.size(AdventureService.backpack)).toBe(0);
        });
    });

    describe('enter204', function() {
        it('should decrease gold and restore initial vitals', function() {
            AdventureService.adventure.gold = 10;
            AdventureService.initial = {
                stamina: 18, skills: 10, luck: 12
            };
            AdventureService.vitals = {
                stamina: 12, skills: 9, luck: 8
            };

            AdventureService.enter204();

            expect(AdventureService.adventure.gold).toBe(10-3);
            expect(AdventureService.vitals.stamina).toBe(18);
            expect(AdventureService.vitals.skills).toBe(10);
            expect(AdventureService.vitals.luck).toBe(12);
        });
    });

    describe('enter218', function() {
        it('should remove stolen items and set flag', function() {
            AdventureService.backpack = {
                'item.a': 1,
                'item.b': 3,
                'item.c': 2
            };

            var pretests = [
                true,               // keep item.a
                false, true, true,  // keep 2x item.b
                false, false,       // loose all item.c,
                true                // keep gold
            ];
            var pretestIdx = -1;
            spyOn(AdventureService, 'pretestLuck').andCallFake(function() {
                pretestIdx += 1;
                return pretests[pretestIdx];
            });

            AdventureService.enter218();

            expect(AdventureService.pretestLuck).toHaveBeenCalled();
            expect(pretestIdx).toBe(pretests.length - 1);   // 6 items + 1 gold -1 idx-based
            expect(AdventureService.backpack['item.a']).toBe(1);
            expect(AdventureService.backpack['item.b']).toBe(2);
            expect(AdventureService.backpack['item.c']).toBeUndefined();

        });
        it('should not remove items nor gold nor set flag if nothing was stolen', function() {
            AdventureService.backpack = {
                'item.a': 1,
                'item.b': 3,
                'item.c': 2
            };

            spyOn(AdventureService, 'pretestLuck').andCallFake(function() {
                return true;    // always lucky
            });

            AdventureService.enter218();

            expect(AdventureService.pretestLuck).toHaveBeenCalled();
            expect(AdventureService.backpack['item.a']).toBe(1);
            expect(AdventureService.backpack['item.b']).toBe(3);
            expect(AdventureService.backpack['item.c']).toBe(2);
            expect(AdventureService.specialActions.ch218.items.length).toBe(0);
            expect(AdventureService.specialActions.ch218.gold).toBe(false);
            expect(AdventureService.specialActions.ch218.robbed).toBe(false);
        });
        it('should remove stolen gold and set flag', function() {
            AdventureService.backpack = { };
            AdventureService.adventure.gold = 10;

            spyOn(AdventureService, 'pretestLuck').andCallFake(function() {
                return false;
            });

            AdventureService.enter218();

            expect(AdventureService.pretestLuck).toHaveBeenCalled();
            expect(AdventureService.adventure.gold).toBe(0);
            expect(AdventureService.specialActions.ch218.gold).toBe(true);
        });
        it('should set the robbed flag', function() {
            AdventureService.backpack = { };
            AdventureService.adventure.gold = 10;

            spyOn(AdventureService, 'pretestLuck').andCallFake(function() {
                return false;
            });

            AdventureService.enter218();

            expect(AdventureService.pretestLuck).toHaveBeenCalled();
            expect(AdventureService.specialActions.ch218.gold).toBe(true);
        });
    });

    describe('enter228', function() {
        it('should open the door and lose 1pt skills if lucky', function() {
            AdventureService.vitals = { skills: 13 };
            spyOn(DiceService, 'roll').andCallFake(function() {
                return 4;
            });

            AdventureService.enter228();

            expect(DiceService.roll).toHaveBeenCalledWith(1);

            var ch228 = AdventureService.specialActions.ch228;
            expect(ch228).toBeDefined();
            expect(_.size(ch228.dices)).toBe(3);
            expect(ch228.dices[0]).toBe(4);
            expect(ch228.dices[1]).toBe(4);
            expect(ch228.dices[2]).toBe(4);
            expect(ch228.total).toBe(12);
            expect(ch228.success).toBe(true);
            expect(AdventureService.vitals.skills).toBe(12);
        });
        it('should leave the door closed if unlucky', function() {
            AdventureService.vitals = { skills: 12 };
            spyOn(DiceService, 'roll').andCallFake(function() {
                return 4;
            });

            AdventureService.enter228();

            expect(DiceService.roll).toHaveBeenCalledWith(1);

            var ch228 = AdventureService.specialActions.ch228;
            expect(ch228).toBeDefined();
            expect(_.size(ch228.dices)).toBe(3);
            expect(ch228.dices[0]).toBe(4);
            expect(ch228.dices[1]).toBe(4);
            expect(ch228.dices[2]).toBe(4);
            expect(ch228.total).toBe(12);
            expect(ch228.success).toBe(false);
            expect(AdventureService.vitals.skills).toBe(12);
        });
    });

    describe('enter258', function() {
        it('should generate a finite sequence when unlucky', function() {
            AdventureService.vitals = { stamina: 11 };
            spyOn(AdventureService, 'pretestLuck').andCallFake(function() {
                return false;
            });

            AdventureService.enter258();

            expect(AdventureService.pretestLuck).toHaveBeenCalled();

            var ch258 = AdventureService.specialActions.ch258;
            expect(_.size(ch258.attempts)).toBe(4);
            expect(ch258.length).toBe(4);
            expect(ch258.attempts[0].lucky).toBe(false);
            expect(ch258.attempts[0].stamina).toBe(5);
            expect(ch258.attempts[1].lucky).toBe(false);
            expect(ch258.attempts[1].stamina).toBe(2);
            expect(ch258.attempts[2].lucky).toBe(false);
            expect(ch258.attempts[2].stamina).toBe(1);
            expect(ch258.attempts[3].lucky).toBe(false);
            expect(ch258.attempts[3].stamina).toBe(0);
        });
        it('should generate a lucky sequence', function() {
            AdventureService.vitals = { stamina: 11 };

            var lucks = [false, false, true];
            var lucksInd = 0;
            spyOn(AdventureService, 'pretestLuck').andCallFake(function() {
                return lucks[lucksInd++];
            });

            AdventureService.enter258();

            expect(AdventureService.pretestLuck).toHaveBeenCalled();

            var ch258 = AdventureService.specialActions.ch258;
            expect(_.size(ch258.attempts)).toBe(3);
            expect(ch258.length).toBe(3);
            expect(ch258.attempts[0].lucky).toBe(false);
            expect(ch258.attempts[0].stamina).toBe(5);
            expect(ch258.attempts[1].lucky).toBe(false);
            expect(ch258.attempts[1].stamina).toBe(2);
            expect(ch258.attempts[2].lucky).toBe(true);
            expect(ch258.attempts[2].stamina).toBe(2);
        });
        it('should set the index', function() {
            AdventureService.vitals = { stamina: 14 };
            AdventureService.enter258();
            expect(AdventureService.specialActions.ch258.idx).toBe(-1);
        });
    });

    describe('enter270', function() {
        it('should prepare for bee sting', function() {
            spyOn(DiceService, 'roll').andCallFake(function() { return 4; });

            AdventureService.enter270();

            expect(DiceService.roll).toHaveBeenCalledWith(1);
            var ch270 = AdventureService.specialActions.ch270;
            expect(ch270.dice).toBe(4);
            expect(ch270.lost).toBe(4);
        });
        it('should prepare without bee sting', function() {
            spyOn(DiceService, 'roll').andCallFake(function() { return 5; });

            AdventureService.enter270();

            expect(DiceService.roll).toHaveBeenCalledWith(1);
            var ch270 = AdventureService.specialActions.ch270;
            expect(ch270.dice).toBe(5);
            expect(ch270.lost).toBe(0);
        });
    });

    afterEach(function(done) {
    });
});