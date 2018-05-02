import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import TopicList from '../views/topic-list/index'
import TopicDetail from '../views/topic-detail/index'
import UserInfo from '../views/user/info'
import UserLogin from '../views/user/login'
import TopicCreate from '../views/topic-create/index'
import TestApi from '../views/test/api-test'

export default () => [
  <Route path="/" exact render={() => <Redirect to="/index" />} key="first" />,
  <Route path="/index" component={TopicList} key="index" />,
  <Route path="/detail/:id" component={TopicDetail} key="detail" />,
  <Route path="/user/login" exact component={UserLogin} key="user-login" />,
  <Route path="/user/info" exact component={UserInfo} key="user-info" />,
  <Route path="/topic/create" component={TopicCreate} key="create" />,
  <Route path="/test" component={TestApi} key="test" />,
]
