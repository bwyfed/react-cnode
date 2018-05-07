/**
 * Created by Hello on 2018/4/22.
 * 跟业务逻辑没有太多关系，控制应用展示的纯前端逻辑
 */
// import { observable, computed, autorun, action } from 'mobx'
import { observable, computed, action } from 'mobx'

export default class AppState {
  constructor({ count, name } = { count: 0, name: 'Jokcy' }) {
    this.count = count
    this.name = name
  }
  @observable count
  @observable name
  @computed get msg() {
    return `${this.name} say count is ${this.count}`
  }
  @action add() {
    this.count += 1
  }
  @action changeName(name) {
    this.name = name
  }
  toJson() {
    return {
      count: this.count,
      name: this.name,
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
