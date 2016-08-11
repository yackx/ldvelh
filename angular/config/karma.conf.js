module.exports = function(config){
    config.set({
    basePath : '../',

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    files : [
      'app/lib/angular/angular.js',
      'app/lib/angular-translate/angular-translate.js',
      'app/lib/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/lib/angular-ui-utils/modules/route.js',
      'app/lib/underscore/underscore-1.4.3.js',
      'app/js/**/*.js',

      'test/lib/angular/angular-mocks.js',
      'test/unit/**/*Spec.js'
    ],

    exclude: [
      '/js/app.js'
    ],

    autoWatch : false,
    singleRun: true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
            //'karma-chrome-launcher',
            //'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-jasmine'
    ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}
