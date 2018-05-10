/**
 * Created by BWY on 2018/4/18.
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { AppContainer } from 'react-hot-loader' //eslint-disable-line

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles' // 用来创建主题
import { lightBlue, pink } from 'material-ui/colors' // 用来引入主题颜色

import App from './views/App'
import AppState from './store/app-state'

// 创建一个主题theme
const theme = createMuiTheme({
  palette: {
    primary: pink, // 主题色
    accent: lightBlue, // 次要颜色
    type: 'light',
  },
})

const initialState = window.__INITIAL__STATE__ || {}  // eslint-disable-line

const createApp = (TheApp) => {
  class Main extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }
    render() {
      return <TheApp />
    }
  }
  return Main
}

const root = document.getElementById('root');
const render = (Component) => {
  // const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate
  ReactDOM.render(
    <AppContainer>
      <Provider appState={new AppState(initialState.appState)}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Component />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  )
};
render(createApp(App));
if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default; //eslint-disable-line
    // ReactDOM.hydrate(<NextApp />, document.getElementById('root'));
    render(createApp(NextApp));
  })
}
