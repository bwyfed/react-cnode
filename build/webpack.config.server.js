/**
 * Created by BWY on 2018/4/18.
 */
const path = require('path');
const isDev = process.env.NODE_ENV === 'development'
module.exports = {
	mode: isDev?'development':'production',
	target: 'node',
	entry: {
		app: path.join(__dirname,'../client/server-entry.js')
	},
	output: {
		filename: 'server-entry.js',
		path: path.join(__dirname, '../dist'),
		publicPath: '/public',
		libraryTarget: "commonjs2"
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
	}
}