import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import Tabs, { Tab } from 'material-ui/Tabs'
import Button from 'material-ui/Button'
import { AppState } from '../../store/app-state'
import Container from '../layout/container'
import TopicListItem from './list-item'
@inject('appState') @observer

export default class TopicList extends React.Component {
  constructor() {
    super()
    this.state = {
      tabIndex: 0,
    }
    this.changeName = this.changeName.bind(this) // 测试用代码
    this.changeTab = this.changeTab.bind(this)
    this.listItemClick = this.listItemClick.bind(this)
  }
  componentDidMount() {
    // do somethin here
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
  changeTab(e, index) {
    this.setState({
      tabIndex: index,
    })
  }
  /* eslint-disable */
  listItemClick() {

  }
  /* eslint-enable */

  render() {
    const { tabIndex } = this.state
    // 测试假数据
    const topic = {
      title: 'This is title',
      username: 'Jokcy',
      reply_count: 20,
      visit_count: 30,
      create_at: 'afdfjdkfdjfjd',
      tab: 'share',
    }
    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is description" />
        </Helmet>
        <Tabs value={tabIndex} onChange={this.changeTab}>
          <Tab label="全部" />
          <Tab label="分享" />
          <Tab label="工作" />
          <Tab label="问答" />
          <Tab label="精品" />
          <Tab label="测试" />
        </Tabs>
        <TopicListItem onClick={this.listItemClick} topic={topic} />
        <Button variant="raised" color="primary">This is a button</Button>
        <input type="text" onChange={this.changeName} />
        <span>{this.props.appState.msg}</span>
      </Container>
    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
}
