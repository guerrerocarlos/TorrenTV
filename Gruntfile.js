
var parseBuildPlatforms = function(argumentPlatform) {
	// this will make it build no platform when the platform option is specified
	// without a value which makes argumentPlatform into a boolean
	var inputPlatforms = argumentPlatform || process.platform + ";" + process.arch;

	// Do some scrubbing to make it easier to match in the regexes bellow
	inputPlatforms = inputPlatforms.replace("darwin", "mac");
	inputPlatforms = inputPlatforms.replace(/;ia|;x|;arm/, "");

	var buildAll = /^all$/.test(inputPlatforms);

	var buildPlatforms = {
		mac: /mac/.test(inputPlatforms) || buildAll,
		win: /win/.test(inputPlatforms) || buildAll,
		linux32: /linux32/.test(inputPlatforms) || buildAll,
		linux64: /linux64/.test(inputPlatforms) || buildAll
	};

	return buildPlatforms;
};

module.exports = function(grunt) {
	"use strict";

	var buildPlatforms = parseBuildPlatforms(grunt.option('platforms'));
	var currentVersion = grunt.file.readJSON('package.json').version;

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('build', [
		'nodewebkit'
	]);

	grunt.registerTask('dist', [
		'clean:releases',
		'build',
		'exec:createDmg', // mac
		'exec:createWinInstall',
		'compress' // win & linux
	]);

	grunt.registerTask('start', function(){
		var start = parseBuildPlatforms();
		if(start.win){
			grunt.task.run('exec:win');
		}else if(start.mac){
			grunt.task.run('exec:mac');
		}else if(start.linux32){
			grunt.task.run('exec:linux32');
		}else if(start.linux64){
			grunt.task.run('exec:linux64');
		}else{
			grunt.log.writeln('OS not supported.');
		}
	});

  grunt.initConfig({
		nodewebkit: {
			options: {
				version: '0.9.2',
				build_dir: './build', // Where the build version of my node-webkit app is saved
				keep_nw: true,
				embed_nw: false,
				mac_icns: './src/app/images/nw.icns', // Path to the Mac icon file
				zip: false, // Zip nw for mac in windows. Prevent path too long if build all is used.
				mac: buildPlatforms.mac,
				win: buildPlatforms.win,
				linux32: buildPlatforms.linux32,
				linux64: buildPlatforms.linux64,
				download_url: 'http://dl.nwjs.io/'
			},
			src: ['./src/**', '!./src/app/styl/**',
				'./node_modules/**', '!./node_modules/bower/**', '!./node_modules/*grunt*/**', '!./node_modules/stylus/**',
				'!./**/test*/**', '!./**/doc*/**', '!./**/example*/**', '!./**/demo*/**', '!./**/bin/**', '!./**/build/**', '!./**/.*/**',
				'./package.json', './README.md', './LICENSE.txt' ]
		},

		exec: {
			win: {
				cmd: '"build/cache/win/<%= nodewebkit.options.version %>/nw.exe" .'
			},
			mac: {
				cmd: 'build/cache/mac/<%= nodewebkit.options.version %>/node-webkit.app/Contents/MacOS/node-webkit .'
			},
			linux32: {
				cmd: '"build/cache/linux32/<%= nodewebkit.options.version %>/nw" .'
			},
			linux64: {
				cmd: '"build/cache/linux64/<%= nodewebkit.options.version %>/nw" .'
			},
			createDmg: {
				cmd: 'dist/mac/yoursway-create-dmg/create-dmg --volname "TorrenTV ' + currentVersion + '" --background ./dist/mac/background.png --window-size 480 540 --icon-size 128 --app-drop-link 240 370 --icon "TorrenTV" 240 110 ./build/releases/TorrenTV/mac/TorrenTV-' + currentVersion + '-Mac.dmg ./build/releases/TorrenTV/mac/'
			},
			createWinInstall: {
				cmd: 'makensis dist/windows/installer.nsi'
			}
		},

		jshint: {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: 'Gruntfile.js'
			},
			src: {
				options: {
					jshintrc: 'src/app/.jshintrc'
				},
				src: ['src/app/*.js']
			}
		},

		compress: {
			linux32: {
				options: {
					mode: 'tgz',
					archive: 'build/releases/TorrenTV/linux32/TorrenTV-' + currentVersion + '-Linux-32.tar.gz'
				},
				expand: true,
				cwd: 'build/releases/TorrenTV/linux32/TorrenTV',
				src: '**',
				dest: 'TorrenTV'
			},
			linux64: {
				options: {
					mode: 'tgz',
					archive: 'build/releases/TorrenTV/linux64/TorrenTV-' + currentVersion + '-Linux-64.tar.gz'
				},
				expand: true,
				cwd: 'build/releases/TorrenTV/linux64/TorrenTV',
				src: '**',
				dest: 'TorrenTV'
			},
			windows: {
				options: {
					mode: 'zip',
					archive: 'build/releases/TorrenTV/win/TorrenTV-' + currentVersion + '-Win.zip'
				},
				expand: true,
				cwd: 'dist/windows',
				src: 'TorrenTVSetup.exe',
				dest: ''
			}
		},

		clean: {
			releases: ['build/releases/TorrenTV/**']
		},

		watch: {
			options: {
				dateFormat: function(time) {
					grunt.log.writeln('Completed in ' + time + 'ms at ' + (new Date()).toLocaleTimeString());
					grunt.log.writeln('Waiting for more changes...');
				}
			},
			scripts: {
				files: ['./src/app/styl/*.styl','./src/app/styl/**/*.styl'],
				tasks: ['css']
			}
		}

	});

};
