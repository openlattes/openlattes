import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import Graph from './Graph';
import ProductionIndicator from './ProductionIndicator';
import TypeIndicator from './TypeIndicator';

const App = () => (
  <Fragment>
    <CssBaseline />
    <Router>
      <div>
        <ul>
          <li><Link to="/collaborations">Colaboração</Link></li>
          <li><Link to="/productions_year">Produções por ano</Link></li>
          <li><Link to="/productions_type">Produções por tipo</Link></li>
        </ul>
        <Route path="/collaborations" component={Graph} />
        <Route path="/productions_year" component={ProductionIndicator} />
        <Route path="/productions_type" component={TypeIndicator} />
      </div>
    </Router>
  </Fragment>
);

export default App;
