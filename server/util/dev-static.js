/**
 * Created by BWY on 2018/4/19.
 */
const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const proxy = require('http-proxy-middleware')
let ReactDomServer = require('react-dom/server')

const serverConfig = require('../../build/webpack.config.server')

const getTemplate = () => (
  new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
)

const Module = module.constructor

const mfs = new MemoryFs()
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs // webpack配置项，fs读取文件使用mfs读取文件
let serverBundle
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))
  // 获取bundle的路径
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8') // 读出的是一个string，而不是一个模块
  // 将字符串转换为一个模块
  const m = new Module() // 创建一个新的module
  m._compile(bundle, 'server-entry.js') // 用module解析js的内容，一定要指定module的名字
  serverBundle = m.exports.default // 通过exports来挂载模块里面的东西
})

module.exports = function (app) {
  app.use('/public', proxy({ // 代理到前端服务器上
    target: 'http://localhost:8888'
  }))
  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle)
      res.send(template.replace('<!-- app -->', content))
    })
  })
}
