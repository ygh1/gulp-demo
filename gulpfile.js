const {src, dest, parallel, watch, series} = require('gulp')

const swig = require('gulp-swig')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const bs = require('browser-sync')
const imagemin = require('gulp-imagemin')
const useRef = require('gulp-useref')
const gulpif = require('gulp-if');
const del = require('del')

const page = () => {
  return src('src/**/*.html')
  .pipe(swig({
    defaults: {
      cache: false,
    }
  }))
  .pipe(dest('temp'))
  .pipe(bs.reload({stream: true}))
}
const style = () => {
  return src('src/assets/styles/*.scss', {base: 'src'})
  .pipe(sass())
  .pipe(dest('temp'))
  .pipe(bs.reload({stream: true}))
}
const script = () => {
  return src('src/assets/scripts/*.js', {base: 'src'})
  .pipe(babel())
  .pipe(dest('temp'))
  .pipe(bs.reload({stream: true}))
}
const serve = () => {
  watch('src/**/*.html', page)
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)

  watch([
    'src/assets/images/*',
    'src/assets/fonts/*',
    'public/**'
  ], bs.reload())
  bs.init({
    notify: false,
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {'/node_modules': 'node_modules'}
    }
  })
}
const image = () => {
  return src('src/assets/images/*', {base: 'src'})
  .pipe(imagemin())
  .pipe(dest('dist'))
}
const extra = () => {
  return src('src/assets/fonts/*', {base: 'src'})
  .pipe(imagemin())
  .pipe(dest('dist'))
}
const clean = () => {
  return del(['dist', 'temp'])
}

const useref = () => {
  return src('temp/**/*.html', {base: 'temp'})
  .pipe(useRef({searchPath: ['temp', '.']}))
  // .pipe(gulpif(/\.css/, style()) )
  // .pipe(gulpif(/\.js/, script()))
  .pipe(dest('dist'))
}

const compile = parallel(
  page,
  style,
  script
)
const build = series(
  clean,
  parallel(
    series(compile, useref),
    image,
    extra
  )
)
const dev = series(compile ,serve)

module.exports = {
  page,
  style,
  script,
  serve,
  image,
  extra,
  compile,
  useref,
  clean,
  dev,
  build
}