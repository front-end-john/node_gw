let gulp = require('gulp');
let sftp = require('gulp-sftp');
let compass = require('gulp-compass');
let merge = require('merge-stream');
let watch = require('gulp-watch');
let browserSync = require('browser-sync').create();
let reload = browserSync.reload;
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "127.0.0.1:8180"
    });
    gulp.watch('./public/admin/css/*.css').on('change', reload);
    //gulp.watch('./public/admin/dist/*.js').on('change', reload);
    gulp.watch('./public/mobile/jsj/css/*.css').on('change', reload);
    gulp.watch('./public/mobile/jsj/dist/*.js').on('change', reload);
});


//监听 scss编译并上传
gulp.task('watch-scss-compiled-upload', function() {
    gulp.watch(['./src/*/sass/*.scss'],
        ['scss-compiled-upload']);
});

//监听 react编译并上传
gulp.task('watch-react-compiled-upload', function() {
    gulp.watch(['./public/admin/dist/*.js','./public/mobile/jsj/dist/*.js'],
        ['react-compiled-upload']);
});


//编译 scss
gulp.task('compass', function() {
    let admin_scss=gulp.src('./src/admin/sass/admin.scss')
        .pipe(compass({
            config_file: './config/admin.rb',
            css: 'public/admin/css',
            sass: 'src/admin/sass'
        })).pipe(gulp.dest('./public/admin/css'));
    let jsj_scss=gulp.src('./src/jsj/sass/index.scss')
        .pipe(compass({
            config_file: './config/jsj.rb',
            css: 'public/mobile/jsj/css',
            sass: 'src/jsj/sass'
        })).pipe(gulp.dest('./public/mobile/jsj/css'));
    return merge(admin_scss,jsj_scss);
});

//scss编译并上传
gulp.task('scss-compiled-upload',['compass'],function () {
    let admin_css=gulp.src('./public/admin/css/*.css')
        //只有改变才处理
        .pipe(watch('./public/admin/css/*.css'))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/admin/css/"
    }));
    let jsj_css=gulp.src('./public/mobile/jsj/css/*.css')
        //只有改变才处理
        .pipe(watch('./public/mobile/jsj/css/*.css'))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/jsj/css/"
        }));
    return merge(admin_css,jsj_css);
});

//react编译并上传
gulp.task('react-compiled-upload',function () {
    let admin_js=gulp.src('./public/admin/dist/*.js')
        //只有改变才处理
        .pipe(watch('./public/admin/dist/*.js'))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/admin/dist/"
        }));
    let jsj_js=gulp.src('./public/mobile/jsj/dist/*.js')
        //只有改变才处理
        .pipe(watch('./public/mobile/jsj/dist/*.js'))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/mobile/jsj/dist/"
        }));
    return merge(admin_js,jsj_js);
});




