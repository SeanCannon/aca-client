import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Layout from './Layout/Layout';
import 'semantic-ui-css/semantic.min.css';

import Home from './Containers/Home';

function App() {
  return (
    <div className="App">
      <Router>
      <Layout>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Layout>
      </Router>
    </div>
  );
}

export default App;
