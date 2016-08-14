const gulp = require('gulp');
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

gulp.task('swagger', () => {
    gulp.src('./api/swagger/swagger.yaml')
        .pipe(gulp.dest('./public'));
});

const jsFiles = ['*.js', 'app/**/*.js'];

gulp.task('lint', () => {
    gulp.src(jsFiles)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('browser-sync', ['nodemon'], () => {
    browserSync.init(null, {
        proxy: 'http://localhost:5000',
        files: ['public/**/*.*'],
        browser: 'google chrome',
        port: 7000
    });
});

gulp.task('nodemon', (cb) => {
    let started = false;
    return nodemon({
        script: 'app.js'
    }).on('start', () => {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});

// Rerun the task when a file changes
gulp.task('watch', () => {
    gulp.watch('./api/swagger/swagger.yaml', ['swagger']);
});

gulp.task('default', ['watch', 'swagger', 'browser-sync']);
