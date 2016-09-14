"use strict";
var gulp = require('gulp');
var wrap = require('gulp-wrap');
var ssg = require('gulp-ssg');
var data = require('gulp-data');
var matter = require('gray-matter');
var del = require('del');
var args = require('yargs').argv;
var webserver = require('gulp-webserver');

gulp.task('default', function(){
  gulp.run('run');
});

gulp.task('html', function() {

    return gulp.src('content/*.html')
        .pipe(data(function(file) {
            var m = matter(String(file.contents));
            file.contents = new Buffer(m.content);
            return m.data;
        }))
        .pipe(ssg())

        // Wrap file in template
        .pipe(wrap(
          { src: 'templates/template.html' },
          { siteTitle: 'StartLabs'},
          { engine: 'mustache'}
        ))
        .pipe(gulp.dest('public/'));
});

gulp.task('assets', function () {
  return gulp
    .src('assets/**/*')
    .pipe(gulp.dest('public/assets'))
});

gulp.task('cname', function () {
  return gulp
    .src('CNAME')
    .pipe(gulp.dest('public'))
});

gulp.task('semantic', function () {
  return gulp
    .src('semantic/dist/**/*')
    .pipe(gulp.dest('public/semantic/dist'))
});

gulp.task('clean', function () {
  return del('public/**/*')
});

gulp.task('build', ['assets', 'semantic', 'html', 'cname']);


gulp.task('serve', function(){
  return gulp.src("./public").pipe(webserver({
      directoryListing: false,
      open: args.path == undefined ? true:args.path
    }));
});

gulp.task('run', ['clean'], function(){
 gulp.run('build');
 gulp.run('serve');
});
