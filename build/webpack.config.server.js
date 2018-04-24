/**
 * Created by BWY on 2018/4/18.
 */
const path = require('path');
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const isDev = process.env.NODE_ENV === 'development'
module.exports = webpackMerge(baseConfig, {
	mode: isDev?'development':'production',
	target: 'node',
	entry: {
		app: path.join(__dirname,'../client/server-entry.js')
	},
  externals: Object.keys(require('../package.json').dependencies),
	output: {
		filename: 'server-entry.js',
		libraryTarget: "commonjs2"
	},
})
