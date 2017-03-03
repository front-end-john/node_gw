let gulp = require('gulp');
let sftp = require('gulp-sftp');
let compass = require('gulp-compass');
let merge = require('merge-stream');
let watch = require('gulp-watch');

let gulpif = require('gulp-if');
let sprity = require('sprity');

const fs = require('fs');
let log=require("./utils/mylog");
let browserSync = require('browser-sync').create();
let reload = browserSync.reload;
/**
 * 监听资源文件改变，自动同步刷新浏览器
 */
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "127.0.0.1:8180"
    });
    gulp.watch('./public/admin/css/*.css').on('change', reload);
    //gulp.watch('./public/admin/dist/*.js').on('change', reload);
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
                css: 'public/admin/css',
                sass: 'src/admin/sass'
            })).pipe(gulp.dest('./public/admin/css/'));
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
});

/**
 * 编译后的css 上传服务器
 */
gulp.task('compiled-css-upload',function () {
    let admin_css=gulp.src('./public/admin/css/*.css')
        /**
         * 文件改变才上传
         */
        .pipe(watch('./public/admin/css/*.css'))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/admin/css/"
    }));
    let jsj_css=gulp.src('./public/mobile/jsj/css/*.css')
        /**
         * 文件改变才上传
         */
        .pipe(watch('./public/mobile/jsj/css/*.css'))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/mobile/jsj/css/"
        }));
    return merge(admin_css,jsj_css);
});

/**
 * 监听编译后的js的改变，并上传服务器
 */
gulp.task('watch-compiled-react-upload',function () {
    let admin_js_path='./public/admin/dist/*.js';
    let jsj_js_path='./public/mobile/jsj/dist/*.js';

    gulp.src(admin_js_path)
        .pipe(watch(admin_js_path))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/admin/dist/"
        }));
    gulp.src(jsj_js_path)
        .pipe(watch(jsj_js_path))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/mobile/jsj/dist/"
        }));

});

function getJsonObj(file) {
    let text=fs.readFileSync(file,"utf-8");
    return JSON.parse(text);
}
function writeJsonFile(json,file) {
    let text=JSON.stringify(json,null,"  ");
    fs.writeFileSync(file,text,"utf-8");
    log.info(file+"成功更新");
}

/**
 * 更新localStorage本地资源文件缓存配置
 */
gulp.task("update local-cache.json",()=>{
    let file="./public/local-cache.json";
    let json=getJsonObj(file);
    let names=Object.getOwnPropertyNames(json);
    for(let i=0,len=names.length;i<len;i++){
        let key=names[i],obj=json[key];
        /**
         * 监听key对应的资源，如有改变就更新相应的update
         */
        watch('./public'+obj.loadUrl,()=>{
            log.info("键"+key+" 将更新");
            json=getJsonObj(file);
            obj.update=new Date().getTime();
            json[key]=obj;
            writeJsonFile(json,file);
        });
    }

    /**
     * 同步最新缓存配置到服务器
     */
    gulp.src(file)
        .pipe(watch(file))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/"
        }));
});


/**
 * 上传到测试服务器
 */
gulp.task("test-host",()=>{
    let files=[
                {src:"./public/**/*",           dest:"/var/code/fronts/public/"},
                {src:"./routes/*",              dest:"/var/code/fronts/routes/"},
                {src:"./utils/*",               dest:"/var/code/fronts/utils/"},
                {src:"./views/**/*",            dest:"/var/code/fronts/views/"},
                {src:"./bin/*",                 dest:"/var/code/fronts/bin/"},
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

});

/**
 * 上传到生产服务器
 */
gulp.task("production-host",()=>{
    let files=[
        {src:"./public/**/*",           dest:"/var/code/fronts/public/"},
        {src:"./routes/*",              dest:"/var/code/fronts/routes/"},
        {src:"./utils/*",               dest:"/var/code/fronts/utils/"},
        {src:"./views/**/*",            dest:"/var/code/fronts/views/"},
        {src:"./bin/*",                 dest:"/var/code/fronts/bin/"},
        {src:"./app.js",                dest:"/var/code/fronts/"},
        {src:"./package.json",          dest:"/var/code/fronts/"},
        {src:"./log4js.json",           dest:"/var/code/fronts/"},
        {src:"./ecosystem.config.js",   dest:"/var/code/fronts/"},
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

/**
 * sprites test
 */

gulp.task('sprites', function () {
    return sprity.src({
            src: './__tests__/imgs/*.{png,jpg}',
            style: './sprite.scss',
            name:"icon",
            base64: true,
            processor: 'sass',
        })
        .pipe(gulpif('*.png', gulp.dest('./__tests__/dist/img/'), gulp.dest('./__tests__/dist/css/')))
});