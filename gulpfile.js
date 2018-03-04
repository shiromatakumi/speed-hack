const gulp = require('gulp');
const include = require('gulp-file-include');
const sass = require('gulp-sass');
const plumber     = require('gulp-plumber');
const packageImporter = require('node-sass-package-importer');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require("browser-sync");

// sassコンパイルタスク
gulp.task('sass', function(){
  gulp.src('./src/sass/style.scss')
    .pipe(plumber())
    .pipe(sass({
    	importer: packageImporter({
        extensions: ['.scss', '.css']
      })
    }))
    .pipe(autoprefixer(['last 2 versions']))
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./temp/css/'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('include', function() {
    gulp.src("./src/php/*.php")
    .pipe(include({
    	prefix: '@@',
    	basepath: './'
    }))
    .pipe(gulp.dest('wp/wp-content/themes/high-speed'));
});

gulp.task( 'copy', function() {
    return gulp.src(
        [ 'src/php/*.php', '!src/php/header.php'],
        { base: 'src/php/' }
    )
    .pipe( gulp.dest( 'wp/wp-content/themes/high-speed' ) );
} );

/** ブラウザ表示 */
gulp.task("browserSync", function() {
  browserSync.init({
      proxy: 'http://localhost/speed-hack/wp/',
      port: 3000
    });
  // ファイルの監視 : 以下のファイルが変わったらリロード処理を呼び出す
  gulp.watch("./wp/wp-content/themes/**/index.php", ["reload"]); 
});

/** リロード */
gulp.task("reload", function() {
  browserSync.reload();
});

gulp.task('watch', function(){
	gulp.watch('./src/**/*', ['sass', 'include', 'copy', 'reload']);
    gulp.watch('./temp/css/*.css', ['include']);
});

gulp.task('default', ['sass', 'include', 'copy', 'browserSync', 'watch']);
