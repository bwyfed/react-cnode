const serialize = require('serialize-javascript')
const ejs = require('ejs')
const asyncBootstrap = require('react-async-bootstrapper')
const ReactDomServer = require('react-dom/server')
const Helmet = require('react-helmet').default

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  },{})
}

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const createStoreMap = bundle.createStoreMap
    const createApp = bundle.default
    const routerContext = {}
    const stores = createStoreMap()
    const app = createApp(stores, routerContext, req.url)

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
      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
      })
      res.send(html)
      resolve()
    }).catch(reject)
  })
}

