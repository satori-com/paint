import React from 'react';
import ReactDOM from 'react-dom';
import './lib/rtm';
import App from './App';
import Redirect from './components/Redirect'
import { BrowserRouter as Router, Route } from 'react-router-dom';


ReactDOM.render(
  <Router basename={process.env.REACT_APP_BASE_URL}>
    <div>
      <Route exact path={'/'} component={Redirect} />
      <Route path={'/:id'} component={App} />
    </div>
  </Router>,
  document.getElementById('root')
);
