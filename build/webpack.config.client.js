/**
 * Created by BWY on 2018/4/18.
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//当前环境是否是开发环境
const isDev = process.env.NODE_ENV === 'development'
console.log('isDev:'+isDev);
const config = {
	mode: 'none',
	entry: {
		app: path.join(__dirname,'../client/app.js')
	},
	output: {
		filename: '[name].[hash].js',
		path: path.join(__dirname, '../dist'),
		publicPath: '/public'
	},
	module: {
		rules: [
			{
				test: /\.jsx$/,
				loader: 'babel-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: [
					path.join(__dirname, '../node_modules')
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, '../client/template.html')
		})
	]
};
if(isDev) {
	config.devServer = {
		host: '0.0.0.0',	//可以使用任何方式访问,127.0.0.1,IP访问,localhost
		port: '8888',
		contentBase: path.join(__dirname, '../dist'),
		// hot: true,
		overlay: {
			errors: true
		},
		publicPath: '/public',
		historyApiFallback: {
			index: '/public/index.html'
		}
	}
}

module.exports = config
