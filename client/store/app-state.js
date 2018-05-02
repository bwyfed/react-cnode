/**
 * Created by Hello on 2018/4/22.
 * 跟业务逻辑没有太多关系，控制应用展示的纯前端逻辑
 */
// import { observable, computed, autorun, action } from 'mobx'
import { observable, action, toJS } from 'mobx'
import { post, get } from '../util/http'

export default class AppState {
  @observable user = {
    isLogin: false, // 用户是否登录，默认未登录
    info: {}, // 服务端返回的用户"个人信息"，登录成功后会设置给它
    detail: { // 用户详情信息，包含最近发布的帖子和最近回复
      recentTopics: [],
      recentReplies: [],
      syncing: false,
    },
    collections: { // 用户收藏的话题
      syncing: false,
      list: [],
    },
  }
  // 因为AppState并没有构造方法，所以换种方式初始化数据
  init({ user }) {
    if (user) {
      this.user = user
    }
  }
  // 执行登录操作，接收accessToken
  @action login(accessToken) {
    return new Promise((resolve, reject) => {
      post('/user/login', {}, {
        accessToken,
      }).then((resp) => {
        if (resp.success) {
          this.user.info = resp.data
          this.user.isLogin = true
          resolve()
        } else {
          reject(resp)
        }
      }).catch(reject)
    })
  }

  @action getUserDetail() {
    this.user.detail.syncing = true
    return new Promise((resolve, reject) => {
      get(`/user/${this.user.info.loginname}`) // 请求地址写错了，返回的数据格式不对，前端总报错数据格式不正确
        .then((resp) => {
          if (resp.success) {
            this.user.detail.recentReplies = resp.data.recent_replies
            this.user.detail.recentTopics = resp.data.recent_topics
            resolve()
          } else {
            reject()
          }
          this.user.detail.syncing = false
        }).catch((err) => {
          this.user.detail.syncing = false
          reject(err)
        })
    })
  }

  @action getUserCollection() {
    this.user.collections.syncing = true
    return new Promise((resolve, reject) => {
      get(`/topic_collect/${this.user.info.loginname}`) // 请求地址写错了，返回的数据格式不对，前端总报错数据格式不正确
        .then((resp) => {
          if (resp.success) {
            this.user.collections.list = resp.data
            resolve()
          } else {
            reject()
          }
          this.user.collections.syncing = false
        }).catch((err) => {
          this.user.collections.syncing = false
          reject(err)
        })
    })
  }
  // 给服务端渲染使用。把observable的数据转化为正常的JS对象
  toJson() {
    return {
      user: toJS(this.user),
    }
  }
}

// const appState = new AppState()
// 测试代码，观察状态更新
/*
// 一旦appState有更新了，就会重新调用autorun
autorun(() => {
  console.log(appState.msg)
})
// 测试,每隔一秒更新下store
setInterval(() => {
  appState.add()
}, 1000)
*/
// export default appState

