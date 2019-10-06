var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    copy = require('gulp-copy'),
    combiner = require('stream-combiner2'),
    sourcemaps = require('gulp-sourcemaps');

const paths = {
	sass: {
		src: 'src/scss/**/*.scss',
		dest: 'demo/assets/css/'
	},
	scripts: {
		src: 'src/js/**/*.js',
		dest: 'dist/'
    }
}

// Watch Sass
gulp.task('watchSass',  () => {
    return gulp.src('demo/assets/scss/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            sourceMap: 'scss',
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'IE 10'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest( paths.sass.dest ));
});

// Compile Sass
gulp.task('compileSass',  () => {
    return gulp.src('demo/assets/scss/app.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
                .pipe(autoprefixer({
            browsers: ['last 2 versions', 'IE 10'],
            cascade: false
        }))
        .pipe(gulp.dest( paths.sass.dest ));
});

// Compile JS
gulp.task('watchScripts', () => {

    var combined = combiner.obj([
        gulp.src( paths.scripts.src )
            .pipe(jshint({
                "strict": true,
                "scripturl": true,
                "devel": true,
                "curly": true,
                "undef": true,
                "unused": true,
                "eqeqeq": true,
                "eqnull": true,
                "browser": true,
                "camelcase": false,
                "esversion": 6,
                "jquery": false,
                "globals": {
                    "linkMt": true
                }
            }))
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(jshint().on('error', errorAlert))
            .pipe(concat('mightyFormValidator.full.min.js'))
            .pipe(gulp.dest( paths.scripts.dest ))
    ]);
    combined.on('error', console.error.bind(console));

    return combined;
});

// Compile full JS
gulp.task('compileScripts', () => {

    var combined = combiner.obj([
        gulp.src( paths.scripts.src )
            .pipe(jshint({
                "strict": true,
                "scripturl": true,
                "devel": true,
                "curly": true,
                "undef": true,
                "unused": true,
                "eqeqeq": true,
                "eqnull": true,
                "browser": true,
                "camelcase": false,
                "esversion": 6,
                "jquery": false,
                "globals": {
                    "linkMt": true
                }
            }))
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(jshint().on('error', errorAlert))
            .pipe(concat('mightyFormValidator.full.min.js'))
            .pipe(gulp.dest( paths.scripts.dest ))
            .pipe(uglify().on('error', errorAlert))
            .pipe(gulp.dest( paths.scripts.dest ))
    ]);
    combined.on('error', console.error.bind(console));

    return combined;
});

// Compile engine only JS
gulp.task('compileEngineScript', () => {

    var combined = combiner.obj([
        gulp.src( 'src/js/mightyFormValidator.js' )
            .pipe(jshint({
                "strict": true,
                "scripturl": true,
                "devel": true,
                "curly": true,
                "undef": true,
                "unused": true,
                "eqeqeq": true,
                "eqnull": true,
                "browser": true,
                "camelcase": false,
                "esversion": 6,
                "jquery": false,
                "globals": {
                    "linkMt": true
                }
            }))
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(jshint().on('error', errorAlert))
            .pipe(concat('mightyFormValidator.min.js'))
            .pipe(gulp.dest( paths.scripts.dest ))
            .pipe(uglify().on('error', errorAlert))
            .pipe(gulp.dest( paths.scripts.dest ))
    ]);
    combined.on('error', console.error.bind(console));

    return combined;
});

function errorAlert(err) {
    console.log(err.toString());
    this.emit("end");
}

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch( paths.sass.src, ['watchSass']);
    gulp.watch( paths.scripts.src, ['watchScripts', 'compileEngineScript']);
});

//gulp.task('dev', ['watchSass', 'watchScripts', 'compileSprite', 'copyFonts', 'copyImages', 'copySvgs']);
gulp.task('default', ['compileSass', 'compileScripts', 'compileEngineScript']);
