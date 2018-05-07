import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import queryString from 'query-string'

// import Tabs, { Tab } from 'material-ui/Tabs'
// import List from 'material-ui/List'
// import { CircularProgress } from 'material-ui/Progress'
// import IconButton from 'material-ui/IconButton'
// import HomeIcon from '@material-ui/icons/Home'
import { withStyles } from 'material-ui/styles'
// import AppState from '../../store/app-state'
import Container from '../layout/container'
import InterComponent from './interactive'

import { homePrimaryStyle } from './styles/styles'
import bg1 from './images/bg1.png'

const BgComponent = ({ classes }) => (
  <img className={classes.bgimg1} src={bg1} alt="" />
)
BgComponent.propTypes = {
  classes: PropTypes.object.isRequired,
}

const StyledBgComponent = withStyles(homePrimaryStyle)(BgComponent)
const StyledInterComponent = withStyles(homePrimaryStyle)(InterComponent)
// 注入数据 stores是个对象，包含了在<Provider>组件上定义的任何属性名（appState和topicStore）
@inject(stores => (
  {
    appState: stores.appState,
    topicStore: stores.topicStore,
  }
)) @observer

export default class TopicList extends React.Component {
  // 获取路由对象。router是在使用react-router时会加到react context里面，在最顶层加上去后，所有组件都可以使用
  static contextTypes = {
    router: PropTypes.object,
  }
  constructor() {
    super()
    this.state = {
      // tabIndex: 0,
    }
  }
  componentDidMount() {
    // do something here
  }
  componentWillReceiveProps() {
    // do something here
  }
  // 这个方法定义异步的操作数据。执行完这个方法后，才会继续渲染
  // 可以在这里进行数据初始化
  asyncBootstrap() {
    // 服务端获取数据
    const query = queryString.parse(this.props.location.search)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(query)
      }, 100)
    })
  }

  listItemClick(topic) {
    this.context.router.history.push(`/detail/${topic.id}`)
  }


  render() {
    return (
      <Container>
        <Helmet>
          <title>咪咕王者谁最强</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <StyledBgComponent />
        <StyledInterComponent />
      </Container>
    )
  }
}
// 使用wrappedComponent来验证注入的对象
// TopicList.wrappedComponent.propTypes = {
//   appState: PropTypes.instanceOf(AppState).isRequired,
//   topicStore: PropTypes.object.isRequired,
// }
// 注入路由的location对象。在渲染时已经传进来了，可以直接使用
TopicList.propTypes = {
  location: PropTypes.object.isRequired,
}
