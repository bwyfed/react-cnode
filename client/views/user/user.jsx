import React from 'react'
import PropTypes from 'prop-types'
import {
  inject,
  observer,
} from 'mobx-react'

import Avatar from 'material-ui/Avatar'
import { withStyles } from 'material-ui/styles'

import UserIcon from '@material-ui/icons/AccountCircle'

import Container from '../layout/container'
import userStyles from './styles/user-style'

@inject(stores => (
  {
    user: stores.appState.user,
  }
)) @observer
class User extends React.Component {
  componentDidMount() {
    // do something here
  }

  render() {
    const { classes } = this.props
    const {
      // isLogin,  // 为什么视频4-9节中是不报错的?
      info,
    } = this.props.user
    // const user = this.props.user.info
    return (
      <Container>
        <div className={classes.avatar}>
          <div className={classes.bg} />
          {
            info.avatar_url ?
              <Avatar className={classes.avatarImg} src={info.avatar_url} /> :
              <Avatar className={classes.avatarImg}>
                <UserIcon />
              </Avatar>
          }
          <span className={classes.userName}>{info.loginname || '未登录'}</span>
        </div>
        {this.props.children}
      </Container>
    )
  }
}

User.wrappedComponent.propTypes = {
  user: PropTypes.object.isRequired,
}
User.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
}

export default withStyles(userStyles)(User)
