'use strict';

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Configuration to be run (and then tested).
    stripmq: {
      options: {
        stripBase: true,
        minWidth: 600,
        maxWidth: 800
      },
      all: {
        /*files: [
            {src: ['test/input/*.css'], dest: 'test/output/single.css'}
        ]*/
        files: [
          {
            expand: true,
            cwd: 'test/input',
            src: ['*.css'],
            dest: 'test/output/',
            ext: '-ie.css',
          },
        ]
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'stripmq']);
};
