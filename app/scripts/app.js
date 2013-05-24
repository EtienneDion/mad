'use strict';
var events = {};

define([
    'jquery',
    'underscore',
    'backbone',
    'dropzone',
    'uploader', // Request uploader.js
    'drawer' // Request drawer.js

], function ($, _, Backbone, Dropzone, Uploader, Drawer) {
    var initialize = function () {
        // Pass in our Router module and call it's initialize function



        Backbone.history.start();

        /*  Backbone Events */


        _.extend(events, Backbone.Events);

        events.on('uploaded', function (path) {
            console.log('Triggered Uploaded : ' + path);
        });

       // events.trigger('alert', 'an event');


        Uploader.initialize();

        Drawer.initialize();

    };

    return {
        initialize: initialize
    };
});