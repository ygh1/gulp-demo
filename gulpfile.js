const {src, dest, parallel, watch} = require('gulp')

const swig = require('gulp-swig')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const bs = require('browser-sync')
const imagemin = require('gulp-imagemin')

const page = () => {
  return src('src/**/*.html')
  .pipe(swig({
    defaults: {
      cache: false,
    }
  }))
  .pipe(dest('dist'))
  .pipe(bs.reload({stream: true}))
}
const style = () => {
  return src('src/assets/styles/*.scss', {base: 'src'})
  .pipe(sass())
  .pipe(dest('dist'))
  .pipe(bs.reload({stream: true}))
}
const script = () => {
  return src('src/assets/scripts/*.js', {base: 'src'})
  .pipe(babel())
  .pipe(dest('dist'))
  .pipe(bs.reload({stream: true}))
}
const serve = () => {
  watch('src/**/*.html', page)
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  bs.init({
    notify: false,
    server: {
      baseDir: 'dist',
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


const compile = parallel(page, style, script)

module.exports = {
  page,
  style,
  script,
  serve,
  image,
  extra,
  compile,
}