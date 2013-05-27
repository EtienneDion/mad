'use strict';

define([
    'jquery',
    'underscore',
    'backbone'

], function ($, _, Backbone, Dropzone) {

    var send = function (imagepath, zonesrc) {
        $.get('/crop/', { image: imagepath, zone: zonesrc })
        .done(function (data) {
            console.log('Data Loaded: ' + data);
        });

    };
    return {
        send: send
    };
});