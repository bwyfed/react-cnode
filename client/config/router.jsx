import React from 'react'
import {
  Route,
  Redirect,
  withRouter,
} from 'react-router-dom'
import {
  inject,
  observer,
} from 'mobx-react'
import PropTypes from 'prop-types'
import Home from '../views/home/index'
import TopicList from '../views/topic-list/index'
import TopicDetail from '../views/topic-detail/index'
import UserInfo from '../views/user/info'
import UserLogin from '../views/user/login'
import TopicCreate from '../views/topic-create/index'
import TestApi from '../views/test/api-test'

const PrivateRoute = ({ isLogin, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={
      props => (
        isLogin ?
          <Component {...props} /> :
          <Redirect
            to={{
              pathname: '/user/login',
              search: `?from=${rest.path}`,
            }}
          />
      )
    }
  />
)

const InjectedPrivateRoute = withRouter(inject(stores => (
  {
    isLogin: stores.appState.user.isLogin,
  }
))(observer(PrivateRoute)))

PrivateRoute.propTypes = {
  isLogin: PropTypes.bool,
  component: PropTypes.element.isRequired,
}
PrivateRoute.defaultProps = {
  isLogin: false,
}


export default () => [
  <Route path="/" exact render={() => <Redirect to="/index" />} key="first" />,
  <Route path="/index" component={Home} key="index" />,
  <Route path="/list" component={TopicList} key="list" />,
  <Route path="/detail/:id" component={TopicDetail} key="detail" />,
  <Route path="/user/login" exact component={UserLogin} key="user-login" />,
  <InjectedPrivateRoute path="/user/info" exact component={UserInfo} key="user-info" />,
  <InjectedPrivateRoute path="/topic/create" component={TopicCreate} key="create" />,
  <Route path="/test" component={TestApi} key="test" />,
]
