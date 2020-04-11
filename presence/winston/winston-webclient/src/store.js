
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware }                      from 'react-router-redux';
import thunk                                     from 'redux-thunk';
import createHistory                             from 'history/createBrowserHistory';
import reducers                                  from './reducers';

const history = createHistory();

const store = compose(
  applyMiddleware(
    routerMiddleware(history),
    thunk
  ),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : a => a
)(createStore)(reducers);

export { store, history };
