/**
 * Created by BWY on 2018/4/18.
 */
const express = require('express')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')
//判断是否是开发环境
const isDev = process.env.NODE_ENV === 'development'

const app = express()
if(!isDev) {
	const serverEntry = require('../dist/server-entry.js').default
	const template = fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
	app.use('/public', express.static(path.join(__dirname,"../dist")))
	app.get("*",function(req,res) {
		const appString = ReactSSR.renderToString(serverEntry);
		let sendString = template.replace('<!-- app -->',appString);
		res.send(sendString);
	})
} else {
	const devStatic = require('./util/dev.static');
	devStatic(app);
}


app.listen(3333,function(){
	console.log("server is listening on 3333");
});
