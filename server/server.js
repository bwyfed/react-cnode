/**
 * Created by BWY on 2018/4/18.
 */
const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')
// const ReactSSR = require('react-dom/server')
const serverRender = require('./util/server-render')
const fs = require('fs')
const path = require('path')
// 判断是否是开发环境
const isDev = process.env.NODE_ENV === 'development'

const app = express()
app.use(bodyParser.json()) // 把application/json格式的数据转换成req.body上的数据
app.use(bodyParser.urlencoded({ extended: false })) // 表单请求的数据，转换成req.body上的数据
// 设置session用于保存accessToken等信息
app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'react cnode class' // 字符串用于加密cookie
}))

app.use(favicon(path.join(__dirname, '../favicon.ico')))
// 代理API接口，放在服务端渲染代码之前
app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))
if (!isDev) {
  const serverEntry = require('../dist/server-entry.js')
  const template = fs.readFileSync(path.join(__dirname,'../dist/server.ejs'),'utf8');
  app.use('/public', express.static(path.join(__dirname,"../dist")))
  app.get('*', function(req, res, next) {
    serverRender(serverEntry, template, req, res).catch(next)
    // const appString = ReactSSR.renderToString(serverEntry);
    // let sendString = template.replace('<!-- app -->', appString);
    // res.send(sendString);
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}
// 处理错误
app.use(function(error, req, res, next) {
  console.log(error);
  res.status(500).send(error)
})

app.listen(3333, function () {
  console.log('server is listening on 3333');
})
