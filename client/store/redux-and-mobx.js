/* eslint-disable */
import { observable, action } from 'mobx'
import { createStore } from 'redux'

/* redux */
const ADD_ACTION = 'ADD'; //在redux生命周期中唯一的，代表某一项操作
// 注册一个action，这个action是个方法
const add = (num) => {
  return {
    type: ADD_ACTION,
    num,
  }
}
// 初始状态
const initState = {
  count: 0,
}
//传入初始状态，action
const reducers = (state = initState, action) => {
  switch (action.type) {
    case ADD_ACTION:
      return Object.assign({}, state, {
        count: state.count + action.num,
      })
    default:
      return state
  }
}

const reduxStore = createStore(reducers)
//触发一次action
reduxStore.dispatch(add(1))

/* mobx */
const mobxStore = observable({
  count: 0,
  add: action(function (num) {
    this.count += num
  })
})

mobxStore.add(1); //mobxStore.count += 1

/* eslint-enable */
