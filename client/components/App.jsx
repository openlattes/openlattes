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
          <li><Link to="/coautorias">Coautorias</Link></li>
          <li><Link to="/producoes">Produções por ano</Link></li>
          <li><Link to="/producoes_tipo">Produções por tipo</Link></li>
        </ul>
        <Route path="/coautorias" component={Graph} />
        <Route path="/producoes" component={ProductionIndicator} />
        <Route path="/producoes_tipo" component={TypeIndicator} />
      </div>
    </Router>
  </Fragment>
);

export default App;
