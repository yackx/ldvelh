describe('FightService', function() {

    var AdventureService, FightService, DiceService;

    beforeEach(module('myApp.services'));

    beforeEach(function() {
        inject(function($injector) {
            AdventureService = $injector.get('AdventureService');
            FightService = $injector.get('FightService');
            DiceService = $injector.get('DiceService');
        });
    });

    describe('bestWeaponExtraSkills', function() {

        it('should return the best weapon extra skill points', function() {
            AdventureService.weapons = {
                'weapon.standard.sword': +1,
                'weapon.bfg': +3,
                'weapon.axe': -1,
                'weapon.so.weak': -6
            };

            expect(FightService.bestWeaponExtraSkills()).toBe(3);
        });

        it('should return -4 skills if no weapon is available', function() {
            AdventureService.weapons = { };
            expect(FightService.bestWeaponExtraSkills()).toBe(-4);
        });
    });

    describe('skillsEnemy317', function() {
        it('should return 4 during the first 4 assaults', function() {
            spyOn(DiceService, 'roll');
            for (var i = 1; i <= 4; i++) {
                FightService.fight = {
                    assault: i
                };

                var skills = FightService.skillsEnemy317();

                expect(DiceService.roll).not.toHaveBeenCalled();
                expect(skills).toBe(4);
            }
        });
        it('should return 8 if the troll picked up his weapon (after assault #4)', function() {
            FightService.fight = {
                assault: 5
            };
            AdventureService.specialActions.ch317 = true;

            spyOn(DiceService, 'roll');

            var skills = FightService.skillsEnemy317();

            expect(DiceService.roll).not.toHaveBeenCalled();
            expect(skills).toBe(8);
        });
        it('should return 4 if the troll did not pick up his weapon (after 4 assaults)', function() {
            FightService.fight = {
                assault: 5
            };

            spyOn(DiceService, 'roll').andCallFake(function() { return 1 });

            var skills = FightService.skillsEnemy317();

            expect(DiceService.roll).toHaveBeenCalledWith(1);
            expect(skills).toBe(4);
            expect(AdventureService.specialActions.ch317).toBeFalsy();
        });
        it('should return 8 if the troll picks up his weapon (after 4 assaults)', function() {
            FightService.fight = {
                assault: 5
            };

            spyOn(DiceService, 'roll').andCallFake(function() { return 2 });

            var skills = FightService.skillsEnemy317();

            expect(DiceService.roll).toHaveBeenCalledWith(1);
            expect(skills).toBe(8);
            expect(AdventureService.specialActions.ch317).toBe(true);
        });
    });

    afterEach(function(done) {
    });
});