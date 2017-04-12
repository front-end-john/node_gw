let webpack = require("webpack");
let path=require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
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
    },
    output:{
        filename:'js/[name].js?[hash]',
        path:path.resolve(__dirname,'public/mobile/jsj'),
        publicPath:"/mobile/jsj/"
    },
    resolve: {
        modules: [ path.resolve(__dirname, "src"),"node_modules",]
    },
    module:{
        rules:[
            {test: /\.jsx?$/, use: 'babel-loader',},
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
        }),
        new htmlWebpackPlugin({
            title:"预订须知",
            template:"./views/jsj/model.html",
            filename:"www/cancel_order_know.html",
            inject:"body",
            chunks:["cancel_order_know"],
            minify:{
                removeComments:true, //删除注释
                collapseWhitespace:true //删除空格
            }
        }),
        new htmlWebpackPlugin({
            title:"取消规则",
            template:"./views/jsj/model.html",
            filename:"www/cancel_order_rule.html",
            inject:"body",
            chunks:["cancel_order_rule"],
            minify:{
                removeComments:true, //删除注释
                collapseWhitespace:true //删除空格
            }
        }),
        new htmlWebpackPlugin({
            title:"行程详情",
            template:"./views/jsj/model.html",
            filename:"www/check_order_detail.html",
            inject:"body",
            chunks:["check_order_detail"],
            minify:{
                removeComments:true, //删除注释
                collapseWhitespace:true //删除空格
            }
        }),
        new htmlWebpackPlugin({
            title:"联系人",
            template:"./views/jsj/model.html",
            filename:"www/modify_contact_person.html",
            inject:"body",
            chunks:["modify_contact_person"],
            minify:{
                removeComments:true, //删除注释
                collapseWhitespace:true //删除空格
            }
        }),
        new htmlWebpackPlugin({
            title:"更多服务",
            template:"./views/jsj/model.html",
            filename:"www/more_service.html",
            inject:"body",
            chunks:["more_service"],
            minify:{
                removeComments:true, //删除注释
                collapseWhitespace:true //删除空格
            }
        }),
        new htmlWebpackPlugin({
            title:"订单信息",
            template:"./views/jsj/model.html",
            filename:"www/order_pay.html",
            inject:"body",
            chunks:["order_pay"],
            wxJSSdk:"http://res.wx.qq.com/open/js/jweixin-1.0.0.js",
            minify:{
                removeComments:true, //删除注释
                collapseWhitespace:true //删除空格
            }
        }),
        new htmlWebpackPlugin({
            title:"订单信息",
            template:"./views/jsj/model.html",
            filename:"www/order_list.html",
            inject:"body",
            chunks:["order_list"],
            minify:{
                removeComments:true, //删除注释
                collapseWhitespace:true //删除空格
            }
        }),
        new htmlWebpackPlugin({
            title:"评价我们",
            template:"./views/jsj/model.html",
            filename:"www/order_comment.html",
            inject:"body",
            chunks:["order_comment"],
            minify:{
                removeComments:true, //删除注释
                collapseWhitespace:true //删除空格
            }
        }),
        new htmlWebpackPlugin({
            title:"行程详情",
            template:"./views/jsj/model.html",
            filename:"www/order_status.html",
            inject:"body",
            chunks:["order_status"],
            minify:{
                removeComments:true, //删除注释
                collapseWhitespace:true //删除空格
            }
        }),
        new htmlWebpackPlugin({
            title:"首页",
            template:"./views/jsj/model.html",
            filename:"www/main.html",
            inject:"body",
            chunks:["main"],
            minify:{
                removeComments:true, //删除注释
                collapseWhitespace:true //删除空格
            }
        }),
        new htmlWebpackPlugin({
            title:"",
            template:"./views/jsj/model.html",
            filename:"www/index.html",
            inject:"body",
            chunks:["index"],
            minify:{
                removeComments:true, //删除注释
                collapseWhitespace:true //删除空格
            }
        }),
    ]
},{ name:"admin",
    entry:{
        depend_lib:['react-date-picker'],
        admin:"./src/admin/js/index.js"
    },
    output:{
        filename:'dist/[name].js?[hash]',
        path:path.resolve(__dirname,'public/duck'),
        publicPath:"/duck/"
    },
    resolve: {
        modules: [ path.resolve(__dirname, "src"),"node_modules",]
    },
    module:{
        rules:[
            {test: /\.jsx?$/, use: 'babel-loader',},
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
        }),
        new htmlWebpackPlugin({
            title:"飞泊通客服管理系统",
            template:"./views/admin/index.html",
            filename:"www/index.html",
            inject:"body",
            chunks:['depend_lib',"admin"],
            minify:{
                removeComments:true, //删除注释
                collapseWhitespace:true //删除空格
            }
        }),
    ]
},{ name:"additional",
    entry:{
        customer_pay:"./src/additional/js/customer_pay.js"
    },
    output:{
        filename:'dist/[name].js?[hash]',
        path:path.resolve(__dirname,'public/duck/additional'),
        publicPath:"/duck/additional/"
    },
    resolve: {
        modules: [ path.resolve(__dirname, "src"),"node_modules",]
    },
    module:{
        rules:[
            {test: /\.jsx?$/, use: 'babel-loader',},
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
        new htmlWebpackPlugin({
            title:"客户支付",
            template:"./views/additional/model.html",
            filename:"www/customer_pay.html",
            inject:"body",
            chunks:['customer_pay'],
            cssPath:"/duck/additional/css/customer_pay.css",
            wxJSSdk:"http://res.wx.qq.com/open/js/jweixin-1.0.0.js",
            minify:{
                removeComments:true, //删除注释
                collapseWhitespace:true //删除空格
            }
        }),
    ]
}];
//监听编译
//webpack  --watch
//webpack  --watch --config ./config/example.config.js
//npm i --save-dev babel-core babel-loader babel-preset-es2015
// babel-preset-react webpack