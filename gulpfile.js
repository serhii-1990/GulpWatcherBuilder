var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del');


// simple task 
// gulp.task('mytask', async function() {
//     console.log('Hello I`m Task');
// });

// This is a base of gulp.  
gulp.task('mytask', function() {
    return gulp.src('sorse-files').pipe(plugin()).pipe(gulp.dest('folder'));
});

// a simple example 
// gulp.task('sass', function() {
//     return gulp.src('app/sass/main.scss').pipe(sass()).pipe(gulp.dest('app/css'));
// });

gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.scss') // take the sourse 
        .pipe(sass()) // covert scss to css 
        .pipe(gulp.dest('app/css')) // upload results into  app/css
        .pipe(browserSync.reload({ stream: true })); // refresh css on the page
});

//Task for zipping libs JS
gulp.task('zipLibs', function() {
    return gulp.src([
            'app/libs/jquery/dist/jquery.min.js',
            'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
        ]).pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

//Task for JS
gulp.task('script', function() {
    return gulp.src(['app/js/common.js', 'app/libs/**/*.js'])
        .pipe(browserSync.reload({ stream: true }));
});

//Task for HTML 
gulp.task('code', function() {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }));
});

// This task for browser Sync (create server for autoreload)
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app',
        },
        notify: 'false',
    });
});

//This task need for minification css
gulp.task('css-libs', function() {
    return gulp.src('app/sass/_libs.scss')
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('app/css'));
});

// We should delete dir dist before build new production proj 
gulp.task('clean', async function() {
    return del.sync('dist');
});
// Buldig project for prodaction:
gulp.task('prebuild', async function() {
    var buildCss = gulp.src(['app/css/main.css', 'app/css/_libs.min.scss'])
        .pipe(gulp.dest('dist/css'));

    var buildJs = gulp.src(['app/js/**/*'])
        .pipe(gulp.dest('dist/js'));
    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});

// Separate task for wathcing by files 
gulp.task('watch', function() {
    gulp.watch('app/sass/**/*.scss', gulp.parallel('sass')); // watching by files .scss
    gulp.watch('app/*.html', gulp.parallel('code'));
    gulp.watch(['app/js/common.js', 'app/libs/**/*.js'], gulp.parallel('script'));
});

gulp.task('default', gulp.parallel('css-libs', 'sass', 'zipLibs', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('prebuild', 'clean', 'sass', 'zipLibs'));