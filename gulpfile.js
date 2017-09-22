'use strict';

const gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
      sass = require('gulp-sass'),
  cleanCSS = require('gulp-clean-css'),
      maps = require('gulp-sourcemaps'),
      del  = require('del'),
   connect = require('gulp-connect'),
  imagemin = require('gulp-imagemin'),
livereload = require('gulp-livereload');

// concatenate javascript
gulp.task('concatScripts',() => {
  return gulp.src(['js/jquery-3.2.1.js','js/circle/**.js'])
      .pipe(maps.init())
      .pipe(concat('global.js'))
      .pipe(maps.write('./'))
      .pipe(gulp.dest('js'));
});

  // minify javascript and add a reload if ran agian
gulp.task('scripts', ['concatScripts'], () => {
    return gulp.src('js/global.js')
       .pipe(uglify())
       .pipe(rename('all.min.js'))
       .pipe(gulp.dest('dist/scripts'))
       .pipe(livereload());
});

 // compile sass and write maps
gulp.task('compileSass', () => {
  return gulp.src('src/sass/global.scss')
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('css'));
});

// create a styles task
gulp.task('styles',['compileSass'], () => {
  return gulp.src('css/global.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(livereload());
});

// create an image optimization task
gulp.task('images', () => {
   return gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/content'));
});

// create a server task
gulp.task('connect', () => {
connect.server ({
           port: 3000,
           root: ['./'],
     livereload: true
  });// end of server
}); // end of task

  // create a clean task
gulp.task('clean', () => {
    del(['dist', 'css', 'js/global.js', 'js/global.js.map'])
});// end of task clean

  // create a build task
gulp.task('build', ['clean'], () => {
    gulp.start(['scripts', 'images', 'styles'])
});

// create a watch task
gulp.task('watch', () => {
  livereload.listen();
  gulp.watch('src/sass/**', ['styles'])
  gulp.watch('js/circle/*.js', ['scripts'])
});

gulp.task('default', ['build'], () => {
   gulp.start('connect', 'watch');
   console.log('The address is localhost:3000');
});
