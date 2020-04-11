import * as R              from 'ramda';
import { combineReducers } from 'redux';
import { routerReducer }   from 'react-router-redux';
import { toast }           from 'react-toastify';

import RBACDashboardReducer                   from './pages/dashboards/RBAC/reducer';
import RBACDashboardInitialState              from './pages/dashboards/RBAC/initialState';

import membersDashboardReducer                from './pages/dashboards/Members/reducer';
import membersDashboardInitialState           from './pages/dashboards/Members/initialState';

import RBACServiceReducer                     from './services/RBAC/reducer';
import RBACServiceInitialState                from './services/RBAC/initialState';

import tenantMemberProfileCardReducer         from './components/TenantMemberProfileCard/reducer';
import tenantMemberProfileCardInitialState    from './components/TenantMemberProfileCard/initialState';

import tenantMemberEnrollmentFormReducer      from './components/TenantMemberEnrollmentForm/reducer';
import tenantMemberEnrollmentFormInitialState from './components/TenantMemberEnrollmentForm/initialState';

import cloudUserSearchReducer                 from './components/CloudUserSearch/reducer';
import cloudUserSearchInitialState            from './components/CloudUserSearch/initialState';

const initialAppState = {
  dashboardViewport                       : { height : 0, width : 0 },
  tenantMemberProfileCardViewport         : { height : 0, width : 0 },
  focusedPage                             : '',
  welcomeMemberViewport                   : { height : 0, width : 0 },
  welcomeManagerViewport                  : { height : 0, width : 0 },
  enrollDashboardViewport                 : { height : 0, width : 0 },
  devicesDashboardTabsDefaultActiveKey    : 1,
  incentivesDashboardTabsDefaultActiveKey : 1,
  session                                 : { loggedIn : false },
  tenancy                                 : { tenant : { domain : 'www' }, tenantLocation : {} }
};

const loadReducer = R.curry((initialState, reducer, state, action) => {
  try {
    return R.invoker(2, action.type)(R.defaultTo(initialState, state), action, reducer)
  } catch (e) {
    return R.defaultTo(initialState, state);
  }
});

const __reduce = path => (state, action) => R.assocPath(path, action.data)(state);

const hashNotification = R.compose(
  R.join('.'),
  R.map(R.invoker(0, 'charCodeAt')),
  R.split('')
);

const globalNotificationReducer = cache => (state, action) => {
  if (action && action.data) {
    const { message, severity } = action.data;
    const hash = hashNotification(message);
    if (!cache[hash]) {
      toast(message, {
        onOpen  : () => cache[hash] = true,
        onClose : () => delete cache[hash],
        type    : severity
      });
    }
  }
  return state;
};

const appReducer = {
  'app.resizeDashboard'               : __reduce(['dashboardViewport']),
  'app.resizeTenantMemberProfileCard' : __reduce(['tenantMemberProfileCardViewport']),
  'app.resizeWelcomeMember'           : __reduce(['welcomeMemberViewport']),
  'app.resizeWelcomeManager'          : __reduce(['welcomeManagerViewport']),
  'app.resizeEnrollDashboard'         : __reduce(['enrollDashboardViewport']),
  'app.setFocusedPage'                : __reduce(['focusedPage']),
  'app.devicesDashboardTabFocus'      : __reduce(['devicesDashboardTabsDefaultActiveKey']),
  'app.incentivesDashboardTabFocus'   : __reduce(['incentivesDashboardTabsDefaultActiveKey']),
  'app.ensureTenancyTenant'           : __reduce(['tenancy', 'tenant']),
  'app.ensureTenancyLocation'         : __reduce(['tenancy', 'tenantLocation']),
  'app.session'                       : __reduce(['session']),
  'app.notify'                        : globalNotificationReducer({})
};

export default combineReducers({
  routing                    : routerReducer,
  MembersDashboard           : loadReducer(membersDashboardInitialState,           membersDashboardReducer),
  RBACDashboard              : loadReducer(RBACDashboardInitialState,              RBACDashboardReducer),
  RBACService                : loadReducer(RBACServiceInitialState,                RBACServiceReducer),
  TenantMemberProfileCard    : loadReducer(tenantMemberProfileCardInitialState,    tenantMemberProfileCardReducer),
  TenantMemberEnrollmentForm : loadReducer(tenantMemberEnrollmentFormInitialState, tenantMemberEnrollmentFormReducer),
  CloudUserSearch            : loadReducer(cloudUserSearchInitialState,            cloudUserSearchReducer),
  App                        : loadReducer(initialAppState,                        appReducer)
});
