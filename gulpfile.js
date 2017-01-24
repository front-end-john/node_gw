let gulp = require('gulp');
let sftp = require('gulp-sftp');
let compass = require('gulp-compass');
let merge = require('merge-stream');
let watch = require('gulp-watch');
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
    let admin_js=gulp.src('./public/admin/dist/*.js')
        .pipe(watch('./public/admin/dist/*.js'))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/admin/dist/"
        }));
    let jsj_js=gulp.src('./public/mobile/jsj/dist/*.js')
        .pipe(watch('./public/mobile/jsj/dist/*.js'))
        .pipe(sftp({
            host: 'dev.feibotong.com',
            user: 'ubuntu',
            keyLocation: "./utils/dev",
            remotePath:"/var/code/fronts/public/mobile/jsj/dist/"
        }));
    return merge(admin_js,jsj_js);
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



