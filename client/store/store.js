/**
 * 创建整个应用的store
 */
import AppStateClass from './app-state'

export const AppState = AppStateClass

export default {
  AppState,
}
// 专门给服务端渲染用的
export const createStoreMap = () => {
  const res = {
    appState: new AppState(),
  };
  return res;
}
