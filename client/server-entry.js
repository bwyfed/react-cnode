/**
 * Created by BWY on 2018/4/18.
 */
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'
import { JssProvider } from 'react-jss'
import { MuiThemeProvider } from 'material-ui/styles'
import App from './views/App'

import { createStoreMap } from './store/store'
// 使用静态渲染。让mobx在服务端渲染的时候不会重复数据变换
useStaticRendering(true);
export default (stores, routerContent, sheetsRegistry, jss, theme, url) =>
  (
    <Provider {...stores}>
      <StaticRouter context={routerContent} location={url}>
        <JssProvider registry={sheetsRegistry} jss={jss}>
          <MuiThemeProvider theme={theme}>
            <App />
          </MuiThemeProvider>
        </JssProvider>
      </StaticRouter>
    </Provider>
  )

export { createStoreMap }
