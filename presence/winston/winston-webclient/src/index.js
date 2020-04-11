

// TODO add react-router-scroll
import * as R                      from 'ramda';
import React                       from 'react';
import ReactDOM                    from 'react-dom';
import { Provider }                from 'react-redux';
import { Route, Router, Redirect } from 'react-router';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend                from 'react-dnd-html5-backend';
import { ToastContainer, toast }   from 'react-toastify';

import { store, history } from './store';

import Login              from './pages/account/Login';
import Dashboard          from './pages/dashboards';

import {
  fetchTenantByDomain,
  fetchTenantAndLocationByDomains,
  getCurrentTenancy
} from './services/Tenant';

import './index.css';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const currentTenancy = getCurrentTenancy();

const getTenantLocationIdFromAppState = R.path(['App', 'tenancy', 'tenantLocation', 'id']);

const isPublic = R.propEq('domain', 'www')(currentTenancy);

if (currentTenancy && currentTenancy.tenant) {
  store.dispatch(
    fetchTenantByDomain(currentTenancy.tenant.domain)
  );
}

if (currentTenancy.tenant && currentTenancy.tenantLocation) {
  store.dispatch(
    fetchTenantAndLocationByDomains(currentTenancy.tenant.domain, currentTenancy.tenantLocation.subdomain)
  );
}

const renderApp = () => {
  ReactDOM.render(
    <Provider store={ store }>
      <Router history={ history }>
        <DragDropContextProvider backend={ HTML5Backend }>
          <div>

            <Route exact path='/login'       component={ Login }     />
            <Route path='/login/:redirectTo' component={ Login }     />
            <Route path='/dashboard'         component={ Dashboard } />

            {/*<Redirect from="/" to="/dashboard"/>*/}

            <ToastContainer/>
          </div>
        </DragDropContextProvider>
      </Router>
    </Provider>,
    document.getElementById('root')
  );
};

const ensureDependenciesBeforeRender = setInterval(() => {
  if (isPublic || getTenantLocationIdFromAppState(store.getState())) {
    clearInterval(ensureDependenciesBeforeRender);
    renderApp();
  }
}, 10);
