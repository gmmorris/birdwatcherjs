module.exports = function(grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      release: {
        options: {
          mangle: true,
          beautify: {
            ascii_only: true,
            quote_keys: true
          }
        },
        files: {
          './release/birdwatcher.min.js': ['birdwatcher.js']
        }
      }
    }
  });

  grunt.registerTask('build', ['uglify:release']);
};
