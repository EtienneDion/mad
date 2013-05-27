'use strict';
var events = {};

define([
    'jquery',
    'underscore',
    'backbone',
    'dropzone',
    'uploader', // Request uploader.js
    'drawer', // Request drawer.js
    'cropper' // Request cropper.js
], function ($, _, Backbone, Dropzone, Uploader, Drawer, Cropper) {
    var initialize = function () {
        // Pass in our Router module and call it's initialize function



        Backbone.history.start();

        /*  Backbone Events */


        _.extend(events, Backbone.Events);

        events.on('uploaded', function (image) {
            console.log('Triggered Uploaded : ' + image.path);

            $('#sketchpad').css('background-image', 'url(' + image.path + ')');
            $('#sketchpad').data('image', image.path);
            $('#cropper').css('left', '0');

        });

        events.on('cropped', function (imagepath, zone) {
            console.log('Triggered Cropped : ', imagepath, zone);

            $('#sketchpad').css('background-image', 'none');
            $('#sketchpad').data('image', '');
            $('#cropper').css('left', '-10000');
            Cropper.send(imagepath, zone.src);
        });


       // events.trigger('alert', 'an event');


        Uploader.initialize();
        Drawer.initialize();


    };

    return {
        initialize: initialize
    };
});