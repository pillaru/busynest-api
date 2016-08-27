const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

gulp.task('swagger', () => {
    gulp.src('./api/swagger/swagger.yaml')
        .pipe(gulp.dest('./public'));
});

const jsFiles = ['*.js', 'app/**/*.js'];
const swaggerFiles = ['./api/swagger/swagger.yaml'];

gulp.task('lint', () =>
    gulp.src(jsFiles)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
);

gulp.task('serve', ['swagger'], (cb) => {
    let started = false;
    const options = {
        script: 'app.js',
        delayTime: 1,
        env: {
            PORT: 5000,
            MONGODB_CONNECTION_STRING: 'mongodb://localhost:27017/bizhub'
        },
        watch: [jsFiles, swaggerFiles],
        tasks: ['swagger']
    };
    return nodemon(options)
        .on('start', () => {
            // to avoid nodemon being started multiple times
            // thanks @matthisk
            if (!started) {
                cb();
                started = true;
            }
        });
});
