let gulp = require('gulp');
let sftp = require('gulp-sftp');
let compass = require('gulp-compass');
let watch = require('gulp-watch');
let gulpif = require('gulp-if');

const fs = require('fs');
let log=require("./utils/mylog");
let browserSync = require('browser-sync').create();
let reload = browserSync.reload;
/**
 * 监听资源文件改变，自动同步刷新浏览器
 */
gulp.task('browser-sync',function(){
    browserSync.init({
        proxy: "127.0.0.1:8180"
    });
    gulp.watch('./public/duck/css/*.css').on('change', reload);
    //gulp.watch('./public/duck/dist/*.js').on('change', reload);
    gulp.watch('./public/mobile/jsj/css/*.css').on('change', reload);
    gulp.watch('./public/mobile/jsj/dist/*.js').on('change', reload);
});

/**
 * 编译 scss
 */
gulp.task('compass', function() {
    /**
     * admin scss文件改变才编译
     */
    gulp.watch('./src/admin/sass/*.scss').on('change', ()=>{
        gulp.src('./src/admin/sass/admin.scss')
            .pipe(compass({
                config_file: './config/admin.rb',
                css: 'public/duck/css',
                sass: 'src/admin/sass'
            })).pipe(gulp.dest('./public/duck/css/'));
    });
    /**
     * jsj scss文件改变才编译
     */
    gulp.watch('./src/jsj/sass/*.scss').on('change', ()=>{
        gulp.src('./src/jsj/sass/index.scss')
            .pipe(compass({
                config_file: './config/jsj.rb',
                css: 'public/mobile/jsj/css',
                sass: 'src/jsj/sass'
            })).pipe(gulp.dest('./public/mobile/jsj/css/'));
    });
    /**
     * additional scss文件改变才编译
     */
    gulp.watch('./src/additional/sass/*.scss').on('change', ()=>{
        gulp.src('./src/additional/sass/*.scss')
            .pipe(compass({
                config_file: './config/additional.rb',
                css: 'public/duck/additional/css',
                sass: 'src/additional/sass'
            })).pipe(gulpif('*.png', gulp.dest('./public/mobile/jsj/additional/images/'),
              gulp.dest('./public/mobile/jsj/additional/css/')));
    });
});

/**
 * 编译后的css 上传服务器
 */
gulp.task('compiled-css-upload',function () {
    let admin_css_path='./public/duck/css/*.css';
    gulp.src(admin_css_path)
        /**
         * 监听文件改变并上传
         */
        .pipe(watch(admin_css_path))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/duck/css/"
    }));
    let jsj_css_path='./public/mobile/jsj/css/*.css';
    gulp.src(jsj_css_path)
        /**
         * 文件改变才上传
         */
        .pipe(watch(jsj_css_path))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/mobile/jsj/css/"
        }));
    let additional_css_path='./public/mobile/jsj/additional/css/*.css';
    gulp.src(additional_css_path)
        /**
         * 文件改变才上传
         */
        .pipe(watch(additional_css_path))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/mobile/jsj/additional/css/"
        }));
});

/**
 * 监听编译后的js的改变，并上传服务器
 */
gulp.task('watch-compiled-react-upload',function () {
    let admin_js_path='./public/duck/dist/*.js';
    let admin_html_path='./public/duck/www/*.html';

    let jsj_js_path='./public/mobile/jsj/js/*.js';
    let jsj_html_path='./public/mobile/jsj/www/*.html';

    let additional_js_path='./public/mobile/jsj/additional/dist/*.js';
    let additional_html_path='./public/mobile/jsj/additional/www/*.html';

    gulp.src(admin_js_path)
        .pipe(watch(admin_js_path))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/duck/dist/"
        }));
    gulp.src(admin_html_path)
        .pipe(watch(admin_html_path))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/duck/www/"
        }));

    gulp.src(jsj_js_path)
        .pipe(watch(jsj_js_path))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/mobile/jsj/js/"
        }));
    gulp.src(jsj_html_path)
        .pipe(watch(jsj_html_path))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/mobile/jsj/www/"
        }));

    gulp.src(additional_js_path)
        .pipe(watch(additional_js_path))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/mobile/jsj/additional/dist/"
        }));
    gulp.src(additional_html_path)
        .pipe(watch(additional_html_path))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/mobile/jsj/additional/www/"
        }));

});

/**
 * 上传到测试服务器
 */
/*gulp.task("test-host",()=>{
    let files=[
                {src:"./public/!**!/!*",           dest:"/var/code/fronts/public/"},
                {src:"./routes/!*",              dest:"/var/code/fronts/routes/"},
                {src:"./utils/!*",               dest:"/var/code/fronts/utils/"},
                {src:"./views/!**!/!*",            dest:"/var/code/fronts/views/"},
                {src:"./bin/!*",                 dest:"/var/code/fronts/bin/"},
                {src:"./app.js",                dest:"/var/code/fronts/"},
                {src:"./package.json",          dest:"/var/code/fronts/"},
                {src:"./log4js.json",           dest:"/var/code/fronts/"},
                {src:"./ecosystem.config.js",   dest:"/var/code/fronts/"},
    ];
    files.forEach((item)=>{
        gulp.src(item.src)
            .pipe(watch(item.src))
            .pipe(sftp({
                host: 'test.feibotong.com',
                user: 'feiche',
                port:18899,
                keyLocation: "./utils/test",
                remotePath:item.dest
            }));
    });

});*/

/**
 * 上传到生产服务器
 */
gulp.task("production-host",()=>{
    let files=[
       /* {src:"./public/duck/!**!/!*",           dest:"/var/code/fronts/public/duck/"},*/
        {src:"./public/mobile/jsj/**/*",     dest:"/var/code/fronts/public/mobile/jsj/"},
        /*{src:"./public/!*.html",         dest:"/var/code/fronts/public/"},*/
       /* {src:"./routes/!*",                   dest:"/var/code/fronts/routes/"},*/
        //{src:"./utils/!*",               dest:"/var/code/fronts/utils/"},
        //{src:"./views/**/*",            dest:"/var/code/fronts/views/"},
        //{src:"./bin/!*",                 dest:"/var/code/fronts/bin/"},
        /*{src:"./app.js",                dest:"/var/code/fronts/"},*/
        //{src:"./package.json",          dest:"/var/code/fronts/"},
        //{src:"./log4js.json",           dest:"/var/code/fronts/"},
        //{src:"./ecosystem.config.js",   dest:"/var/code/fronts/"},
    ];
    files.forEach((item)=>{
        gulp.src(item.src)
            .pipe(watch(item.src))
            .pipe(sftp({
                host: '119.23.141.46',
                user: 'ubuntu',
                pass: 'txj2017sz',
                remotePath:item.dest
            }));
    });

});
