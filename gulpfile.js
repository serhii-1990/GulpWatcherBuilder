var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache');



//Task for Saas
gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.scss') // take the sourse 
        .pipe(sass()) // convert scss to css 
        .pipe(gulp.dest('app/css')) // upload results into  app/css
        .pipe(browserSync.reload({ stream: true })); // refresh css on the page
});

//Task for zipping libs JS
gulp.task('zipLibs', function() {
    return gulp.src('app/libs/*/*.js')
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

//Task for JS
gulp.task('script', function() {
    return gulp.src(['app/js/*.js'])
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

// We should delete dir dist before build new production proj 
gulp.task('clean', async function() {
    return del.sync('dist');
});


gulp.task('img', function() {
    return gulp.src("app/img/**/*")
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()],
        })))
        .pipe(gulp.dest('dist/img'));
});

// Buldig project for prodaction:
gulp.task('prebuild', async function() {
    var buildCss = gulp.src(['app/css/main.css'])
        .pipe(gulp.dest('dist/css'));
    var buildJs = gulp.src(['app/js/**/*'])
        .pipe(gulp.dest('dist/js'));
    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
    var fonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

// Separate task for wathcing by files 
gulp.task('watch', function() {
    gulp.watch('app/sass/**/*.scss', gulp.parallel('sass')); // watching by files .scss
    gulp.watch('app/*.html', gulp.parallel('code'));
    gulp.watch(['app/js/*.js'], gulp.parallel('script'));
});

gulp.task('default', gulp.parallel('sass', 'browser-sync', 'watch', 'zipLibs'));
gulp.task('build', gulp.parallel('prebuild', 'clean', 'sass', 'zipLibs', 'img'));