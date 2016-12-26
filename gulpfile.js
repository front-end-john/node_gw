let gulp = require('gulp');
let browserSync = require('browser-sync').create();
let reload = browserSync.reload;
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "127.0.0.1:88"
    });
    gulp.watch('./public/dist/css/admin.css').on('change', reload);
    gulp.watch('./public/dist/js/admin/*.js').on('change', reload);
});