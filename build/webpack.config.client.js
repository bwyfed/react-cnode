/**
 * Created by BWY on 2018/4/18.
 */
const path = require('path');
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const HtmlWebpackPlugin = require('html-webpack-plugin');
//当前环境是否是开发环境
const isDev = process.env.NODE_ENV === 'development'
console.log('isDev:'+isDev);
const config = webpackMerge(baseConfig, {
	mode: isDev?'development':'production',
	entry: {
		app: path.join(__dirname,'../client/app.js')
	},
	output: {
		filename: '[name].[hash].js',
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, '../client/template.html')
		})
	]
});
if(isDev) {
	config.entry = {
		app: [
			'react-hot-loader/patch',
			path.join(__dirname,'../client/app.js')
		]
	}
	config.devServer = {
		host: '0.0.0.0',	//可以使用任何方式访问,127.0.0.1,IP访问,localhost
		port: '8888',
		contentBase: path.join(__dirname, '../dist'),
		hot: true,
		overlay: {
			errors: true
		},
		publicPath: '/public',
		historyApiFallback: {
			index: '/public/index.html'
		},
    proxy: {
		  '/api': 'http://localhost:3333'
    }
	}
	config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
