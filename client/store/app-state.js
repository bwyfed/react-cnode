/**
 * Created by Hello on 2018/4/22.
 * 跟业务逻辑没有太多关系，控制应用展示的纯前端逻辑
 */
// import { observable, computed, autorun, action } from 'mobx'
import { observable, action } from 'mobx'
import { post } from '../util/http'

export default class AppState {
  @observable user = {
    isLogin: false,
    info: {},
  }

  @action login(accessToken) {
    return new Promise((resolve, reject) => {
      post('/user/login', {}, {
        accessToken,
      }).then((resp) => {
        if (resp.success) {
          this.user.isLogin = true
          this.user.info = resp.data
          resolve()
        } else {
          reject(resp)
        }
      }).catch(reject)
    })
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

