/**
 * Created by BWY on 2018/4/19.
 */
const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const proxy = require('http-proxy-middleware')

const serverRender = require('./server-render')

const serverConfig = require('../../build/webpack.config.server')

const getTemplate = () => (
  new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
)

//  wrap之后的结果是:
//  `(function(exports, require, module, __filename, __dirname){ ...bundle code})`
const NativeModule = require('module')
const vm = require('vm')  // nodejs中的模块
const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true,
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}

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
  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports // 通过exports来挂载模块里面的东西
})

module.exports = function (app) {
  app.use('/public', proxy({ // 代理到前端服务器上
    target: 'http://localhost:8888'
  }))
  app.get('*', function (req, res, next) {
    if(!serverBundle) {
      return res.send('waiting for compile, refresh later')
    }
    getTemplate().then(template => {
        return serverRender(serverBundle, template, req, res)
    }).catch(next)
  })
}
