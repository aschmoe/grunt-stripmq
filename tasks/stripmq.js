'use strict';

var fs = require("fs"),
  _ = require('underscore'),
  stripmq = require('./lib/stripmq');

module.exports = function(grunt) {
  grunt.registerMultiTask("stripmq", "Strip media queries from stylesheets", function () {
    var options = this.options({});

    // this over all src-dest file pairs.
    this.files.forEach(function(f) {

      var src = f.src.filter(function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        var result,
          input = grunt.file.read(filepath, {encoding:'utf-8'});

        // Minify files, warn and fail on error.
        try {
          result = stripmq(input, options);
        } catch (e) {
          var err = new Error('Stripping media queries failed.');
          if (e.msg) {
            err.message += ', ' + e.msg + '.';
          }
          err.origError = e;
          grunt.fail.warn(err);
        }

        return result;
      });

      // Have something to write
      if(!_.isEmpty(_.compact(src))) {
        // Write the destination file.
        grunt.file.write(f.dest, src.join(''));

        // Print a success message.
        grunt.log.writeln('File "' + f.dest + '" created.');
      }
    });
  });
};
