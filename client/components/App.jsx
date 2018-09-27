import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import Graph from './Graph';
import ProductionIndicator from './ProductionIndicator';

const App = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/coautorias">Coautorias</Link></li>
        <li><Link to="/producoes">Produções</Link></li>
      </ul>
      <Route path="/coautorias" component={Graph} />
      <Route path="/producoes" component={ProductionIndicator} />
    </div>
  </Router>
);

export default App;
