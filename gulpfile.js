var gulp = require('gulp');
// var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var header = require('gulp-header');
var templateCache = require('gulp-angular-templatecache');
var minifyHtml = require("gulp-minify-html");
var concat = require('gulp-concat');
var addsrc = require('gulp-add-src');
var order = require("gulp-order");
var del = require('del');

var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @author <%= pkg.author %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

// ====== Templates
gulp.task('templates', function() {
    gulp.src(['*.html'], {cwd: 'src'})
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(templateCache({
            module: 'angular-notifications',
        }))
        .pipe(rename('angular-notifications.templates.js'))
        .pipe(gulp.dest("build"));
});

gulp.task('service', function() {
    gulp.src(['src/angular-notifications.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'))
        // .pipe(ngAnnotate())
        .pipe(addsrc('build/*.js'))
        .pipe(order([
            'src/angular-notifications.js',
            'build/angular-notifications.templates.js'
        ]))
        .pipe(concat('angular-notifications.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(header(banner, { pkg : pkg }))
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('examples'));
});

gulp.task('clean', function(cb) {
    del(['build'], cb);
});

gulp.task('build', ['templates', 'service']);
gulp.task('deploy', ['build']);

gulp.task('default', ['clean', 'deploy'], function() {});