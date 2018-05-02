import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import queryString from 'query-string'

import Tabs, { Tab } from 'material-ui/Tabs'
import List from 'material-ui/List'
import { CircularProgress } from 'material-ui/Progress'
import Button from 'material-ui/Button'
import AppState from '../../store/app-state'
import Container from '../layout/container'
import TopicListItem from './list-item'
import { tabs } from '../../util/variable-define'
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
    this.changeName = this.changeName.bind(this) // 测试用代码
    this.changeTab = this.changeTab.bind(this)
    this.listItemClick = this.listItemClick.bind(this)
  }
  componentDidMount() {
    const tab = this.getTab()
    this.props.topicStore.fetchTopics(tab)
    // do somethin here
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search))
    }
  }
  // 这个方法定义异步的操作数据。执行完这个方法后，才会继续渲染
  // 可以在这里进行数据初始化
  asyncBootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3
        resolve(true)
      })
    })
  }
  changeName(event) {
    this.props.appState.changeName(event.target.value)
  }
  changeTab(e, value) {
    // this.setState({
    //   tabIndex: index,
    // })
    // 传入的value值。点击某个tab后，做路由跳转
    this.context.router.history.push({
      pathname: '/index', // 视频中是/index路由，但是现在还不支持/index。当前值切换query。问题已解决，重新定义路由
      search: `?tab=${value}`,
    })
  }
  getTab(search = this.props.location.search) {
    const query = queryString.parse(search)
    return query.tab || 'all'
  }

  listItemClick(topic) {
    this.context.router.history.push(`/detail/${topic.id}`)
  }


  render() {
    // const { tabIndex } = this.state
    const { topicStore } = this.props // 注入后可以获取注入的数据
    const topicList = topicStore.topics
    const {
      createdTopics,
    } = topicStore
    const syncingTopics = topicStore.syncing
    const tab = this.getTab()
    const {
      user,
    } = this.props.appState
    // 测试假数据
    // const topic = {
    //   title: 'This is title',
    //   username: 'Jokcy',
    //   reply_count: 20,
    //   visit_count: 30,
    //   create_at: 'afdfjdkfdjfjd',
    //   tab: 'share',
    // }
    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <Tabs value={tab} onChange={this.changeTab}>
          {
            Object.keys(tabs).map(t => (
              <Tab key={t} label={tabs[t]} value={t} />
            ))
          }
        </Tabs>
        <List style={{ backgroundColor: '#dfdfdf' }}>
          {
            createdTopics.map((topic) => {
              topic = Object.assign({}, topic, {
                author: user.info,
              })
              return (
                <TopicListItem
                  key={topic.id}
                  onClick={() => this.listItemClick(topic)}
                  topic={topic}
                />
              )
            })
          }
        </List>
        <List>
          {
            topicList.map(topic => (
              <TopicListItem
                key={topic.id}
                onClick={() => this.listItemClick(topic)}
                topic={topic}
              />
            ))
          }
        </List>
        {
          syncingTopics ?
            (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '40px 0',
                }}
              >
                <CircularProgress color="primary" size={100} />
              </div>
            ) :
            null
        }
        <Button variant="raised" color="primary">This is a button</Button>
        <input type="text" onChange={this.changeName} />
        <span>{this.props.appState.msg}</span>
      </Container>
    )
  }
}
// 使用wrappedComponent来验证注入的对象
TopicList.wrappedComponent.propTypes = {
  appState: PropTypes.instanceOf(AppState).isRequired,
  topicStore: PropTypes.object.isRequired,
}
// 注入路由的location对象。在渲染时已经传进来了，可以直接使用
TopicList.propTypes = {
  location: PropTypes.object.isRequired,
}
