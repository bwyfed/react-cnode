import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import queryString from 'query-string'

import Paper from 'material-ui/Paper'
import Grid from 'material-ui/Grid'
// import Tabs, { Tab } from 'material-ui/Tabs'
// import List from 'material-ui/List'
// import { CircularProgress } from 'material-ui/Progress'
import Button from 'material-ui/Button'
// import IconButton from 'material-ui/IconButton'
// import HomeIcon from '@material-ui/icons/Home'
import { withStyles } from 'material-ui/styles'
// import AppState from '../../store/app-state'
import Container from '../layout/container'

import { homePrimaryStyle } from './styles/styles'
import bg1 from './images/bg1.png'
import btnMusic from './images/btn-music.png'
import btnVideo from './images/btn-video.png'
import btnRead from './images/btn-read.png'

const BgComponent = ({ classes }) => (
  <img className={classes.bgimg1} src={bg1} alt="" />
)
BgComponent.propTypes = {
  classes: PropTypes.object.isRequired,
}

const interComponent = ({ classes }) => (
  <Paper elevation={4} className={classes.interCtn}>
    <Grid container align="stretch" justify="space-between" className={classes.grid1}>
      <Grid item xs={4} md={4} className={`${classes.gridItem1} ${classes.textLeft}`}>
        活动规则
      </Grid>
      <Grid item xs={4} md={4} className={`${classes.gridItem1} ${classes.textRight}`}>
        排行榜
      </Grid>
    </Grid>
    <Grid container className={classes.grid2}>
      <Grid item xs={4} md={4} className={`${classes.gridItem2}`}>
        <Button className={`${classes.gridItem2Btn}`} color="inherit" fullWidth>
          <img src={btnMusic} className={classes.gridItem2BtnImgMusic} alt="" />
        </Button>
      </Grid>
      <Grid item xs={4} md={4} className={`${classes.gridItem2}`}>
        <Button className={`${classes.gridItem2Btn}`} color="inherit">
          <img src={btnVideo} className={classes.gridItem2BtnImgVideo} alt="" />
        </Button>
      </Grid>
      <Grid item xs={4} md={4} className={`${classes.gridItem2}`}>
        <Button className={`${classes.gridItem2Btn}`} color="inherit">
          <img src={btnRead} className={classes.gridItem2BtnImgRead} alt="" />
        </Button>
      </Grid>
    </Grid>
    <Grid container direction="column" alignItems="center" className={classes.grid3}>
      <Grid item className={classes.gridItem3}>
        <Button variant="raised" color="inherit" className={classes.gridItem3Btn}>
          新人特权
        </Button>
      </Grid>
      <Grid item className={classes.gridItem3}>
        <Button variant="raised" color="inherit" className={classes.gridItem3Btn}>
          我为咪咕代言
        </Button>
      </Grid>
    </Grid>
  </Paper>
)
interComponent.propTypes = {
  classes: PropTypes.object.isRequired,
}

const StyledBgComponent = withStyles(homePrimaryStyle)(BgComponent)
const StyledInterComponent = withStyles(homePrimaryStyle)(interComponent)
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
