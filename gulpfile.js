﻿'use strict'

let
	gulp =        require('gulp'),
	bom =         require('gulp-bom'),
	rename =      require('gulp-rename'),
	watch =       require('gulp-watch'),
	watch_sass =  require('gulp-watch-sass'),
	plumber =     require('gulp-plumber'),
	composer =    require('gulp-uglify/composer'),
	uglifyjs =    require('uglify-es'),
	sass =        require('gulp-sass'),
	csso =        require('gulp-csso'),
	pug =         require('gulp-pug')

let minify = composer(uglifyjs, console)

let paths = {
	html: {
		dev: ['source/pug/**/*.pug', '!source/pug/src/**/*.pug'],
		prod: 'build/'
	},
	js: {
		dev: 'source/js/**/*.js',
		prod: 'build/assets/js/',
		kamina: 'node_modules/kamina-js/dist/*.min.js',
	},
	css: {
		dev: 'source/scss/**/*.scss',
		prod: 'build/assets/css/'
	}
}

gulp.task('pug', () => gulp.src(paths.html.dev)
	.pipe(plumber())
	.pipe(watch(paths.html.dev))
  .pipe(pug({}))
	.pipe(bom())
	.pipe(gulp.dest(paths.html.prod))
)

gulp.task('get-kamina', () => gulp.src(paths.js.kamina)
	.pipe(bom())
	.pipe(gulp.dest(paths.js.prod))
)

gulp.task('minify-js', () => gulp.src(paths.js.dev)
	.pipe(plumber())
	.pipe(watch(paths.js.dev))
	.pipe(minify({}))
	.pipe(rename({suffix: '.min'}))
	.pipe(bom())
	.pipe(gulp.dest(paths.js.prod))
)

gulp.task('scss', () => plumber()
	.pipe(watch_sass(paths.css.dev))
	.pipe(sass({outputStyle: 'compressed'}))
	.pipe(csso())
	.pipe(rename({suffix: '.min'}))
	.pipe(bom())
	.pipe(gulp.dest(paths.css.prod))
)

gulp.task('default', ['pug', 'get-kamina', 'minify-js', 'scss'])
