/**
 * Created by BWY on 2018/4/19.
 */
const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const proxy = require('http-proxy-middleware')
const asyncBootstrap = require('react-async-bootstrapper')
const ReactDomServer = require('react-dom/server')

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
let serverBundle, createStoreMap
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
  const m = new Module()
  console.log(123)
  m._compile(bundle, 'server-entry.js') // 用module解析js的内容，一定要指定module的名字
  console.log(456)
  serverBundle = m.exports.default // 通过exports来挂载模块里面的东西
  createStoreMap = m.exports.createStoreMap
})

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
  }, {})
}

module.exports = function (app) {
  app.use('/public', proxy({ // 代理到前端服务器上
    target: 'http://localhost:8888'
  }))
  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const routerContext = {}
      const stores = createStoreMap()
      const app = serverBundle(stores, routerContext, req.url)
      asyncBootstrap(app).then(() => {
        // 在有redirect的情况下，react-router会在context上加上属性url
        if (routerContext.url) {
          // 设置浏览器重定向跳转，结束这次请求，并return
          res.status(302).setHeader('Location', routerContext.url)
          res.end()
          return
        }
        console.log(stores.appState.count)
        // 处理header部分，增加SEO功能
        // const helmet = Helmet.rewind()
        // const state = getStoreState(stores)
        const content = ReactDomServer.renderToString(app)
        res.send(template.replace('<!-- app -->', content))
        // const html = ejs.render(template, {
        //   appString: content,
        //   initialState: serialize(state),
        //   meta: helmet.meta.toString(),
        //   title: helmet.title.toString(),
        //   style: helmet.style.toString(),
        //   link: helmet.link.toString(),
        // })
        // res.send(html)
      })
    })
  })
}
