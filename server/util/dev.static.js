/**
 * Created by BWY on 2018/4/19.
 */
const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const proxy = require('http-proxy-middleware')
const serialize = require('serialize-javascript')
const ejs = require('ejs')
const asyncBootstrap = require('react-async-bootstrapper')
let ReactDomServer = require('react-dom/server')
const Helmet = require('react-helmet').default

const serverConfig = require('../../build/webpack.config.server')

const getTemplate = ()=> {
	return new Promise((resolve, reject)=>{
		// axios.get('http://localhost:8888/public/index.html')
		axios.get('http://localhost:8888/public/server.ejs')
			.then(res=>{
				resolve(res.data);
			})
			.catch(reject)
	})
}

// const Module = module.constructor
//  wrap之后的结果是:
//  `(function(exports, require, module, __filename, __dirname){ ...bundle code})`
const NativeModule = require('module')
const vm = require('vm')  // nodejs中的模块
const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}

const mfs = new MemoryFs
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs;	//webpack配置项，fs读取文件使用mfs读取文件
let serverBundle, createStoreMap;
serverCompiler.watch({}, (err, stats) => {
  if(err) throw err
	stats = stats.toJson();
	stats.errors.forEach(err => console.error(err))
	stats.warnings.forEach(warn => console.warn(warn))
	//获取bundle的路径
	const bundlePath = path.join(
		serverConfig.output.path,
		serverConfig.output.filename
	)
	const bundle = mfs.readFileSync(bundlePath,'utf-8')
	//将字符串转换为一个模块
	// const m = new Module()	//创建一个新的module
	// m._compile(bundle, 'server-entry.js')	//用module解析js的内容，一定要指定module的名字
	const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports.default  // 通过exports来挂载模块里面的东西
  createStoreMap = m.exports.createStoreMap
})

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  },{})
}

module.exports = function(app) {
	app.use('/public',proxy({
		target: 'http://localhost:8888'
	}))
	app.get("*", function (req, res) {
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
        // 处理header部分，增加SEO功能
        const helmet = Helmet.rewind()
        const state = getStoreState(stores)
        const content = ReactDomServer.renderToString(app)
        // res.send(template.replace('<!-- app -->',content))
        const html = ejs.render(template, {
          appString: content,
          initialState: serialize(state),
          meta: helmet.meta.toString(),
          title: helmet.title.toString(),
          style: helmet.style.toString(),
          link: helmet.link.toString(),
        })
        res.send(html)
      })
		})
	})
}
