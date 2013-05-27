'use strict';

define([
    'jquery',
    'underscore',
    'backbone',

], function ($, _, Backbone) {

    var defineDrawer = function (canvas, context, options) {
        // create a drawer which tracks touch movements
        return {
            isDrawing: false,
            touchstart: function (coors) {
                context.beginPath();
                context.moveTo(coors.x, coors.y);
                context.lineWidth = options.lineWidth;
                context.strokeStyle = options.strokeStyle;
                context.lineCap = options.lineCap;
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
    };

    var drawEventManager = function (canvas, context, drawer, evt) {
        var draw = function draw(event) {
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
        // create a function to pass touch events and coordinates to drawer
        draw(evt);
    };

    var bindCanvas = function (canvas, context, drawer) {
        // detect touch capabilities
        var touchAvailable = ('createTouch' in document) || ('ontouchstart' in window);

        var drawHandler = function (event) {
            drawEventManager(canvas, context, drawer, event);
        };
        // attach the touchstart, touchmove, touchend event listeners.
        if (touchAvailable) {
            canvas.addEventListener('touchstart', drawHandler, false);
            canvas.addEventListener('touchmove', drawHandler, false);
            canvas.addEventListener('touchend', drawHandler, false);
        }
        // attach the mousedown, mousemove, mouseup event listeners.
        else {
            canvas.addEventListener('mousedown', drawHandler, false);
            canvas.addEventListener('mousemove', drawHandler, false);
            canvas.addEventListener('mouseup', drawHandler, false);
        }

        // prevent elastic scrolling
        document.body.addEventListener('touchmove', function (event) {
            event.preventDefault();
        }, false); // end body.onTouchMove

    };

    var bindButtons = function (canvas, context) {
        $('button.clear').click(function () {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
        });
        $('button.crop').click(function () {
            var savedData = new Image();
            savedData.src = canvas.toDataURL('image/png');
            var imagepath = $('#sketchpad').data('image');
            events.trigger('cropped', imagepath, savedData);
        });
    };

    var initialize = function () {

        var elem = $('#sketchpad');
        var canvas = elem.get(0);
        var context = canvas.getContext('2d');

        var canvasOptions = {
            lineWidth: 15,
            strokeStyle: '#ff0000',
            lineCap: 'round'
        };
        var drawer = defineDrawer(canvas, context, canvasOptions);
        bindCanvas(canvas, context, drawer);
        bindButtons(canvas, context);
    };
    return {
        initialize: initialize
    };
});
