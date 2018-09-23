import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import Graph from './Graph';

const App = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/graph">Graph</Link></li>
      </ul>
      <Route path="/graph" component={Graph} />
    </div>
  </Router>
);

export default App;
