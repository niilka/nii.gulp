'use strict';

const CSS_MINIFY = true;

const gulp = require('gulp'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
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
    html: 'src/html/**/*.pug',
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

const config = {
  server: {
    baseDir: "./build"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: "nii.gulp"
};

gulp.task('html:build', () => {
  gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('js:build', () => {
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('style:build', () => {
  if (CSS_MINIFY) {
    gulp.src(path.src.style)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(prefixer())
      .pipe(csscomb())
      .pipe(cssmin())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.css))
      .pipe(reload({
        stream: true
      }));
  } else {
    gulp.src(path.src.style)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(prefixer())
      .pipe(csscomb())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(path.build.css))
      .pipe(reload({
        stream: true
      }));
  }
});

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

gulp.task('fonts:build', () => {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

gulp.task('svg:build', () => {
  return gulp
    .src(path.src.svg)
    .pipe(svgstore())
    .pipe(rename({
      basename: 'sprite'
    }))
    .pipe(gulp.dest(path.build.svg))
});

gulp.task('build', [
  'html:build',
  'js:build',
  'style:build',
  'fonts:build',
  'image:build'
]);

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

gulp.task('webserver', () => {
  browserSync(config);
});

gulp.task('clean', (cb) => {
  rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);