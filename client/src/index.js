/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { Router } from 'react-router-dom';
import { Security, Auth } from '@okta/okta-react';

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

//import AdminLayout from "layouts/Admin.jsx";
import config from './app.config';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers/index';

import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    reducers, composeEnhancers(applyMiddleware(logger, thunk))
);

const auth = new Auth({
  history,
  issuer: config.issuer,
  client_id: config.client_id,
  redirect_uri: config.redirect_uri,
  onAuthRequired: ({history}) => history.push('/')
});


ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
          <Security auth={auth}>
              <App />
          </Security>
      </Router>
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();