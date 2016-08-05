'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

gulp.task('swagger', function() {
    gulp.src('./api/swagger/swagger.yaml')
        .pipe(gulp.dest('./public'));
});

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:5000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 7000,
	});
});

gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: 'app.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('./api/swagger/swagger.yaml', ['swagger']);
});

gulp.task('default', ['watch', 'swagger', 'browser-sync']);