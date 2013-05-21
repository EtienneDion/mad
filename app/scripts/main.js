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
    'backbone'
], function (Backbone) {
    Backbone.history.start();


    /*  Backbone Events */
    var events = {};

    _.extend(events, Backbone.Events);

    events.on('alert', function (msg) {
        console.log('Triggered ' + msg);
    });

    events.trigger('alert', 'an event');


});


require([
    'dropzone'
], function (Dropzone) {

    console.log('try to init dropzone', Dropzone);
    Dropzone.options.myAwesomeDropzone = {
        init: function () {
            console.log('Dropzone Initiated');
        },
        paramName: 'displayImage', // The name that will be used to transfer the file
        maxFilesize: 2, // MB
        accept: function (file, done) {
            console.log(file, done);
            if (file.name === 'justinbieber.jpg') {
                done('Naha, you dont.');
            }
            else { done(); }
        }
    };

    $('#myAwesomeDropzone').dropzone();


});









