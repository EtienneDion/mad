/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        dropzone: {
            deps: ['jquery'],
            exports: 'Dropzone'
        }
    },
    paths: {
        jquery: 'vendor/jquery/jquery',
        backbone: 'vendor/backbone-amd/backbone',
        underscore: 'vendor/underscore-amd/underscore',
        bootstrap: 'vendor/bootstrap.js',
        dropzone: 'vendor/dropzone/downloads/dropzone-amd-module'
    }
});

require([
    // Load our app module and pass it to our definition function
    'app',
], function (App) {
    // The "app" dependency is passed in as "App"
    App.initialize();

});











