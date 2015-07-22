module.exports = function (grunt) {

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		bower: {
			install: {
				options: {
					targetDir: 'libraries',
					layout: 'byComponent'
				}
			}
		},
		
		qunit: {
			all: {
				options: {
					urls: [
						'http://localhost:9000/test/index.html'
					]
				}
			}
		},

		// for changes to the front-end code
		watch: {
			scripts: {
				files: ['birdwatcher.js', 'test/*.js'],
				tasks: ['test']
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
		connect: {
			server: {
				options: {
					port: 9000,
					base: '.'
				}
			}
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

	grunt.registerTask('test', ['bower:install','jshint', 'connect', 'qunit']);
	grunt.registerTask('tdd', ['watch']);
	grunt.registerTask('build', ['uglify:release']);
};
