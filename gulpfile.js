var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs');


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

// Separate task for wathcing by files 
gulp.task('watch', function() {
    gulp.watch('app/sass/**/*.scss', gulp.parallel('sass')); // watching by files .scss
    gulp.watch('app/*.html', gulp.parallel('code'));
    gulp.watch(['app/js/common.js', 'app/libs/**/*.js'], gulp.parallel('script'));
});
gulp.task('default', gulp.parallel('sass', 'browser-sync', 'watch'));