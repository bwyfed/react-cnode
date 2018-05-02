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
  const { user } = req.session
  return new Promise((resolve, reject) => {
    const createStoreMap = bundle.createStoreMap
    const createApp = bundle.default
    const routerContext = {}
    const stores = createStoreMap()
    const sheetsRegistry = new SheetsRegistry()
    const jss = create(preset())
    jss.options.createGenerateClassName = createGenerateClassName
    // 服务端渲染时，判断session里是否存在user。若存在则更新store里面的数据
    // 这样在服务端渲染时立即可以拿到user信息
    if (user) {
      stores.appState.user.isLogin = true // 表明登录成功了
      stores.appState.user.info = user
    }
    //保持和客户端一致，不会导致样式变化
    const theme = createMuiTheme({
      palette: {
        primary: colors.pink,
        accent: colors.lightBlue,
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

