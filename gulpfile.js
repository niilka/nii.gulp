'use strict';

// Подключаемые модули

const
  gulp = require('gulp'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify-es').default,
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  rigger = require('gulp-rigger'),
  cssmin = require('gulp-minify-css'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  rimraf = require('rimraf'),
  browserSync = require("browser-sync"),
  pug = require("gulp-pug"),
  svgstore = require('gulp-svgstore'),
  rename = require('gulp-rename'),
  csscomb = require('gulp-csscomb'),
  reload = browserSync.reload;

// Указываем пути для сбилженых, еще не сбилженых и файлов за которыми стоит следить

const path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    fonts: 'build/fonts/',
    svg: 'build/img/icons/svg/'
  },
  src: {
    html: 'src/html/*.pug',
    js: 'src/js/main.js',
    style: 'src/style/main.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*',
    svg: 'src/icons/svg/**/*.svg'
  },
  watch: {
    html: 'src/html/**/*.pug',
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*',
    svg: 'src/icons/svg/**/*.svg'
  },
  clean: './build'
};

// Конфигурация веб сервера

const config = {
  server: {
    baseDir: "./build",
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: "nii.gulp",
  notify: false,
  open: false
};

// Билдим js

gulp.task('js:build', () => {
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(uglify())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({
      stream: true
    }));
});

// Билдим стили

gulp.task('style:build', () => {
  gulp.src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefixer({
      browsers: ['last 15 versions']
    }))
    .pipe(csscomb())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({
      stream: true
    }));
});

// Билдим html

gulp.task('html:build', () => {
  return gulp.src(path.src.html)
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({
      stream: true
    }));
});

// Сжимаем картинки

gulp.task('image:build', () => {
  gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({
      stream: true
    }));
});

// Переносим шрифты

gulp.task('fonts:build', () => {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

// Создаем SVG спрайт

gulp.task('svg:build', () => {
  return gulp
    .src(path.src.svg)
    .pipe(svgstore())
    .pipe(rename({
      basename: 'sprite'
    }))
    .pipe(gulp.dest(path.build.svg))
});

// Общий таск билда всего

gulp.task('build', [
  'html:build',
  'js:build',
  'style:build',
  'fonts:build',
  'image:build'
]);

// Смотрящий

gulp.task('watch', () => {
  watch([path.watch.html], (event, cb) => {
    gulp.start('html:build');
  });
  watch([path.watch.style], (event, cb) => {
    gulp.start('style:build');
  });
  watch([path.watch.js], (event, cb) => {
    gulp.start('js:build');
  });
  watch([path.watch.img], (event, cb) => {
    gulp.start('image:build');
  });
  watch([path.watch.fonts], (event, cb) => {
    gulp.start('fonts:build');
  });
  watch([path.watch.svg], (event, cb) => {
    gulp.start('svg:build');
  });
});

// Запуск веб сервера

gulp.task('webserver', () => {
  browserSync(config);
});

// Чистим чистим

gulp.task('clean', (cb) => {
  rimraf(path.clean, cb);
});

// И то что по стандарту

gulp.task('default', ['build', 'webserver', 'watch']);