import React from 'react'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'
import { Redirect } from 'react-router-dom'

import queryString from 'query-string'

import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'

import UserWrapper from './user'
import loginStyles from './styles/login-style'

@inject(stores => (
  {
    appState: stores.appState,
    user: stores.appState.user,
  }
)) @observer
class UserLogin extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.state = {
      accesstoken: '',
      helpText: '',
    }
    this.handleInput = this.handleInput.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }

  getFrom(location = this.props.location) {
    const query = queryString.parse(location.search)
    return query.from || '/user/info'
  }

  componentWillMount() {
    // if (this.props.user.isLogin) {
    //   // 使用replace防止无限循环
    //   this.context.router.history.replace('/user/info')
    // }
  }

  handleInput(event) {
    this.setState({
      accesstoken: event.target.value.trim(),
    })
  }

  handleLogin() {
    // 判断输入内容是否正确
    if (!this.state.accesstoken) {
      return this.setState({
        helpText: '必须填写',
      })
    }
    this.setState({
      helpText: '',
    })
    return this.props.appState.login(this.state.accesstoken)
      .then(() => {
        // console.log('登录成功！！')
        // this.context.router.history.replace('/user/info') // 登录成功后进行跳转
      })
      .catch((error) => {
        console.log(error) // eslint-disable-line
      })
  }

  render() {
    const { classes } = this.props
    const from = this.getFrom()
    const { isLogin } = this.props.user

    if (isLogin) {
      return <Redirect to={from} />
    }
    return (
      <UserWrapper>
        <div className={classes.root}>
          <TextField
            label="请输入Cnode AccessToken"
            placeholder="请输入Cnode AccessToken"
            required
            helperText={this.state.helpText}
            value={this.state.accesstoken}
            onChange={this.handleInput}
            className={classes.input}
          />
          <Button
            variant="raised"
            color="primary"
            onClick={this.handleLogin}
            className={classes.loginButton}
          >登 录
          </Button>
        </div>
      </UserWrapper>
    )
  }
}

UserLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}
// 和store相关的检查都要使用wrappedComponent
UserLogin.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

export default withStyles(loginStyles)(UserLogin)
