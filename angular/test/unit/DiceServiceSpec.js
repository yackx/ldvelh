describe('DiceService', function() {

    var DiceService;

    beforeEach(module('myApp.services'));

    beforeEach(function() {
        inject(function($injector) {
            DiceService = $injector.get('DiceService');
        });
    });

    describe('rollDetails', function() {

        it('should roll dices and return details', function() {
            var rolls = [1, 4, 6];
            var currentRoll = -1;
            spyOn(DiceService, '_roll1').andCallFake(function() {
                currentRoll += 1;
                return rolls[currentRoll];
            });

            var details = DiceService.rollDetails(3);

            expect(DiceService._roll1).toHaveBeenCalled();
            expect(currentRoll).toBe(_.size(rolls) - 1);
            expect(details).toBeDefined();
            expect(details.total).toBe(11);
            expect(_.size(details.rolls)).toBe(_.size(rolls));
            expect(details.rolls[0]).toBe(1);
            expect(details.rolls[1]).toBe(4);
            expect(details.rolls[2]).toBe(6);
            expect(details.howMany).toBe(3);
        });

        it('should generate an exception on invalid input', function() {
            expect(function() {DiceService.rollDetails(0)}).toThrow('invalid');
            expect(function() {DiceService.rollDetails(1.2)}).toThrow('invalid');
        });

        it('should store the details', function() {
            spyOn(DiceService, '_roll1').andCallFake(function() {
                return 4;
            });

            DiceService.rollDetails(2);

            expect(DiceService._roll1).toHaveBeenCalled();

            var details = DiceService.details;
            expect(details).toBeDefined();
            expect(details.total).toBe(8);
            expect(_.size(details.rolls)).toBe(2);
            expect(details.rolls[0]).toBe(4);
            expect(details.rolls[1]).toBe(4);
            expect(details.howMany).toBe(2);

        });

    });

    describe('roll', function() {
        it('should roll dices and return total', function() {
            spyOn(DiceService, 'rollDetails').andCallFake(function() {
                return { total: 11, dices: [5, 6] };
            });

            DiceService.roll(2);

            expect(DiceService.rollDetails).toHaveBeenCalledWith(2);
            expect(DiceService.roll(2)).toBe(11);
        });
    });

    describe('_roll1', function() {
        it('should generate valid random dice', function() {
            for (var i = 0; i < 100; i++) {
                var roll = DiceService._roll1();
                expect(roll).toBeGreaterThan(0);
                expect(roll).toBeLessThan(7);
                expect(roll).toBe(roll | 0);
            }
        });
    });

    afterEach(function(done) {
    });
});