const serialize = require('serialize-javascript')
const ejs = require('ejs')
const asyncBootstrap = require('react-async-bootstrapper')
const ReactDomServer = require('react-dom/server')
const Helmet = require('react-helmet').default

const SheetsRegistry = require('react-jss').SheetsRegistry
const create = require('jss').create
const preset = require('jss-preset-default').default
const createMuiTheme = require('material-ui/styles').createMuiTheme
const createGenerateClassName = require('material-ui/styles/createGenerateClassName').default
const colors = require('material-ui/colors')

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
    // Create a sheetsRegistry instance.
    const sheetsRegistry = new SheetsRegistry();
    // Configure JSS
    const jss = create(preset())
    jss.options.createGenerateClassName = createGenerateClassName
    // Create a theme instance.
    const theme = createMuiTheme({ // 保持和客户端一致
      palette: {
        primary: colors.pink, // 主题色
        accent: colors.lightBlue, // 次要颜色
        type: 'light',
      },
    })
    const app = createApp(stores, routerContext, sheetsRegistry, jss, theme, req.url)

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
        materialCss: sheetsRegistry.toString(),
      })
      res.send(html)
      resolve()
    }).catch(reject)
  })
}

