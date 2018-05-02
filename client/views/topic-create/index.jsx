import React from 'react'
import SimpleMDE from 'react-simplemde-editor'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'

import TextField from 'material-ui/TextField'
import Radio from 'material-ui/Radio'
import Button from 'material-ui/Button'
import IconReply from '@material-ui/icons/Reply'
import Snackbar from 'material-ui/Snackbar'
import { withStyles } from 'material-ui/styles'

import Container from '../layout/container'
import createStyles from './styles'
import { tabs } from '../../util/variable-define'


@inject(stores => (
  {
    topicStore: stores.topicStore,
    // appState: stores.appState,
  }
)) @observer
class TopicCreate extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      // showEditor: false,
      title: '',
      content: '',
      tab: 'dev',
      open: false,
      message: '',
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleContentChange = this.handleContentChange.bind(this)
    this.handleChangeTab = this.handleChangeTab.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.showMessage = this.showMessage.bind(this)
  }

  // componentDidMount() {
  //   setTimeout(() => {
  //     this.setState({
  //       showEditor: true,
  //     })
  //   }, 500)
  // }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value.trim(),
    })
  }

  handleContentChange(value) {
    this.setState({
      content: value,
    })
  }

  handleChangeTab(e) {
    this.setState({
      tab: e.currentTarget.value,
    })
  }

  handleCreate() {
    // do create here
    const {
      tab, title, content,
    } = this.state
    // const appState = this.props.appState
    if (!title) {
      this.showMessage('title必须填写')
      return
      // return appState.notify({
      //   message: '标题必须填写',
      // })
    }
    if (!content) {
      this.showMessage('内容必须填写')
      return
      // return appState.notify({
      //   message: '内容不能为空',
      // })
    }
    this.props.topicStore.createTopic(title, tab, content)
      .then(() => {
        this.context.router.history.push('/index') // 话题创建成功，则跳回首页
      })
      .catch((err) => {
        this.showMessage(err.message)
        // appState.notify({
        //   message: err.message,
        // })
      })
  }

  showMessage(message) {
    this.setState({
      open: true,
      message,
    })
  }

  handleClose() {
    this.setState({
      open: false,
    })
  }

  render() {
    const { classes } = this.props
    const {
      message,
      open,
    } = this.state
    return (
      <Container>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          message={<span id="message-id">{message}</span>}
          open={open}
          onClose={this.handleClose}
        />
        <div className={classes.root}>
          <TextField
            className={classes.title}
            label="标题"
            value={this.state.title}
            onChange={this.handleTitleChange}
            fullWidth
          />
          <SimpleMDE
            onChange={this.handleContentChange}
            value={this.state.newReply}
            options={{
              toolbar: false,
              spellChecker: false,
              placeholder: '发表你的精彩意见',
            }}
          />
          <div>
            {
              Object.keys(tabs).map((tab) => {
                if (tab !== 'all' && tab !== 'good') {
                  return (
                    <span className={classes.selectItem} key={tab}>
                      <Radio
                        value={tab}
                        checked={tab === this.state.tab}
                        onChange={this.handleChangeTab}
                      />
                      {tabs[tab]}
                    </span>
                  )
                }
                return null
              })
            }
          </div>
          <Button variant="fab" color="primary" onClick={this.handleCreate} className={classes.replyButton}>
            <IconReply />
          </Button>
        </div>
      </Container>
    )
  }
}

TopicCreate.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
  // appState: PropTypes.object.isRequired,
}

TopicCreate.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(createStyles)(TopicCreate)
