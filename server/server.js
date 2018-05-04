/**
 * Created by BWY on 2018/4/18.
 */
const express = require('express')
const favicon = require('serve-favicon')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')
// 判断是否是开发环境
const isDev = process.env.NODE_ENV === 'development'

const app = express()
app.use(favicon(path.join(__dirname, '../favicon.ico')))
if (!isDev) { // 生产环境下才存在dist/index.html这样的文件
  const serverEntry = require('../dist/server-entry.js').default
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', function (req, res) {
    const appString = ReactSSR.renderToString(serverEntry)
    res.send(template.replace('<!-- app -->', appString))
  })
} else { // 开发环境下单独处理
  const devStatic = require('./util/dev-static')
  devStatic(app) // 传入app，可以对app做很多操作
}

app.listen(3333, function () {
  console.log('server is listening on 3333');
})
