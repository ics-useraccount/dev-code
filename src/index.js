import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import './css/custom.css';
import Login from "./components/Login";
import Register from "./components/Register";

import { Router, Switch, Route } from 'react-router-dom';

import history from './history';

injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider>
  	<Router history={history}>
  		<Switch>
	      <Route path='/dashboard' component={App} />
	      <Route path='/login' component={Login} />
	      <Route exact path='/' component={Login} />
	      <Route path='/register' component={Register} />
        <Route component={Login}/>
  		</Switch>
  	</Router>
  </MuiThemeProvider>
  , document.getElementById('root'));
