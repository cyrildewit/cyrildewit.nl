'use strict';

import gulp from 'gulp';
import del from 'del';
import sass from 'gulp-sass';
import cssnano from 'gulp-cssnano';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import rename from 'gulp-rename';
import postcss from 'gulp-postcss';
import parseArgs from 'minimist';
import through from 'through2';

const isDev = parseArgs(process.argv.slice(2)).type === 'production';

const server = browserSync.create();

const paths = {
    templates: {
        scan: './public/**/*.html'
    },
    styles: {
        src: './src/scss/main.scss',
        dest: './public/css/',
        scan: './src/scss/**/*.scss'
    },
    scripts: {},
};

const clean = () => del(['public/css', 'public/js', 'public/maps']);

const compileStyles = () => {
    return gulp.src(paths.styles.src, { sourcemaps: true })
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(postcss([
            autoprefixer({
                browsers: ['> 5%']
            })
        ]))
        .pipe(isDev ? cssnano() : through.obj())
        .pipe(isDev ? rename({ suffix: configuration.environment.suffixes.min }) : through.obj())
        .pipe(gulp.dest(paths.styles.dest));
}

const watchMarkup = () => {
    let markupWatcher = gulp.watch(paths.templates.scan);

    markupWatcher.on('change', server.reload);
};

const watchStyles = () => {
    let stylesWatcher = gulp.watch(paths.styles.scan, gulp.series(compileStyles));

    stylesWatcher.on('change', server.reload);
};

const compile = gulp.series(clean, gulp.parallel(compileStyles));
compile.description = 'compile all sources'

const startServer = () => {
    server.init({
        server: {
            baseDir: './public'
        }
    });
};

const serve = gulp.series(compile, startServer);
serve.description = 'serve compiled source on local serve at port 3000';

const watch = gulp.parallel(watchMarkup, watchStyles);
watch.description = 'watch for changes to all source';

const defaultTasks = gulp.parallel(serve, watch);

export {
    compile,
    compileStyles,
    serve,
    watch,
    watchMarkup,
    watchStyles,
};

export default defaultTasks;
