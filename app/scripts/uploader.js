'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
    'dropzone'

], function ($, _, Backbone, Dropzone) {

    var initialize = function () {

        $('#dropzoneForm').dropzone(
            {
                init: function () {
                    console.log('Dropzone Initiated');
                },
                paramName: 'displayImage', // The name that will be used to transfer the file
                maxFilesize: 5, // MB
                accept: function (file, done) {
                    done();
                },
                'sending': function (file, xhr, formData) {

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                events.trigger('uploaded', $.parseJSON(xhr.responseText));
                            } else {
                                events.trigger('uploaded', $.parseJSON('{"error":' + xhr.statusText + '}'));
                            }
                        }
                    };

                }

            }
        );



    };
    return {
        initialize: initialize
    };
});