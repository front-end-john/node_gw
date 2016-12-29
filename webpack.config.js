let webpack = require("webpack");
module.exports=[{
    name:'react',
    entry:{
        //jquery_family:['jquery','jquery-touch-events'],
        index:"./public/src/js/admin/index.js"
    },
    output:{
        filename:'[name].js',
        path:'./public/dist/js/admin'
    },
    module:{
        loaders:[
            //babel编译jsx和es6
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a legal name to reference
                query: {
                    presets:  ['es2015','react']
                }
            },
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    },
    //其它解决方案配置
    /*resolve: {
        //查找module的话从这里开始查找  --绝对路径
        root: 'E:/WorkSpace/WebstormProjects/gyennoWebExpand/public/javascripts',
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['', '.js', 'jsx'],
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias:{
            AppStore : 'js/stores/AppStores.js'//后续直接 require('AppStore') 即可
        }
    },*/
    plugins: [
        //文件压缩插件
        /* new webpack.optimize.UglifyJsPlugin({
         compress: {
         warnings: false
         },
         output: {
         comments: false
         }
         }),*/
        /*new webpack.optimize.CommonsChunkPlugin({
         name:['jquery_family'],
         minChunks: Infinity
         })*/
    ]
}];
//监听编译
//webpack -d --watch
//npm i --save-dev babel-core babel-loader babel-preset-es2015
// babel-preset-react webpack