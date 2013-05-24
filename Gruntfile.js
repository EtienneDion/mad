'use strict';

var path = require('path');
var grunt = require('grunt');

module.exports = function(grunt) {

    var yeomanConfig = {
        app: 'app',
        dist: 'public'
    };

    // Project configuration.
    grunt.initConfig({
        yeoman: yeomanConfig,
        express: {
            livereload: {
                options: {
                    port: 9000,
                    bases: path.resolve('<%= yeoman.dist %>'),
                    monitor: {},
                    debug: true,
                    server: path.resolve('./<%= yeoman.app %>/server')
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            //            gruntfile: {
            //                src: 'Gruntfile.js'
            //            },
            script: {
                src: ['<%= yeoman.app %>/scripts/*.js']
            }
        },
        regarde: {
            pub: {
                files: '<%= yeoman.dist %>/**/*',
                tasks: ['livereload']
            },
            trigger: {
                files: '.server',
                tasks: 'express:livereload'
            },
            express: {
                files: ['<%= yeoman.app %>/templates/index.dust',
                        '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                        '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                        '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
                ],
                tasks: 'livereload'
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass']
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= express.livereload.options.port %>'
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '<%= yeoman.dist %>/styles',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/scripts/vendor',
                relativeAssets: true
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        jsbeautifier: {
            files: ['Gruntfile.js'],
            options: {
                'indent_size': 4,
                'indent_char': ' ',
                'indent_level': 0,
                'indent_with_tabs': false,
                'preserve_newlines': true,
                'max_preserve_newlines': 10,
                'jslint_happy': false,
                'brace_style': 'collapse',
                'keep_array_indentation': false,
                'keep_function_indentation': false,
                'space_before_conditional': true,
                'eval_code': false,
                'indent_case': false,
                'unescape_strings': false
            }
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    // `name` and `out` is set by grunt-usemin
                    baseUrl: '<%= yeoman.app %>/scripts',
                    optimize: 'none',
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/templates/index.dust',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.dust'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                            '.tmp/styles/{,*/}*.css',
                            '<%= yeoman.dist %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        copy: {
            dist: {
                files: [{
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                                '*.{ico,txt}',
                                '.htaccess',
                                'images/{,*/}*.{webp,gif,png,jpg,jpeg.ico,bmp}',
                                'font/{,*/}*.*',
                                'scripts/vendor/{,*/}*'
                        ]
                    }
                ]
            }
        },
        bower: {
            all: {
                rjsConfig: '<%= yeoman.app %>/scripts/main.js'
            }
        },
        jst: {
            options: {
                amd: true
            },
            compile: {
                files: {
                    '.tmp/scripts/templates.js': ['<%= yeoman.app %>/scripts/templates/*.ejs']
                }
            }
        }

    });

    // These plugins provide necessary tasks.
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('format', ['jshint', 'jsbeautifier']);
    grunt.registerTask('server', ['express', 'useminPrepare', 'requirejs', 'compass', 'copy', 'usemin', 'open', 'livereload-start', 'regarde']);
    // Default task.
    grunt.registerTask('default', ['format', 'server']);

    //    grunt.registerTask('deploy', ['format', 'server']);    + cssmin


};
