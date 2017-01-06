let webpack = require("webpack");
module.exports=[{
    name:"weixinjsj",
    entry:{
        //jquery_family:['jquery','jquery-touch-events'],
        index:"./src/weixinjsj/js/index.js"
    },
    output:{
        filename:'[name].js',
        path:'./public/weixinjsj/dist'
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
            },{ test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    },
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
},{
    name:"admin",
    entry:{
        //jquery_family:['jquery','jquery-touch-events'],
        admin:"./src/admin/js/index.js"
    },
    output:{
        filename:'[name].js',
        path:'./public/admin/dist'
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
//webpack  --watch
//webpack  --watch --config ./config/example.config.js
//npm i --save-dev babel-core babel-loader babel-preset-es2015
// babel-preset-react webpack