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


    if ($('#sketchpad').length > 0) {


        // get the canvas element and its context
        var canvas = document.getElementById('sketchpad');
        var context = canvas.getContext('2d');

        // create a drawer which tracks touch movements
        var drawer = {
            isDrawing: false,
            touchstart: function (coors) {
                context.beginPath();
                context.moveTo(coors.x, coors.y);
                context.lineWidth = 15;
                context.strokeStyle = '#ff0000';
                context.lineCap = 'round';
                this.isDrawing = true;
            },
            touchmove: function (coors) {
                if (this.isDrawing) {
                    context.lineTo(coors.x, coors.y);
                    context.stroke();
                }
            },
            touchend: function (coors) {
                if (this.isDrawing) {
                    this.touchmove(coors);
                    this.isDrawing = false;
                }
            }
        };


        // create a function to pass touch events and coordinates to drawer
        var draw = function (event) {
            var type = null;
            // map mouse events to touch events
            switch (event.type) {
            case 'mousedown':
                event.touches = [];
                event.touches[0] = {
                    pageX: event.pageX,
                    pageY: event.pageY
                };
                type = 'touchstart';
                break;
            case 'mousemove':
                event.touches = [];
                event.touches[0] = {
                    pageX: event.pageX,
                    pageY: event.pageY
                };
                type = 'touchmove';
                break;
            case 'mouseup':
                event.touches = [];
                event.touches[0] = {
                    pageX: event.pageX,
                    pageY: event.pageY
                };
                type = 'touchend';
                break;
            }

            // touchend clear the touches[0], so we need to use changedTouches[0]
            var coors;
            if (event.type === 'touchend') {
                coors = {
                    x: event.changedTouches[0].pageX,
                    y: event.changedTouches[0].pageY
                };
            }
            else {
                // get the touch coordinates
                coors = {
                    x: event.touches[0].pageX,
                    y: event.touches[0].pageY
                };
            }
            type = type || event.type;
            // pass the coordinates to the appropriate handler
            drawer[type](coors);
        };

        // detect touch capabilities
        var touchAvailable = ('createTouch' in document) || ('ontouchstart' in window);

        // attach the touchstart, touchmove, touchend event listeners.
        if (touchAvailable) {
            canvas.addEventListener('touchstart', draw, false);
            canvas.addEventListener('touchmove', draw, false);
            canvas.addEventListener('touchend', draw, false);
        }
        // attach the mousedown, mousemove, mouseup event listeners.
        else {
            canvas.addEventListener('mousedown', draw, false);
            canvas.addEventListener('mousemove', draw, false);
            canvas.addEventListener('mouseup', draw, false);
        }

        // prevent elastic scrolling
        document.body.addEventListener('touchmove', function (event) {
            event.preventDefault();
        }, false); // end body.onTouchMove

    }


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









