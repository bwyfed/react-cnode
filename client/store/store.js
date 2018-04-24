/**
 * 创建整个应用的store
 */
import AppStateClass from './app-state'

export const AppState = AppStateClass

export default {
  AppState,
}

export const createStoreMap = () => {
  const res = {
    appState: new AppState(),
  };
  return res;
}
