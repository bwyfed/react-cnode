/**
 * Created by Hello on 2018/4/22.
 */
import { observable, computed, action } from 'mobx'

export default class AppState {
  @observable count = 0
  @observable name = 'Jokcy'
  @computed get msg() {
    return `${this.name} say count is ${this.count}`
  }
  @action add() {
    this.count += 1
  }
  @action changeName(name) {
    this.name = name
  }
}

// const appState = new AppState()
// 测试用代码
/*
autorun(() => {
  console.log(appState.msg)
})

setInterval(() => {
  appState.add()
}, 1000)
*/
// export default appState
