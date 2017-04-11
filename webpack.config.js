let webpack = require("webpack");
let path=require("path");
module.exports=[{
    name:"jsj",
    entry:{
        index:"./src/jsj/js/index.js",
        main:"./src/jsj/js/alone/main.js",
        order_pay:"./src/jsj/js/alone/order_pay.js",
        order_status:"./src/jsj/js/alone/order_status.js",
        check_order_detail:"./src/jsj/js/alone/check_order_detail.js",
        modify_contact_person:"./src/jsj/js/alone/modify_contact_person.js",
        order_comment:"./src/jsj/js/alone/order_comment.js",
        cancel_order_rule:"./src/jsj/js/alone/cancel_order_rule.js",
        cancel_order_know:"./src/jsj/js/alone/cancel_order_know.js",
        more_service:"./src/jsj/js/alone/more_service.js",
        order_list:"./src/jsj/js/alone/order_list.js",
        resource_config:"./src/resource_config/resource_config.js",
    },
    output:{
        filename:'[name].js',
        path:path.resolve(__dirname,'public/mobile/jsj/dist')
    },
    resolve: {
        modules: [ path.resolve(__dirname, "src"),"node_modules",]
    },
    module:{
        rules:[
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
            },
            { test: /\.css$/, use:['style-loader','css-loader'] }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify('production') }
        }),
        new webpack.optimize.UglifyJsPlugin({
         compress: {warnings: false},
         output: { comments: false}
         })
    ]
},{
    name:"admin",
    entry:{
        depend_lib:['react-date-picker'],
        admin:"./src/admin/js/index.js"
    },
    output:{
        filename:'[name].js',
        path:path.resolve(__dirname,'public/duck/dist')
    },
    resolve: {
        modules: [ path.resolve(__dirname, "src"),"node_modules",]
    },
    module:{
        rules:[
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
            },
            { test: /\.css$/, use:['style-loader','css-loader'] }
        ]
    },
    plugins: [
        /**
         *  文件压缩插件
         */
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV:JSON.stringify('production') }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false},
            output: { comments: false}
        }),
        new webpack.optimize.CommonsChunkPlugin({
             name:"depend_lib",
             minChunks: Infinity
         })
    ]
}];
//监听编译
//webpack  --watch
//webpack  --watch --config ./config/example.config.js
//npm i --save-dev babel-core babel-loader babel-preset-es2015
// babel-preset-react webpack