import { createStore } from 'redux';
import reducers from './reducers';

export default () => {
  const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
  const store = createStore(reducers, devTools && devTools());
  return store;
};
