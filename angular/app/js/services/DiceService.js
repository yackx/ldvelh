'use strict';

angular.module('myApp.services.DiceService', [], ['$provide', function ($provide) {

$provide.factory('DiceService',
    ['$rootScope', '$log', function ($rootScope, $log) {

        var self = {

            details: { total: undefined, howMany: undefined, dices: []},

            roll: function(dices) {
                return self.rollDetails(dices).total;
            },

            /**
             * Roll dices and return them with total.
             * For convenience, this function will also store the result in 'details'.
             * @param dices Number of dices
             * @returns {{total: number, rolls: Array, howMany: number}}
             */
            rollDetails: function(dices) {
                if (dices < 1 || dices != parseInt(dices)) throw('invalid');

                var details = {
                    total: 0,
                    rolls: [],
                    howMany: dices
                };

                for (var i = 0; i < dices; i++) {
                    var roll = self._roll1();
                    details.rolls.push(roll);
                    details.total += roll;
                };

                $log.log('Rolling ' + dices + ' die/dices', details);
                self.details = details;
                return details;
            },

            _roll1: function() {
                return Math.round(Math.random() * 6) % 6 + 1;
            }

        };

        return self;
    }]
);

}]);