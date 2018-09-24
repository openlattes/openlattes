import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import Graph from './Graph';
import StackBar from './StackedBar';

const App = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/coautorias">Coautorias</Link></li>
        <li><Link to="/producoes">Produções</Link></li>
      </ul>
      <Route path="/coautorias" component={Graph} />
      <Route path="/producoes" component={StackBar} />
    </div>
  </Router>
);

export default App;
