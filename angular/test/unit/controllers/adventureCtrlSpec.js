describe('adventureCtrl', function() {

    var AdventureService, StorageService;
    var rootScope, scope, ctrl;

    beforeEach(module('myApp.controllers'));
    beforeEach(module('myApp.services'));

    beforeEach(function() {
        inject(function($injector) {
            AdventureService = $injector.get('AdventureService');
            StorageService = $injector.get('StorageService');
        });
    });

    beforeEach(inject(function ($rootScope, $controller) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        ctrl = $controller('adventureCtrl', { $scope: scope, $routeParams: {}  });
    }));

    describe('_collectableItems', function() {

        it('should filter items', function() {
            var collectable = scope._collectableItems();
            expect(collectable).toBeDefined();
            expect(collectable['item.pebbles']).toBe('Cailloux');
            expect(collectable['enemy.bandit.1']).toBeUndefined();
        });
    });

    afterEach(function(done) {
    });
});