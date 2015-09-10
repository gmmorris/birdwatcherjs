module.exports = function (grunt) {

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// for changes to the front-end code
		watch: {
			scripts: {
				files: ['birdwatcher.js', 'test/*.spec.js'],
				tasks: ['jshint','mocha']
			}
		},

		jshint: {
			files: ['birdwatcher.js'],
			options: {
				globals: {
					jQuery: true,
					console: false,
					module: true,
					document: true
				}
			}
		},

		mocha: {
		  test: {
		    src: ['test/*.spec.js'],
		  },
		},

		uglify: {
			release: {
				options: {
					mangle: true,
					beautify : {
						ascii_only : true,
						quote_keys: true
					}
				},
				files: {
					'./release/birdwatcher.min.js': ['birdwatcher.js']
				}
			}
		}
	});

	grunt.registerTask('tdd', ['watch']);
	grunt.registerTask('build', ['uglify:release']);
};
