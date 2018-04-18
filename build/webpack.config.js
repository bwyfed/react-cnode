/**
 * Created by BWY on 2018/4/18.
 */
const path = require('path');

module.exports = {
	entry: {
		app: path.join(__dirname,'../client/app.js')
	},
	output: {
		filename: '[name].[hash].js',
		path: path.join(__dirname, '../dist'),
		publicPath: ''
	}
}