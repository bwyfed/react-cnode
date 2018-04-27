/**
 * 创建整个应用的store
 */
import AppState from './app-state'
import TopicStore from './topic-store'

export { AppState, TopicStore }

export default {
  AppState,
  TopicStore,
}
// 专门给服务端渲染用的
export const createStoreMap = () => {
  const res = {
    appState: new AppState(),
    topicStore: new TopicStore(),
  };
  return res;
}
